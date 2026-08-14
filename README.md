# SAU Student Portal — Sandlip Africa University

A student portal for academics, finance, campus life, and innovation.

This project is built with **plain HTML, CSS, and JavaScript** on the client
(no React, no TypeScript, no build step) plus a small **Node.js/Express**
server for the few things that must run server-side (Paystack payment
gateway, avatar upload, Supabase connection status).

## Project structure

```
Frontend/     Client app: index.html, style.css, script.js, data.js, icons.js, supabase.js
Backend/      Mirrors the Frontend app files (see Backend/README.md for details)
Server/       Express server: server.js (routes) + supabase.js (server-side Supabase client)
```

## Run locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and fill in your Paystack and Supabase keys
   (a working `.env` is already included for this build — rotate those keys
   before using this in production, since they've been sitting in a plain
   file).
3. Start the server:
   `npm start`
4. Open **http://localhost:3000** in your browser.

The server (`Server/server.js`) serves everything in `Frontend/` as static
files and exposes the API routes under `/api/*`.
  (`import 'dotenv/config'`) — previously nothing in the project actually
  called `dotenv`, so environment variables only loaded because the old dev
  tooling (Vite/Bun) did it automatically behind the scenes.
- Two broken stylesheet links (`Frontend/index.html` and `Backend/index.html`
  were both pointing at a non-existent `./Frontend/style.css` instead of
  `./style.css`) have been fixed.
