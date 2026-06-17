# Votezy React Frontend

React (Vite) frontend for the Votezy Spring Boot online voting backend.

## Setup

1. Make sure your Spring Boot backend (Votezy API) is running on `http://localhost:8080`.
2. Open a terminal in this folder and run:
   ```
   npm install
   npm run dev
   ```
3. Open the URL shown in the terminal (usually `http://localhost:5173`) in your browser.

## API base URL

The backend URL is set in `src/api/votezyApi.js` at the top:
```js
const API_BASE = "http://localhost:8080/api";
```
Change this if your backend runs on a different port.

## Pages

- `/` — Home / landing page
- `/voters` — Register, list, edit, delete voters
- `/candidates` — Register, list, edit, delete candidates
- `/vote` — Cast a vote (enter voter ID, pick a candidate)
- `/results` — Declare an election result and view vote tallies
