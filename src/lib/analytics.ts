export type AnalyticsEvent = {
  name: 'robot_card_click';
  payload: {
    robot_slug: string;
    block_id: 'robot-card';
    placement: 'catalog' | 'related' | 'collection' | 'design_review';
    position?: number;
  };
};

export function track(event: AnalyticsEvent): void {
  if (import.meta.env.DEPLOY_ENV !== 'production') return;
  if (typeof document === 'undefined' || document.documentElement.dataset.cookieConsent !== 'accepted') return;
  window.dispatchEvent(new CustomEvent('kp:analytics', { detail: event }));
}
