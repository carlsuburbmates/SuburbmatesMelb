## 2025-02-04 - CORS Misconfiguration Fixed
**Vulnerability:** The CORS middleware used a loose check `origin.includes('localhost')` which allowed attackers to bypass CORS protections using domains like `http://evil-localhost.com`.
**Learning:** `String.includes()` is insufficient for security validation of origins. It does not respect URL boundaries or strict equality.
**Prevention:** Always use strict equality (`===`) or anchored regular expressions (e.g., `/^https?:\/\/localhost(:\d+)?$/`) when validating origins.
