# Owner-selected URL goal for thanks

Owner opted for existing URL conversion, not a new JS goal. Current authenticated Metrica UI confirms counter 112523930 goal 612345875, name `Страница "Спасибо"`, URL contains `https://www.kiber-portal.ru/lead/thanks`. Goal settings unchanged.

Before: the provider blocked all `/lead/*` routes, including thanks. Server CSP already allows Metrica. Fix: only exact `/lead/thanks[/]` permits basic pageview; no replay/clickmap on that page even under extended consent. Full off still blocks all analytics. Request/API/success/other lead paths and all preview hosts remain excluded. Clean page URL/referrer, no new event or form data.

Evidence: 50 current live pages x production/preview = 100 HTTP checks, zero anchors/areas/form actions pointing to thanks. Added built-page regression. Real SDK exercised on captured/intercepted page: before zero SDK/requests; after SDK initialises and forms matching counter watch request for clean thanks URL. All telemetry intercepted and aborted (retry requests are not conversion counts). No test telemetry or real lead submitted.

20 analytics/consent unit tests PASS, including exact-path exception, off, preview and protected paths. This does NOT prove backend goal receipt: actual production activation/receipt remains post-publication verification. No production deployment approved; preview stays noindex/analytics-off.
