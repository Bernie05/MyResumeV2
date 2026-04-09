# MyResumeV2

Next.js 14 + TypeScript + Material UI resume site with a private owner-only editor.

## Current State

- public resume reads from data/resume.ts
- hidden owner-only /secret area exists in Phase 1
- private auth uses Auth.js credentials auth with RESUME_OWNER_PASSWORD
- public visitors still see baseline data in Phase 1

## Getting Started

1. npm install
2. copy .env.example to .env.local
3. set AUTH_SECRET, and set RESUME_OWNER_PASSWORD in .env.local
4. npm run dev
5. open http://localhost:3000

## Private Access

- /secret/login signs in
- /secret redirects to login when unauthenticated
- /api/auth/[...nextauth] handles the Auth.js credentials flow

## Private Editor Behavior In Phase 1

- Save Draft stores the resume draft in this browser only via localStorage.
- Discard restores the last saved local draft.
- Reset clears the local draft and returns to the static baseline from data/resume.ts.
- Logout clears the Auth.js session.
- Public site visitors still see the baseline from data/resume.ts in Phase 1.

## Auth Configuration

- `AUTH_SECRET` is required by Auth.js to sign the JWT session.
- `RESUME_OWNER_PASSWORD` is the single credentials password accepted for the owner.
- `/secret/login` is the custom Auth.js sign-in page.

## Scripts

```bash
npm run dev
npm run build
npm start
```
