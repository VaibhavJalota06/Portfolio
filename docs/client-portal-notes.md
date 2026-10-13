# Client portal: saved notes (future project, not started)

Status: **paused on 2026-10-13** by the owner, to resume once there are active clients.
These are agreed requirements from the first planning conversation, **not** an approved design.
Next step when resuming: confirm Supabase limits on supabase.com/pricing, then design the screens
(admin / editor / client), write the spec, then the implementation plan.

## Goal
Replace WhatsApp + Drive back-and-forth with one private place on cutframestudio.in where each client
chats with their assigned editor(s) and the owner, receives video drafts and leaves change notes.

## Agreed decisions

**People and privacy**
| Role | Chats with | Sees |
|---|---|---|
| Admin (owner) | Everyone | Everything; assigns editors to clients, grants/revokes access |
| Editor | Only assigned clients + admin | Client **name only** (no email/phone) |
| Client | Only assigned editor(s) + admin | Editor names + admin's name, phone and Gmail |

- Clients never see other clients; search only shows their own team.
- Extra access only on request, granted by the admin.

**Sign-in (invite only)**
- Admin adds an email and role (client/editor) and gets a temporary password to send on WhatsApp.
- First login forces setting a new password.
- Forgot password: ask the admin, who resets it to a new temporary password (no emails).
- Optional: "Sign in with Google" only for emails the admin has added.

**Video deliveries**
- Videos stay on Google Drive. Editor sends a **title + Drive link**; the video plays inside the chat.
- Client sees the video with a **notes panel beside it** and writes time-stamped notes (e.g. "0:05: text too small").
- Editor is notified, replies per note, and sends the next version the same way.
- Normal chat alongside.

**Feels like a messaging app, not email**
- Instant messages, typing indicator, seen ticks, unread counters.
- Phone push notifications; installable "Add to Home Screen" app (needed for iPhone notifications).
- No email notifications. (WhatsApp alerts ruled out: paid.)

**Constraints**
- Free options only.
- Must not slow down or affect SEO of the public site.

## Recommended approach (agreed in principle, not yet approved as a design)
Supabase (owner already has a free project used for backups): auth, Postgres, realtime messaging,
row-level security enforcing the privacy table above. Portal at `/portal`, loaded only there
(~53 KB library, public visitors download nothing), marked noindex. Render server only sends web
push notifications. Daily DB keep-alive so the free project never pauses after 7 days idle.

Rejected: building chat into the current Express/SQLite server (snapshot backups can lose messages,
connections drop on restarts, hand-rolled security); third-party chat SaaS (branding, limits, lock-in).
