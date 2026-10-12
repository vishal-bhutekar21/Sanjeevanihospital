# CLAUDE.md

Read [documentation/AI_AGENT_GUIDE.md](documentation/AI_AGENT_GUIDE.md) before changing code. Full docs: [documentation/README.md](documentation/README.md).

## Golden rules

1. Never change API field names, endpoints or the database schema without asking.
2. Keep English and Marathi together: every visible string needs both.
3. Use the hospital config (`frontend/src/config/hospital.ts`, `backend/src/config/hospital.config.ts`); never hard-code hospital name, phones, emails, address or hours.
4. Doctor ids are the join key across `frontend/src/data/doctorsData.ts`, `frontend/public/images/doctors/<id>.webp` and backend `ROSTER` in `backend/src/appointments/schedules.ts`.
5. No fake data and no fake save buttons; no chips/badges, gradients or uppercase micro-labels.
6. Verify: `npx tsc --noEmit` + `npx vite build` (frontend), `npx tsc --noEmit -p tsconfig.json` (backend), and check pages in a browser at 390 px, in both languages.
