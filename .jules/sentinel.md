# Sentinel Journal 🛡️

## 2025-02-18 - HTML Injection in Transactional Emails
**Vulnerability:** User input from the contact form was directly interpolated into the HTML body of emails sent to support.
**Learning:** Even internal emails (to support/admin) are attack vectors if the email client renders HTML. This is "Stored XSS" if the email is viewed in a web-based client.
**Prevention:** Always sanitize/escape user input before embedding it in HTML, even for emails. Use `escapeHtml` or similar utilities.

## 2025-02-18 - Escaping Contexts
**Vulnerability:** Over-escaping user input in plain text contexts (like email Subject headers).
**Learning:** Security controls must be context-aware. Escaping HTML entities in a plain text field results in "double escaping" or visible artifacts (e.g., `&lt;` instead of `<`).
**Prevention:** Only apply HTML escaping when inserting data into an HTML context. Leave data raw for plain text contexts.
