# Internship Tracker

**Internship Tracker helps a student keep every internship and job application moving from wishlist to offer, together with the companies and interviews attached to each one.**

Built for DA219B Fullstack Lab at Kristianstad University. React (Vite) frontend, Express API, MongoDB Atlas.

## Quick start (under 5 minutes)

### 1. Clone and install

```bash
git clone https://github.com/azhaf7/internship-tracker.git
cd internship-tracker
npm run install:all
```

### 2. MongoDB Atlas connection string

You need a free MongoDB Atlas cluster and a connection string.

1. Sign up at [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free **M0** cluster.
2. **Database Access** -> Add a database user (username + password). Save the password.
3. **Network Access** -> Add IP Address -> **Allow access from anywhere** (`0.0.0.0/0`) for local work.
4. **Database** -> **Connect** -> **Drivers** -> copy the URI.
5. In the URI, replace `<password>` with your real password and put the database name `internship_tracker` before the `?`:

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/internship_tracker?retryWrites=true&w=majority
```

### 3. Environment file

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and set `MONGODB_URI` to your connection string:

```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/internship_tracker?retryWrites=true&w=majority
PORT=5050
CLIENT_ORIGIN=http://localhost:5173
```

`server/.env` is gitignored. Never commit real passwords.

### 4. Seed sample data

```bash
npm run seed
```

Loads 6 companies, 10 applications, 8 interviews, and 7 contacts.

### 5. Start the app

```bash
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:5050  

One command starts both (via `concurrently`). Vite proxies `/api` to the backend.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run install:all` | Install root, server, and client deps |
| `npm run dev` | Start API + React together |
| `npm run seed` | Reset and seed the database |
| `npm start` | Start API only |
| `npm run erd` | Regenerate `docs/erd.png` from the schemas |

## Data model

```
companies -< applications -< interviews
         +- contacts
```

| Collection | Purpose |
| --- | --- |
| `companies` | Employers |
| `applications` | Main entity: one role at one company (`stage` = pipeline position) |
| `interviews` | Rounds for an application |
| `contacts` | People at a company |

Relationships use `ObjectId` + `.populate()`. See `docs/erd.png` and `REPORT.md`.

## API (base: `http://localhost:5050/api`)

### Applications (CRUD)

| Method | Route | Notes |
| --- | --- | --- |
| `GET` | `/applications` | Optional `?stage=` and `?search=` |
| `GET` | `/applications/:id` | Single application |
| `POST` | `/applications` | `409` if role already tracked at that company |
| `PUT` | `/applications/:id` | Partial update |
| `DELETE` | `/applications/:id` | Also deletes its interviews |

### Relational

| Method | Route |
| --- | --- |
| `GET` | `/applications/:id/interviews` |
| `GET` | `/companies/:id/applications` |

### Stats

| Method | Route |
| --- | --- |
| `GET` | `/stats/pipeline` |
| `GET` | `/stats/by-company` |

Errors always look like `{ "error": "...", "details": [...] }` with status `400`, `404`, `409`, or `500`.

## Project structure

```
internship-tracker/
├── package.json          # concurrently starts both apps
├── server/
│   ├── .env.example
│   └── src/
│       ├── index.js / app.js
│       ├── models/       # Company, Application, Interview, Contact
│       ├── routes/       # Router -> middleware -> controller
│       ├── controllers/
│       ├── middleware/
│       └── seed/
└── client/
    └── src/
        ├── App.jsx
        ├── api/client.js
        ├── hooks/        # useApplications (poll + cleanup)
        └── components/   # table, form, kanban, dock, stats, ...
```

## Frontend features

- Kanban board (drag a card to change `stage`) and sortable table
- Create / edit forms with controlled inputs; delete needs confirmation
- Search by role or company; stage filter via the dock
- Pipeline stats cards and chart
- Application detail modal (company + interviews)
- Auto-refresh every 15 seconds (`setInterval` cleared on unmount)
- Loading and error states
