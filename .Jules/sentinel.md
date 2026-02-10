## 2024-05-24 - [Email Subject Encoding]
**Vulnerability:** Double encoding in email subjects.
**Learning:** Email subjects are rendered as plain text by email clients. Applying HTML entity encoding (like `escapeHtml`) results in visible artifacts (e.g., `&amp;` instead of `&`) and provides no security benefit against header injection (CRLF).
**Prevention:** Do not apply HTML escaping to email subjects; only sanitize the HTML body content. Ensure headers are safe from CRLF injection if constructed from user input (though typically handled by the email library).
