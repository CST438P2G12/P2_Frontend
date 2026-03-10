# GymLog Frontend

React + Vite frontend for the GymLog app.

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`. The Vite dev server proxies all `/api` and `/oauth2` requests to the backend at `http://localhost:8080`.

## Pages

| Route        | Page         | Description                        |
|--------------|--------------|------------------------------------|
| `/login`     | Login        | Google OAuth2 sign-in              |
| `/dashboard` | Dashboard    | Workout stats overview             |
| `/workouts`  | Workout Log  | Log and delete workouts            |
| `/profile`   | Profile      | Edit name, delete account          |
| `/admin`     | Admin Panel  | View, edit, delete all users       |

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   └── Navbar.css
├── pages/
│   ├── Login.jsx / Login.css
│   ├── Dashboard.jsx / Dashboard.css
│   ├── WorkoutLog.jsx / WorkoutLog.css
│   ├── Profile.jsx / Profile.css
│   └── Admin.jsx / Admin.css
├── styles/
│   └── global.css
├── App.jsx
└── main.jsx
```

## Backend Connection

The backend URL is set to `http://localhost:8080`. When deploying, update the proxy in `vite.config.js` and the OAuth2 redirect URL in `Login.jsx`.
