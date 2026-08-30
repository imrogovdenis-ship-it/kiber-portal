import { loadAmoCrmLeadConfig, sendAmoCrmLeadDuplicate, type AmoCrmLeadPayload } from './amocrm';
import { loadTelegramLeadConfig, sendTelegramLeadDuplicate, type LeadPayload as TelegramLeadPayload } from './telegram';

export type LeadRoutingMode = 'disabled' | 'dry-run' | 'live';
export type EnvLike = Record<string, string | undefined>;
export type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

type ChannelName = 'amoCRM' | 'telegram';
type ChannelResult = Awaited<ReturnType<typeof sendAmoCrmLeadDuplicate>> | Awaited<ReturnType<typeof sendTelegramLeadDuplicate>>;
type GuardedChannelResult = ChannelResult & { attempts?: number; error?: 'external-channel-failed' | 'external-channel-timeout' };

interface NormalizedLead {
  name: string;
  contact: string;
  email?: string;
  robot?: string;
  event?: string;
  sourcePage: string;
  referer?: string;
  ip?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  submittedAt: string;
  submittedAtUnix: number;
  requestId: string;
  deployEnv: string;
}

const json = (body: unknown, status = 200, headers: HeadersInit = {}) => new Response(JSON.stringify(body, null, 2), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
});

const redirect = (location: string, status = 303) => new Response(null, {
  status,
  headers: { location },
});

const wantsHtml = (request: Request) => request.headers.get('accept')?.includes('text/html') === true;

const safeThanksLocation = (lead: Pick<NormalizedLead, 'robot'>) => {
  const params = new URLSearchParams();
  if (lead.robot) params.set('robot', lead.robot);
  params.set('request', 'preview');
  return `/lead/thanks/?${params.toString()}`;
};

const clean = (value: unknown) => {
  const normalized = String(value ?? '').trim();
  return normalized.length ? normalized : undefined;
};

const valueFrom = (body: Record<string, unknown>, url: URL, key: string) => clean(body[key]) ?? clean(url.searchParams.get(key));

const parseBody = async (request: Request): Promise<Record<string, unknown>> => {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return await request.json() as Record<string, unknown>;
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    return Object.fromEntries([...form.entries()].map(([key, value]) => [key, typeof value === 'string' ? value : value.name]));
  }
  return {};
};

const routingMode = (env: EnvLike): LeadRoutingMode => {
  const mode = clean(env.LEAD_ROUTING_MODE);
  if (mode === 'live' || mode === 'dry-run') return mode;
  if (env.LEAD_ROUTING_ENABLED === 'true') return 'dry-run';
  return 'disabled';
};

const validate = (lead: Pick<NormalizedLead, 'name' | 'contact'>) => {
  const errors: string[] = [];
  if (!lead.name) errors.push('name is required');
  if (!lead.contact) errors.push('contact is required');
  return errors;
};

const requestId = () => `lead_${Date.now()}_${crypto.randomUUID()}`;

const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;
const successfulLeadCache = new Map<string, { expiresAt: number; body: Record<string, unknown> }>();

const positiveInteger = (value: string | undefined, fallback: number, max: number) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const pruneLeadCache = (now = Date.now()) => {
  for (const [key, value] of successfulLeadCache.entries()) {
    if (value.expiresAt <= now) successfulLeadCache.delete(key);
  }
};

const cacheKey = (lead: Pick<NormalizedLead, 'requestId' | 'deployEnv'>) => `${lead.deployEnv}:${lead.requestId}`;

const timeoutAfter = (ms: number) => new Promise<never>((_resolve, reject) => {
  const timeout = setTimeout(() => {
    clearTimeout(timeout);
    reject(new Error('external-channel-timeout'));
  }, ms);
});

const isTimeoutError = (error: unknown) => error instanceof Error && /timeout/i.test(error.message);

const withTimeout = async <T>(operation: Promise<T>, timeoutMs: number) => {
  if (timeoutMs <= 0) return operation;
  return Promise.race([operation, timeoutAfter(timeoutMs)]);
};

const runChannel = async (
  _name: ChannelName,
  operation: () => Promise<ChannelResult>,
  env: EnvLike,
): Promise<GuardedChannelResult> => {
  const maxAttempts = positiveInteger(env.LEAD_ROUTING_RETRY_ATTEMPTS, 2, 3);
  const timeoutMs = positiveInteger(env.LEAD_ROUTING_TIMEOUT_MS, 8000, 15000);
  let attempts = 0;
  let timeout = false;

  while (attempts < maxAttempts) {
    attempts += 1;
    try {
      return { ...(await withTimeout(operation(), timeoutMs)), attempts };
    } catch (error) {
      timeout = timeout || isTimeoutError(error);
      if (attempts >= maxAttempts) break;
    }
  }

  return {
    ok: false,
    attempts,
    error: timeout ? 'external-channel-timeout' : 'external-channel-failed',
  };
};

const normalizeLead = (request: Request, body: Record<string, unknown>, env: EnvLike): NormalizedLead => {
  const url = new URL(request.url);
  const submittedAt = new Date().toISOString();
  const submittedAtUnix = Math.floor(Date.parse(submittedAt) / 1000);

  return {
    name: valueFrom(body, url, 'name') ?? '',
    contact: valueFrom(body, url, 'contact') ?? '',
    email: valueFrom(body, url, 'email'),
    robot: valueFrom(body, url, 'robot') ?? valueFrom(body, url, 'scenario'),
    event: valueFrom(body, url, 'event'),
    sourcePage: clean(body.source_page) ?? clean(body.sourcePage) ?? request.headers.get('referer') ?? `${url.origin}/lead/request/`,
    referer: request.headers.get('referer') ?? undefined,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    utmSource: valueFrom(body, url, 'utm_source') ?? valueFrom(body, url, 'utmSource'),
    utmMedium: valueFrom(body, url, 'utm_medium') ?? valueFrom(body, url, 'utmMedium'),
    utmCampaign: valueFrom(body, url, 'utm_campaign') ?? valueFrom(body, url, 'utmCampaign'),
    utmContent: valueFrom(body, url, 'utm_content') ?? valueFrom(body, url, 'utmContent'),
    utmTerm: valueFrom(body, url, 'utm_term') ?? valueFrom(body, url, 'utmTerm'),
    submittedAt,
    submittedAtUnix,
    requestId: clean(body.request_id) ?? clean(body.requestId) ?? requestId(),
    deployEnv: clean(env.DEPLOY_ENV) ?? 'preview',
  };
};

const asAmo = (lead: NormalizedLead): AmoCrmLeadPayload => ({
  name: lead.name,
  contact: lead.contact,
  email: lead.email,
  robot: lead.robot,
  event: lead.event,
  sourcePage: lead.sourcePage,
  referer: lead.referer,
  ip: lead.ip,
  utmSource: lead.utmSource,
  utmMedium: lead.utmMedium,
  utmCampaign: lead.utmCampaign,
  utmContent: lead.utmContent,
  utmTerm: lead.utmTerm,
  submittedAtUnix: lead.submittedAtUnix,
  requestId: lead.requestId,
});

const asTelegram = (lead: NormalizedLead): TelegramLeadPayload => ({
  name: lead.name,
  contact: lead.contact,
  email: lead.email,
  robot: lead.robot,
  event: lead.event,
  sourcePage: lead.sourcePage,
  utmSource: lead.utmSource,
  utmMedium: lead.utmMedium,
  utmCampaign: lead.utmCampaign,
  submittedAt: lead.submittedAt,
  deployEnv: lead.deployEnv,
});

export const handleLeadStatusRequest = async (_env: EnvLike = process.env): Promise<Response> => json({
  ok: true,
  service: 'api-leads',
  status: 'available',
}, 200, { 'cache-control': 'no-store' });

export const handleLeadRequest = async (
  request: Request,
  env: EnvLike = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<Response> => {
  if (request.method !== 'POST') return json({ ok: false, errors: ['method not allowed'] }, 405);

  let body: Record<string, unknown>;
  try {
    body = await parseBody(request);
  } catch {
    return json({ ok: false, errors: ['invalid request body'] }, 400);
  }

  const lead = normalizeLead(request, body, env);
  const errors = validate(lead);
  if (errors.length) return json({ ok: false, errors }, 400);

  const mode = routingMode(env);
  if (mode !== 'live') {
    if (wantsHtml(request)) return redirect(safeThanksLocation(lead));

    return json({
      ok: true,
      mode,
      requestId: lead.requestId,
      channels: {
        amoCRM: { ok: true, skipped: mode },
        telegram: { ok: true, skipped: mode },
      },
      redirectTo: '/lead/thanks/',
    }, 202);
  }

  pruneLeadCache();
  const key = cacheKey(lead);
  const cached = successfulLeadCache.get(key);
  if (cached) return json({ ...cached.body, idempotent: true });

  const amoCRM = await runChannel('amoCRM', () => sendAmoCrmLeadDuplicate(asAmo(lead), loadAmoCrmLeadConfig({ ...env, LEAD_ROUTING_ENABLED: 'true' }), fetchImpl), env);
  const telegram = await runChannel('telegram', () => sendTelegramLeadDuplicate(asTelegram(lead), loadTelegramLeadConfig({ ...env, LEAD_ROUTING_ENABLED: 'true' }), fetchImpl), env);
  const ok = amoCRM.ok && telegram.ok;
  const responseBody = {
    ok,
    mode,
    requestId: lead.requestId,
    channels: { amoCRM, telegram },
    redirectTo: '/lead/thanks/',
  };

  if (ok) successfulLeadCache.set(key, { expiresAt: Date.now() + IDEMPOTENCY_TTL_MS, body: responseBody });

  return json(responseBody, ok ? 200 : 502);
};
