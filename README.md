# The Projectionist Pal

A full-stack web application built for movie theater projectionists to manage their daily operations — scheduling, movie tracking, trailer management, light bulb monitoring, and shift updates — all in one place.

**Live Demo:** [https://projectionist-pal.onrender.com](https://projectionist-pal.onrender.com)

> **Login:** username `demo` / password `demo`

## Features

- **Movie Updates** — Log daily movie screening updates with sound, picture, focus, and lighting checks per theater
- **Today's Schedule** — Create and manage the day's screening schedule with drag-and-drop reordering
- **Trailers & Commercials** — Track which trailers and pre-show commercials have been loaded for each screening
- **Create New Movie** — Add new movies to the system with details like format, language, subtitles, key expiration, and intermission times
- **Theater Setup** — Manage movies assigned to each theater, upload movies to theaters, and plan next week's lineup
- **Keys Management** — Track DCP key expiration dates across all movies
- **Light Bulb Tracking** — Monitor projector lamp hours, serial numbers, max usage, and replacement history per theater
- **Phones & Passwords** — Store theater-related contact info and passwords
- **Shift Logging** — Record which projectionist is on shift and track all updates with timestamps
- **Multi-Theater Support** — Each account can manage multiple theater screens

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 16, Redux, React Router 5 |
| UI Libraries | Ant Design 3, Semantic UI, Bootstrap 4 |
| Backend | Express.js, Node.js |
| Database | SQLite (via better-sqlite3) |
| File Uploads | Multer |

## Running Locally

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone https://github.com/Taialt97/projectionist-pal.git
cd projectionist-pal

# Install dependencies
npm install --legacy-peer-deps

# Start the backend (API + serves the built frontend)
npm start

# Or for development (React dev server with hot reload)
npm run dev        # Frontend on port 3000
npm run server     # Backend on port 5050 (run in a separate terminal)
```

The app will be available at `http://localhost:5050` (production) or `http://localhost:3000` (development).

A demo user (`demo` / `demo`) with 3 theaters is automatically created on first run.

## Project Structure

```
├── index.js                    # Express server & API routes
├── Components/
│   ├── db.js                   # SQLite database setup & schema
│   └── MySql_Tables/           # Database query modules (one per table)
├── src/
│   ├── App.js                  # Root React component
│   ├── Redux/                  # Actions, reducers, store
│   ├── Function/               # Shared utilities
│   └── New Components/         # All page components
│       ├── Login/              # Login & registration
│       ├── Nav Bar/            # Main navigation with routes
│       ├── Home/               # Daily movie updates
│       ├── Today Schedule/     # Drag-and-drop schedule builder
│       ├── Theater/            # Theater management & light info
│       ├── Create Update Info/ # New movie form
│       ├── Keys/               # Key expiration management
│       ├── Trailers and Commercials/
│       ├── Profile/            # Phones, passwords & update history
│       └── Page Header/        # Shift clock-in header
├── public/                     # Static assets & poster images
└── render.yaml                 # Render.com deployment config
```

## Background

This project was originally built in 2018 as a personal tool to solve real day-to-day problems faced by movie theater projectionists. It was written without the use of AI assistance. The original version used a remote MySQL database; it has since been converted to use a local SQLite database for easier self-hosted deployment.

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

You are free to use, modify, and share this software under the following conditions:

- Any modified versions must also be open source under the same license
- You **cannot** sell this software or use it in a commercial product
- If you run a modified version on a server, you must make the source code available to users

See the [LICENSE](LICENSE) file for the full license text.
