# E-Rental Frontend

Next.js App Router executive dashboard for the E-Rental platform.

## Setup

```bash
npm install
cp .env.local.example .env.local   # if needed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment

| Variable | Default |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` |

## Routes

- `/signin` — Authentication
- `/signup` — Registration
- `/executive` — Executive analytics dashboard (protected)
