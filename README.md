# MC Productions Booking

An AI-powered booking app for **MC Productions**, a video editing and production studio.

**Live site:** https://mcproductionsbookings.netlify.app
*(The free backend sleeps when idle. The first load can take 30–60 seconds to wake up.)*

## The problem

Clients often can't put into words what they want. A "singing reel" request turns into a music video, and the edit has to be redone. This app fixes that before the first chat: clients describe their idea in their own words, and an AI assistant recommends the right service and writes a clear project brief for the editor.

## Features

**For clients**
- Browse 15 services with category filters, search and price ranges
- **AI Brief Assistant:** describe a project in plain language and get a recommended service, price range, a written brief (goal, footage, tone, deliverables, length) and a follow-up question if the idea is vague. The brief can be edited before booking.
- **Book a Chat:** pick a service, package (Standard, 2 rounds, or Quick Cut, 1 round), date and time. The AI brief is attached automatically.
- **Double-booking protection:** a taken time slot is rejected with a clear message
- **My Bookings:** status pills (pending, confirmed, declined, cancelled), view the brief, cancel

**For the studio owner**
- **Admin Dashboard:** pending requests first, counts per status, read each client's brief and notes, confirm or decline
- Admin-only routes, protected on the server

**Quality**
- If the AI is busy, the server tries backup models, then shows a friendly message with a "Book without a brief" option, so the client is never stuck
- Loading, empty and error states on every page
- Responsive layouts for desktop, tablet and phone

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), React Router, Context API for login state |
| Backend | Node.js, Express |
| Database | MongoDB Atlas with Mongoose |
| Auth | JWT tokens, passwords hashed with bcrypt |
| AI | Google Gemini API (`@google/genai`), with model fallbacks |
| Hosting | Netlify (frontend), Render (backend) |

## Architecture

Three tiers: **React → Express API → MongoDB**. The browser only talks to Express, and only Express talks to the database and to Gemini, so the API key never reaches the browser.

```
client/   React app: pages, components, AuthContext
server/   Express API: routes → controllers → models, plus auth middleware
```

## API

| Method | Route | Access | What it does |
|---|---|---|---|
| GET | `/api/services` | Public | All services (optional `?category=`) |
| GET | `/api/services/:id` | Public | One service |
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in, returns a token |
| GET | `/api/auth/me` | Logged in | Who is logged in |
| POST | `/api/ai/brief` | Logged in | AI service recommendation and brief |
| POST | `/api/bookings` | Logged in | Book a chat (rejects taken slots) |
| GET | `/api/bookings/mine` | Logged in | The client's own bookings |
| PATCH | `/api/bookings/:id/cancel` | Owner of booking | Cancel a booking |
| GET | `/api/bookings` | Admin | All bookings |
| PATCH | `/api/bookings/:id/status` | Admin | Confirm or decline |

## Run it locally

You need Node.js and a MongoDB Atlas database.

1. Clone the repo and install both halves:
```bash
   cd server && npm install
   cd ../client && npm install
```
2. Create `server/.env` with:
```
   MONGO_URI=your MongoDB connection string
   JWT_SECRET=any long random string
   GEMINI_API_KEY=your key from aistudio.google.com
   PORT=5000
```
3. Add the services: `cd server && node seed.js`
4. Start both (two terminals):
```bash
   cd server && npm run dev     # API on http://localhost:5000
   cd client && npm run dev     # app on http://localhost:5173
```

**Demo client account:** `test@mcbooking.com` / `test1234`

## Planning

The full plan is in the project doc: user stories, functional requirements, user flows, the site map, wireframes for desktop, tablet and phone, a UI style guide, the database design and the architecture.

## AI usage

- **In the app:** Google Gemini writes the project briefs and recommends services. It only chooses from the real service list, and prices always come from the database, never from the AI.
- **Building it:** I used Claude (Anthropic) as a coding coach throughout. I wrote most of the backend myself (auth, bookings, admin routes, the double-booking and ownership checks) and the core React logic (data fetching, AuthContext login state), with Claude explaining concepts, reviewing my code and helping debug. Claude wrote some parts outright, which I reviewed and tested: the auth middleware, parts of the booking controller, page layouts and CSS, the Admin Dashboard and the final polish pass. Testing caught real bugs along the way, such as an admin being able to confirm a booking the client had already cancelled, which I fixed with an extra check.

## Author

**Cole Eggly**, MC Productions