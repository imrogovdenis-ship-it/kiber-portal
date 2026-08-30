import { loadAmoCrmLeadConfig, sendAmoCrmLeadDuplicate, type AmoCrmLeadPayload } from './amocrm';
import { loadTelegramLeadConfig, sendTelegramLeadDuplicate, type LeadPayload as TelegramLeadPayload } from './telegram';

export type LeadRoutingMode = 'disabled' | 'dry-run' | 'live';
export type EnvLike = Record<string, string | undefined>;
export type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

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

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body, null, 2), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8' },
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

  const amoCRM = await sendAmoCrmLeadDuplicate(asAmo(lead), loadAmoCrmLeadConfig({ ...env, LEAD_ROUTING_ENABLED: 'true' }), fetchImpl);
  const telegram = await sendTelegramLeadDuplicate(asTelegram(lead), loadTelegramLeadConfig({ ...env, LEAD_ROUTING_ENABLED: 'true' }), fetchImpl);

  return json({
    ok: true,
    mode,
    requestId: lead.requestId,
    channels: { amoCRM, telegram },
    redirectTo: '/lead/thanks/',
  });
};
