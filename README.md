# Snip — URL Shortener

A full-stack URL shortener built with Node.js, Express, MongoDB, React, and TypeScript. Shorten long URLs, track clicks, and view analytics — all in one place.

---

## Live Demo

> Coming soon (Render + Vercel deploy)

---

## Features

- Shorten any URL instantly — no login required
- JWT authentication with httpOnly refresh token cookies
- Click tracking — total clicks, clicks per day, top visitor IPs
- Link expiry via MongoDB TTL indexes (auto-delete after 30 days)
- Base62 code generation with collision detection
- Protected dashboard — manage and delete your links
- Analytics page — bar chart, IP breakdown, recent click log
- Session restoration on page refresh via `/auth/me`
- Auto token refresh via Axios interceptors

---

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (access + refresh tokens)
- bcrypt
- cookie-parser
- CORS

### Frontend
- React + TypeScript (Vite)
- Redux Toolkit
- Axios (with interceptors)
- React Router DOM
- Tailwind CSS

---

## Project Structure

```
url-shortener/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── user.controller.js     # register, login, logout, getMe, refreshToken
│   │   │   └── url.controller.js      # shorten, redirect, getAll, delete, analytics
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── url.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── url.route.js
│   │   │   └── redirect.route.js
│   │   ├── middleware/
│   │   │   └── protect.js
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   ├── db/
│   │   │   └── connectDB.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.ts               # base instance + interceptors
    │   │   ├── authApi.ts
    │   │   └── urlApi.ts
    │   ├── store/
    │   │   ├── store.ts
    │   │   ├── hook.ts
    │   │   └── slices/
    │   │       └── authSlice.ts
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── Analytics.tsx
    │   │   ├── About.tsx
    │   │   └── Contact.tsx
    │   ├── components/
    │   │   ├── Header.tsx
    │   │   ├── ProtectedRoute.tsx
    │   │   ├── Hero.tsx
    │   │   ├── Features.tsx
    │   │   ├── Footer.tsx
    │   │   └── forms/
    │   │       └── AuthForm.tsx
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/url-shortener
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

Start server:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_BASE_URL=http://localhost:5000/api
```

Start dev server:

```bash
npm run dev
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/auth/logout` | Yes | Logout, clears cookie |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/refresh` | Cookie | Refresh access token |

### URLs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/shorten` | No | Shorten a URL |
| GET | `/:code` | No | Redirect to original URL |
| GET | `/api/urls` | Yes | Get all URLs (paginated) |
| DELETE | `/api/urls/:code` | Yes | Delete a URL |
| GET | `/api/urls/:code/analytics` | Yes | Get click analytics |

---

## Key Implementation Details

### URL Shortening — Base62

```javascript
const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const generateCode = (len = 6) => {
  let code = "";
  for (let i = 0; i < len; i++) {
    code += BASE62[Math.floor(Math.random() * 62)];
  }
  return code;
};
```

62^6 = ~56 billion combinations. Collision check runs before every save.

### Auth Flow

```
Register / Login
  → accessToken (15min) → localStorage
  → refreshToken (7d)   → httpOnly cookie

On 401:
  → Axios interceptor calls /auth/refresh
  → New accessToken stored
  → Original request retried

On page refresh:
  → localStorage token found
  → /auth/me called
  → Redux state restored
```

### Analytics

Click tracking is non-blocking — redirect fires first, DB update runs async:

```javascript
res.redirect(302, urlData.longUrl);

Url.findByIdAndUpdate(urlData._id, {
  $inc: { clicks: 1 },
  $push: { clickLogs: { timeStamp: new Date(), ip: req.ip } }
}).catch(err => console.error(err));
```

### MongoDB TTL Index

Links auto-delete after expiry:

```javascript
UrlSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, sparse: true }
);
```

---

## Screenshots

> Add screenshots here after deployment

---

## Author

**Satyam Kumar**
- GitHub: [@Satyam8804](https://github.com/Satyam8804)
- Email: satyam8804378323@gmail.com
- System Engineer @ TCS | Salesforce Developer Practice | Bangalore

---

## License

MIT
