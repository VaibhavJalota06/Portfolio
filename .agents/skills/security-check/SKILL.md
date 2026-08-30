---
name: security-check
description: Run a quick security audit on the codebase. Use when the user asks to "check security", "run security audit", "vibe check security", "audit for secrets", or before deploying to production.
---

# Security Audit Skill

Quickly audit the codebase (`client/` and `server/`) for common security flaws before deployment.

## Audit Checklist

1. **Hardcoded Secrets & API Keys**
   - Search for hardcoded credentials, JWT secrets, private keys, or API tokens in source files.
   - Verify `.env` is listed in `.gitignore` and not committed.

2. **Backend & Server Security (`server/`)**
   - **CORS**: Verify CORS origin settings are explicit and secure.
   - **Input Sanitation**: Check express parameters/body parsing for input validation.
   - **Error Exposure**: Ensure internal stack traces are suppressed in production responses.
   - **Rate Limiting**: Verify sensitive endpoints (login, contact forms, auth) have rate limiting.

3. **Frontend Security (`client/`)**
   - **XSS**: Check for raw `dangerouslySetInnerHTML` or unsanitized DOM injections.
   - **Secret Exposure**: Ensure no server-side secrets or private API keys exist in client code.

4. **Dependency & Environment Hygiene**
   - Check `package.json` for deprecated/risky dependencies.
   - Confirm public asset directories do not contain configuration secrets.

## Execution Workflow

1. Grep for potential secret patterns (`API_KEY`, `SECRET`, `PASSWORD`, `PRIVATE_KEY`).
2. Inspect `.gitignore` and `.env.example`.
3. Check `server/` routes and middleware for CORS, rate-limiting, and error handling.
4. Report Findings: List any issues found categorized by severity (High, Medium, Low) with exact file paths and clear fixes.
