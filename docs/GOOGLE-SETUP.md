# Connect Google Calendar + Drive (one-time, ~10 minutes)

After this:
- **Book a call** only offers times that are free on your Google Calendar. Each booking creates a calendar event with a Google Meet link. Google emails the invite to the client, and the event appears on your calendar (and goes to `OWNER_EMAIL` too, if set).
- **Drive folder**: any video or image you drop into your portfolio folder appears in the Work section within 5 minutes. Deleting it from Drive removes it from the site.

## 1. Google Cloud project
1. Open https://console.cloud.google.com/ → create a project (e.g. "Cutframe Website").
2. **APIs & Services → Library** → enable **Google Calendar API** and **Google Drive API**.

## 2. OAuth consent screen
1. **APIs & Services → OAuth consent screen** → User type **External** → fill app name + your email.
2. Scopes: you can skip (the site asks for them itself).
3. **Publish the app** (Publishing status → *In production*).
   While it is in *Testing*, Google expires the connection every 7 days.
   You don't need Google verification for your own account. When you connect, click *Advanced → Go to (app)* on the "unverified app" screen.

## 3. OAuth client
1. **APIs & Services → Credentials → Create credentials → OAuth client ID** → type **Web application**.
2. **Authorized redirect URIs**, add both:
   - `http://localhost:5000/api/google/callback`
   - `https://YOUR-SITE.netlify.app/api/google/callback` (your live domain)
3. Copy the **Client ID** and **Client secret** into `server/.env` (start from `server/.env.example`).
   On Render, add the same values under *Environment*, with `GOOGLE_REDIRECT_URI` set to the live URL.

## 4. Connect
1. Restart the server, open the site → `#cutframe-admin` → **Google Calendar & Drive** panel → **Connect Google Account**.
2. Sign in with the Google account whose calendar should receive bookings, and allow access.
3. Back in the admin panel the badge shows **GOOGLE CONNECTED**.

## 5. Drive portfolio folder
1. In Google Drive create a folder, e.g. `Cutframe Portfolio`. Inside it, create sub-folders named exactly like the site filters:
   `AI Videos`, `Short-Form / Reels`, `YouTube Long-Form`, `Ad Creatives`, `Thumbnails & Packaging`.
   (Drive allows `/` in folder names. Files directly in the main folder show up under *All Work* only.)
2. **Share → General access → Anyone with the link → Viewer.** Visitors can't play the videos without this.
3. Paste the folder link into the admin panel → **Save**. It syncs immediately, then every 5 minutes.
4. Vertical videos get a tall tile, horizontal ones a wide tile. Rename, resize, feature or hide them in the admin grid as usual.

## Notes
- Booking times are IST: 11:00, 12:30, 14:00, 15:30, 16:30, 17:30, 19:00, 30 minutes each, with at least 2 hours' notice.
  To change them, edit `SLOTS` / `CALL_MINUTES` in `server/google.js`.
- If Google isn't connected, bookings still work. They land in the admin **Client Inbox**, and the client gets an "Add to Google Calendar" link.
- The connection is stored in the database. If your host resets the database, reconnect, or set `GOOGLE_REFRESH_TOKEN` in the environment.
