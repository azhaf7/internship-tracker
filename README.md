# Internship Tracker

**Problem this app solves:** A student needs one place to track internship and job applications from wishlist to offer, together with companies and interview rounds, so nothing gets lost in a spreadsheet.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Express.js
- **Database:** MongoDB Atlas (Mongoose)

## Setup - run in under 5 minutes

### 1. Clone the repo

```bash
git clone https://github.com/azhaf7/internship-tracker.git
cd internship-tracker
```

### 2. Install dependencies

```bash
npm run install:all
```

(or: `npm install` in the root, then in `client/`, then in `server/`)

### 3. Create the .env file

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/internship_tracker?retryWrites=true&w=majority
PORT=5050
CLIENT_ORIGIN=http://localhost:5173
```

Get your connection string from MongoDB Atlas -> Connect -> Drivers. Replace `<username>` and `<password>`, and keep the database name `internship_tracker`.

### 4. Seed the database

```bash
npm run seed
```

### 5. Start the app

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5050

Open http://localhost:5173

## API Endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | /api/applications | List applications (`?stage=` and `?search=` optional) |
| GET | /api/applications/:id | Get one application |
| POST | /api/applications | Create an application |
| PUT | /api/applications/:id | Update an application |
| DELETE | /api/applications/:id | Delete an application (and its interviews) |
| GET | /api/applications/:id/interviews | Application plus its interview rounds |
| GET | /api/companies | List companies |
| GET | /api/companies/:id/applications | Company plus its applications and contacts |
| GET | /api/stats/pipeline | Counts per stage, offers, response rate |
| GET | /api/stats/by-company | Applications grouped by company |

## Features

- Full CRUD for applications
- Kanban board and sortable table
- Create / edit forms with controlled inputs; delete with confirmation
- Search by role or company name
- Filter by stage (wishlist / applied / screening / interview / offer / rejected)
- Pipeline stats on the dashboard
- Auto-refresh every 15 seconds (cleans up with useEffect return)
- Loading and error states in the UI

## Data model

See `docs/erd.png`. Four collections linked by ObjectId: companies, applications, interviews, contacts. Custom field: `stage` on applications.
