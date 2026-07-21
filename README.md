# Cinematic Video Editing Portfolio Website

A high-end, premium portfolio website for video editors to showcase their work using a bento-style grid. Features direct HTML5 MP4 hover-playback loop, YouTube & Vimeo embedded previews, and an Admin mode to drag-to-reorder, resize, edit, and delete portfolio items in real-time.

---

## Technical Stack

- **Frontend:** React, Vite, Tailwind CSS, `@dnd-kit` (drag-to-reorder)
- **Backend:** Node.js, Express, SQLite (`better-sqlite3`)
- **Aesthetic:** Cinematic dark mode (deep black `#070708` background, saturated amber `#ff9f1c` accent, animated film-grain overlay, 24fps live timecode ticker)

---

## Repository Structure

```
├── client/              # React frontend (Vite)
│   ├── src/             # Frontend source code
│   │   ├── components/  # React components (Grid, Tile, AdminPanel, Toast, FilmGrain)
│   │   ├── utils/       # Utility functions (Media URL parser and detector)
│   │   └── index.css    # Typography, animations, and Bento grid layout CSS
│   └── package.json     # Client dependencies
├── server/              # Express backend
│   ├── db.js            # SQLite database initialization
│   ├── seed.js          # Database seeding script
│   ├── server.js        # Express routes and REST API endpoints
│   └── package.json     # Server dependencies
├── package.json         # Concurrently script configuration
└── README.md            # This documentation
```

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
Populate the SQLite database with 7 high-fidelity cinematic sample portfolio items:
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
