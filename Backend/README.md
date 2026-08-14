# SAU Student Portal — Backend API Module

This directory contains backend controllers and data services for Sandlip Africa University Student Portal.

## Architecture & Responsibilities
- **Authentication Services**: Student login, session validation & password resets.
- **Academic Services**: Course registrations, grade sheets, transcript verification & examination schedules.
- **Financial Services**: Tuition fee invoicing, payment gateway integration & bursary receipts.
- **Student Services**: Hostel reservations, library memberships, community posts & support desk.

## Current status
As of this build, the app talks to Supabase directly from the client (see
`Frontend/supabase.js` and `Frontend/script.js`), and the only server-side
routes (Paystack init/verify, avatar upload, Supabase status check) live in
`/Server/server.js`. This folder currently mirrors the Frontend app files so
the project keeps its intended three-folder shape. If you want the services
above split out as real Express controllers, that's a follow-up task — say
the word and it can be built out.
