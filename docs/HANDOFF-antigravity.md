# Handoff for Antigravity: Cutframe Studio website (2026-10-12)

Read this fully before changing anything. The site is LIVE and working; do not break it.

## Links
- Website (public): https://portfolio-server-ve91.onrender.com
- Admin (private, PIN-protected, never link it publicly): https://portfolio-server-ve91.onrender.com/#cutframe-admin
- GitHub: https://github.com/VaibhavJalota06/Portfolio (public repo, so never commit secrets)
- Render service: portfolio-server (serves API + website). Auto-deploys only on changes inside `server/`.
  After a client-only change, click **Manual Deploy** in Render (or touch a file in `server/`).

## How it works (do not undo)
- One Render free service. `server/server.js` serves `client/dist`. `server/package.json` `postinstall` builds the client on Render (`RENDER` env var).
- Database = sql.js file. On Render it is restored from / backed up to Supabase (project `cutframe-website`,
  table `private.app_state`) via token-checked RPCs `load_state` / `save_state` (`server/db.js`).
  **Only the live server may have `SUPABASE_URL`, `SUPABASE_KEY`, `STATE_TOKEN` set.** Never set them locally,
  or local testing overwrites live data.
- Google: OAuth client in Google Cloud project `cutframe-website`. Refresh token lives in the DB (restored from backup).
  Booking = `server/google.js` (`freeSlots`, `bookCall`); Drive sync every 5 min (`syncDrive`).
  Drive folder: https://drive.google.com/drive/folders/1qhWuK081RroDBzdLcYgPTr1dLixBJmsr (owned by vaibhavjalotaofficial@gmail.com).
- Keep-awake: `.github/workflows/keep-awake.yml` pings `/api/health` every 10 min.
- Contact details: `client/src/contact.js`.
- Tests: `npm test --prefix server` (must stay green).

## Owner's rules (from the owner, keep them)
- No fake numbers, testimonials or client names. Real results only, when the owner provides them.
- Positioning: "We help brands grow on Instagram" (brands, businesses, creators, clinics), not clinics only.
- No admin links/buttons on the public site. No Ctrl+K search. No "Let's talk" band in About.
- Do not show Drive file names publicly (they contain client names/dates).
- Keep it clean and simple. Everything must stay free.

## Completed tasks (2026-10-12)
1. Keep-awake deploy confirmed: `/api/health` returns `{"ok":true}` and `.github/workflows/keep-awake.yml` is active on main.
2. Google app published: Audience status set to "In production" in Google Cloud Console (`cutframe-website`).
3. Live booking test passed: Calendar invite with Meet link verified.
4. Old test events deleted from calendar.
5. Admin PIN changed by owner via Admin -> Settings.
6. Removed "free sample reel concept" and "free Instagram audit" promises from client (About, Services, FAQ, Booking modal). Kept "Book a Free Call".

## Remaining / Optional tasks
1. **Old Netlify sites** (`0b63c7f5-f628-415a-9cf4-938d62137a30` and `25445e99-ae7e-4bf6-bc40-5f857c299c6a`):
   When logged into Netlify, delete them to avoid serving stale builds.
2. **Custom domain (Optional)**: If you buy a domain in the future, update Google OAuth redirect URIs and Render domain settings.

## Secrets (never paste into code, docs or chat)
- Live values are in Render → portfolio-server → Environment. A local copy is in `server/.env.render` (gitignored).
  Local dev values are in `server/.env` (gitignored, must NOT contain the SUPABASE_* / STATE_TOKEN lines).
