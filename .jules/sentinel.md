## 2024-05-22 - Loose CORS Origin Matching
**Vulnerability:** The CORS middleware used `origin.includes('localhost')` to allow local development, which inadvertently allowed any origin containing the string "localhost" (e.g., `http://evil-localhost.com`).
**Learning:** Convenience features for developer experience (like flexible local ports) can easily introduce security holes if implemented with loose checks.
**Prevention:** Use strict regular expressions (e.g., `/^https?:\/\/localhost(:\d+)?$/`) or explicit allow-lists when validating security contexts, even for development-only paths.
