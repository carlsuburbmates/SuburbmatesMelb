## 2026-01-29 - Loose CORS Localhost Validation
**Vulnerability:** The CORS middleware validated origins using `origin.includes('localhost')`, which allowed attackers to bypass CORS using domains like `evil-localhost.com`.
**Learning:** Simple substring checks for `localhost` are insufficient for security. Developers often use them to support dynamic ports in development but forget the security implications.
**Prevention:** Use a strict regular expression `^http:\/\/localhost(:\d+)?$` or a predefined allowlist for origin validation.
