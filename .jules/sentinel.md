## 2024-04-04 - Security Review
**Vulnerability:** Initial security review of the codebase.
**Learning:** Found an XSS vulnerability in the contact form endpoint. User-provided messages are inserted directly into the email HTML without proper sanitization. Wait, the email uses `${message.replace(/\n/g, "<br>")}`. A payload like `<script>alert(1)</script>` will be rendered. Additionally, missing `escapeHtml` for headers might be an issue.
**Prevention:** Always sanitize user input before embedding in HTML context.
