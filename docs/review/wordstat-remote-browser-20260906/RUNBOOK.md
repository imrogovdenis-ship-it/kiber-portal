# KIBER Wordstat remote browser runbook

Status: **prepared and verified**.

This runbook describes how Alexander exposes only the dedicated KIBER Wordstat Chrome profile to Hermes for SEO research.

## Safety boundaries

- Use only the separate Chrome profile prepared for KIBER Wordstat.
- Do not expose Chrome remote debugging to the public internet.
- Keep `--remote-debugging-address=127.0.0.1` on the Windows computer.
- Use SSH reverse tunnel to make the browser reachable only as `127.0.0.1:9222` on the Hermes server.
- Hermes may open Wordstat tabs and read tables, but must stop for SmartCaptcha/2FA/phone/QR prompts.
- No production deploy, DNS, analytics, secrets changes, live lead routing, PR merge, or mass publication is authorized by this access.

## Normal start procedure

### 1. Start the dedicated Chrome profile on Windows

Use the saved shortcut/script that launches Chrome with remote debugging, equivalent to:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --remote-debugging-address=127.0.0.1 `
  --remote-debugging-port=9222 `
  --user-data-dir="$env:USERPROFILE\kiber-wordstat-chrome-profile" `
  --no-first-run `
  --no-default-browser-check
```

If the profile path differs, use the actual saved profile path.

### 2. Start the SSH reverse tunnel from Windows

```powershell
ssh -N -R 127.0.0.1:9222:127.0.0.1:9222 alex@38.180.37.42
```

Keep this PowerShell window open while Hermes needs Wordstat access.

### 3. Tell Hermes

```text
Туннель запущен
```

Hermes verifies:

```bash
curl http://127.0.0.1:9222/json/version
```

### 4. Human challenge handling

If Yandex asks for SmartCaptcha, phone, QR, or 2FA:

1. Hermes stops and reports the blocker.
2. Alexander completes the challenge manually in the dedicated browser profile.
3. Alexander writes `Готово` / `Подтвердил`.
4. Hermes continues.

## Verified test

Live Wordstat query verified:

- Query: `аренда робота`
- Region: `Все регионы`
- Devices: desktop + smartphone + tablet
- Period: `06.08.2026 – 04.09.2026`
- Total: `2 161`
- Evidence JSON: `data/seo/wordstat-research/arenda-robota.wordstat.json`
- Evidence screenshot: `docs/review/wordstat-remote-browser-20260906/02-after-wait-current-query.png`

## Shutdown

Close the SSH tunnel PowerShell window when research is finished. Chrome can remain open if Alexander wants to keep the session warm, or can be closed normally.
