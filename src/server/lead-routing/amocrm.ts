export interface AmoCrmLeadPayload {
  name: string;
  contact: string;
  email?: string | null;
  robot?: string | null;
  event?: string | null;
  sourcePage?: string | null;
  referer?: string | null;
  ip?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  submittedAtUnix: number;
  requestId: string;
}

export interface AmoCrmLeadConfig {
  enabled: boolean;
  baseUrl?: string;
  accessToken?: string;
}

export interface AmoCrmSendResult {
  ok: boolean;
  skipped?: 'routing-disabled';
  unsortedUid?: string;
}

type FetchLike = (url: string, init: RequestInit & { headers?: Record<string, string> }) => Promise<Response>;
type EnvLike = Record<string, string | undefined>;

const AMOCRM_SOURCE_NAME = 'kiber-portal.ru';
const AMOCRM_SOURCE_UID = 'site-form-lead-request';
const AMOCRM_PIPELINE_ID = 10151598;
const AMOCRM_RESPONSIBLE_USER_ID = 13632386;

const UTM_FIELDS = [
  ['utmSource', 'utm_source', 903417],
  ['utmMedium', 'utm_medium', 903413],
  ['utmCampaign', 'utm_campaign', 903415],
  ['utmContent', 'utm_content', 903411],
  ['utmTerm', 'utm_term', 903419],
] as const;

const clean = (value?: string | null) => {
  const normalized = String(value ?? '').trim();
  return normalized.length ? normalized : undefined;
};

export const loadAmoCrmLeadConfig = (env: EnvLike): AmoCrmLeadConfig => ({
  enabled: env.LEAD_ROUTING_ENABLED === 'true',
  baseUrl: env.AMOCRM_BASE_URL,
  accessToken: env.AMOCRM_ACCESS_TOKEN,
});

export const buildAmoCrmUnsortedFormPayload = (payload: AmoCrmLeadPayload) => {
  const metadata: Record<string, string | number> = {
    form_id: 'lead_request',
    form_name: 'Заполнить форму',
    form_page: clean(payload.sourcePage) ?? 'https://kiber-portal.ru/lead/request/',
    form_sent_at: payload.submittedAtUnix,
  };

  const referer = clean(payload.referer);
  if (referer) metadata.referer = referer;
  const ip = clean(payload.ip);
  if (ip) metadata.ip = ip;

  const customFields = UTM_FIELDS.flatMap(([payloadKey, _metadataKey, fieldId]) => {
    const value = clean(payload[payloadKey]);
    if (!value) return [];
    // Real amoCRM unsorted/forms validation rejects utm_* keys in metadata for this account.
    // Keep UTM values in the configured API-only lead custom fields instead.
    return [{ field_id: fieldId, values: [{ value }] }];
  });

  const contactFields = [
    { field_code: 'PHONE', value: clean(payload.contact) },
    { field_code: 'EMAIL', value: clean(payload.email) },
  ].flatMap((field) => field.value ? [{ field_code: field.field_code, values: [{ value: field.value, enum_code: 'WORK' }] }] : []);

  const robot = clean(payload.robot);

  return [
    {
      source_name: AMOCRM_SOURCE_NAME,
      source_uid: AMOCRM_SOURCE_UID,
      pipeline_id: AMOCRM_PIPELINE_ID,
      created_at: payload.submittedAtUnix,
      request_id: payload.requestId,
      metadata,
      _embedded: {
        leads: [
          {
            name: robot ? `Заявка с сайта kiber-portal.ru — ${robot}` : 'Заявка с сайта kiber-portal.ru',
            responsible_user_id: AMOCRM_RESPONSIBLE_USER_ID,
            custom_fields_values: customFields,
          },
        ],
        contacts: [
          {
            name: clean(payload.name) ?? 'Заявка с сайта kiber-portal.ru',
            custom_fields_values: contactFields,
          },
        ],
      },
    },
  ];
};

const assertConfigured = (config: AmoCrmLeadConfig) => {
  if (!config.baseUrl) throw new Error('amoCRM lead duplicate is missing AMOCRM_BASE_URL');
  if (!config.accessToken) throw new Error('amoCRM lead duplicate is missing AMOCRM_ACCESS_TOKEN');
};

export const sendAmoCrmLeadDuplicate = async (
  payload: AmoCrmLeadPayload,
  config: AmoCrmLeadConfig,
  fetchImpl: FetchLike = fetch,
): Promise<AmoCrmSendResult> => {
  if (!config.enabled) return { ok: true, skipped: 'routing-disabled' };

  assertConfigured(config);

  const baseUrl = config.baseUrl!.replace(/\/$/, '');
  const response = await fetchImpl(`${baseUrl}/api/v4/leads/unsorted/forms`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${config.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(buildAmoCrmUnsortedFormPayload(payload)),
  });

  if (!response.ok) throw new Error(`amoCRM unsorted/forms failed with HTTP ${response.status}`);

  const data = await response.json() as { _embedded?: { unsorted?: Array<{ uid?: string }> } };
  return { ok: true, unsortedUid: data._embedded?.unsorted?.[0]?.uid };
};
