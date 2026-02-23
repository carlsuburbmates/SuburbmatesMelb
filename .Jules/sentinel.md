## 2025-02-23 - CORS Localhost Substring Vulnerability
**Vulnerability:** The CORS middleware allowed any origin containing the string "localhost" (e.g., `evil-localhost.com`, `localhost.evil.com`).
**Learning:** Checking for substrings like `.includes('localhost')` is insufficient for security validations because attackers can register domains that contain the target string.
**Prevention:** Use strict equality checks or robust Regular Expressions anchored with `^` and `$` (e.g., `/^https?:\/\/localhost(:\d+)?$/`) to validate origins.
