export interface LeadPayload {
  name: string;
  contact: string;
  email?: string | null;
  robot?: string | null;
  event?: string | null;
  sourcePage?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  submittedAt: string;
  deployEnv: string;
}

export interface TelegramLeadConfig {
  enabled: boolean;
  botToken?: string;
  chatId?: string;
  threadId?: string;
  deployEnv?: string;
}

export interface TelegramSendResult {
  ok: boolean;
  skipped?: 'routing-disabled';
  messageId?: number;
}

type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

type EnvLike = Record<string, string | undefined>;

const dash = (value?: string | null) => {
  const normalized = String(value ?? '').trim();
  return normalized.length ? normalized : '—';
};

export const buildTelegramLeadMessage = (payload: LeadPayload) => `🤖 Новая заявка с KIBER PORTAL

Имя: ${dash(payload.name)}
Контакт: ${dash(payload.contact)}
Email: ${dash(payload.email)}
Робот/интерес: ${dash(payload.robot)}
Формат мероприятия: ${dash(payload.event)}

Страница: ${dash(payload.sourcePage)}
UTM source: ${dash(payload.utmSource)}
UTM medium: ${dash(payload.utmMedium)}
UTM campaign: ${dash(payload.utmCampaign)}

Время: ${dash(payload.submittedAt)}
Environment: ${dash(payload.deployEnv)}`;

export const loadTelegramLeadConfig = (env: EnvLike): TelegramLeadConfig => ({
  enabled: env.LEAD_ROUTING_ENABLED === 'true',
  botToken: env.TELEGRAM_BOT_TOKEN,
  chatId: env.TELEGRAM_LEADS_CHAT_ID,
  threadId: env.TELEGRAM_LEADS_THREAD_ID || undefined,
  deployEnv: env.DEPLOY_ENV,
});

const assertConfigured = (config: TelegramLeadConfig) => {
  if (!config.botToken) throw new Error('Telegram lead routing is missing TELEGRAM_BOT_TOKEN');
  if (!config.chatId) throw new Error('Telegram lead routing is missing TELEGRAM_LEADS_CHAT_ID');
};

export const sendTelegramLeadDuplicate = async (
  payload: LeadPayload,
  config: TelegramLeadConfig,
  fetchImpl: FetchLike = fetch,
): Promise<TelegramSendResult> => {
  if (!config.enabled) return { ok: true, skipped: 'routing-disabled' };

  assertConfigured(config);

  const body: Record<string, unknown> = {
    chat_id: config.chatId,
    text: buildTelegramLeadMessage({
      ...payload,
      deployEnv: payload.deployEnv || config.deployEnv || 'unknown',
    }),
    disable_web_page_preview: true,
  };
  if (config.threadId) body.message_thread_id = Number(config.threadId);

  const response = await fetchImpl(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`Telegram sendMessage failed with HTTP ${response.status}`);

  const data = await response.json() as { ok?: boolean; result?: { message_id?: number }; description?: string };
  if (!data.ok) throw new Error(`Telegram sendMessage returned ok=false: ${data.description ?? 'unknown error'}`);

  return { ok: true, messageId: data.result?.message_id };
};
