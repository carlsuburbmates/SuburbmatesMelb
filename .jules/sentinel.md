## 2025-04-02 - PostgREST Filter Injection Vulnerability
**Vulnerability:** Unsanitized user input (`search` query parameter) was directly interpolated into a Supabase `.or()` query string filter (e.g., `query.or('business_name.ilike.%${search}%')`).
**Learning:** In PostgREST, `.or()` takes a comma-separated string of conditions. If user input contains commas or other operators, it can alter the query structure (filter injection). Wait, `.ilike()` with variables is safe, but string interpolation inside `.or()` isn't safe if it allows commas.
**Prevention:** Always sanitize user input before interpolating it into PostgREST `.or()` or `.and()` query strings. A safe approach is stripping reserved characters, e.g., `term.replace(/[^a-zA-Z0-9\s\-'&]/g, "").trim()`.
