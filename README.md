# Cutframe Studio — Agency Website

Agency site for Cutframe Studio: portfolio grid, services, process, results, FAQ, and a **discovery-call booking** flow connected to **Google Calendar** (free/busy, automatic Google Meet invites). Portfolio videos sync automatically from a **Google Drive** folder. A PIN-protected admin (`/#cutframe-admin`) manages projects, the client inbox, and site settings.

- **Frontend:** React 19, Vite, Tailwind CSS v4, `@dnd-kit` (admin drag-to-reorder) — `client/`
- **Backend:** Node.js, Express, SQLite via `sql.js` — `server/`
- **Google setup:** see [docs/GOOGLE-SETUP.md](docs/GOOGLE-SETUP.md)

---

## Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) installed.

### 1. Install Dependencies
Run the installation command in the root folder. This installs packages for the root, backend, and frontend folders:
```bash
npm run setup
```

### 2. Seed the Database
Populate the database with sample portfolio items (**this deletes existing items**):
```bash
npm run seed
```

### 3. Run in Development
Start both the Express backend and the Vite frontend concurrently in watch/dev mode:
```bash
npm run dev
```

The server runs on [http://localhost:5000](http://localhost:5000) and the frontend runs on [http://localhost:5173](http://localhost:5173) (Vite proxies all `/api/*` endpoints from client to server).

---

## API Endpoints

- **`GET /api/items`**: Fetch all portfolio items sorted by sorting order.
- **`POST /api/items`**: Create a new portfolio item. Auto-detects media type from URL (YouTube, Vimeo, MP4, image).
- **`PUT /api/items/:id`**: Update an existing portfolio item.
- **`DELETE /api/items/:id`**: Remove a portfolio item.
- **`PATCH /api/items/reorder`**: Batch reorder items (receives array of item IDs).
- **`GET /api/booking/slots?date=YYYY-MM-DD`**: Free discovery-call times (IST) for a day.
- **`POST /api/booking`**: Book a call → Google Calendar event + Meet link, copy in the admin inbox.
- **`GET /api/google/status`**, **`GET /api/google/connect`**, **`POST /api/google/sync`** (admin): Google connection + Drive sync.

Admin endpoints require the `x-admin-pin` header once a PIN is set. Run server checks with `npm test --prefix server`.
