## 2026-02-02 - CORS Regex Vulnerability
**Vulnerability:** The CORS middleware used `origin.includes('localhost')` which allowed malicious origins like `evil-localhost.com`.
**Learning:** Simple string inclusion checks are insufficient for security validation. Attackers can register domains that contain safe substrings.
**Prevention:** Use strict equality checks or precise Regular Expressions (e.g., `^http:\/\/localhost(:\d+)?$`) for origin validation.
