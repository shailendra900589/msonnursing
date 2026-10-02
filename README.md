# Mson Nursing Services

Professional multi-page website with **React (Vite)** frontend, **Express** API, **dynamic SEO**, and **Admin CMS**.

## Structure

```
backend/    Express API + JSON content store
frontend/   React Router pages + /admin CMS
```

## Public pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About |
| `/services` | All services |
| `/services/:id` | Service detail + SEO |
| `/events` | Events, camps & campaigns |
| `/events/:id` | Event detail |
| `/contact` | Contact |

Floating **WhatsApp** and **Call** buttons use numbers from CMS → Contact details.

## Admin CMS

- URL: **http://localhost:5173/admin/login**
- Default password: `admin123` (set `ADMIN_PASSWORD` in backend env)

CMS tabs cover **everything**: Site & brand (logo URL), navigation menus, header/footer, all labels & buttons, contact form text, every page section, SEO (global + each page + each service), services (add/delete), system messages, and **Full JSON** editor.

Saved to `backend/src/data/content.json` via API. **Images upload to the backend** (`backend/uploads/`, served at `/uploads/...`) from the admin CMS — logo, hero, about, services, SEO OG image.

Use `{{phone}}`, `{{email}}`, `{{siteName}}` in text fields where shown in admin.

### Image upload API (admin JWT)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/upload` | `multipart`: `folder` (logos/images/services/seo), `file` |
| GET | `/api/admin/upload/media` | List uploaded files |
| DELETE | `/api/admin/upload/media/:folder/:filename` | Remove file |

## Run locally

**Backend** (port 5000):

```bash
cd backend
npm install
npm run dev
```

**Frontend** (port 5173):

```bash
cd frontend
npm install
npm run dev
```

Copy `backend/.env.example` to `backend/.env`.

## Hostinger

1. In hPanel create a MySQL database and user, then put those values in `backend/.env` (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`).
2. Set `NODE_ENV=production` and `CLIENT_ORIGIN` to the live site URL, for example `https://msonnursing.com`.
3. Application root is this project folder. Build command: `npm run build`. Start command: `npm start`.
4. The first startup creates the tables and copies the current site content into MySQL. You can also import `backend/sql/schema.sql` in phpMyAdmin.

Local test uses XAMPP MySQL database `mson` when `backend/.env` has those settings. If MySQL is off, the API keeps using the JSON files.

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health check |
| GET | `/api/content` | — | Full public content |
| GET | `/api/services/:id` | — | Single service |
| GET | `/api/seo/:pageKey` | — | SEO meta bundle |
| POST | `/api/admin/login` | — | `{ password }` → JWT |
| GET | `/api/admin/content` | Bearer | CMS read |
| PUT | `/api/admin/content` | Bearer | CMS save |
