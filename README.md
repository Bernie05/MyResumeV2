# MyResumeV2

Next.js 14 + TypeScript + Material UI resume site with private owner Studio.

## Current State

- public resume reads from data/resume.ts
- hidden owner Studio exists in Phase 1
- Studio auth uses RESUME_OWNER_PASSWORD and session cookie
- public visitors still see baseline data in Phase 1

## Getting Started

1. npm install
2. copy .env.example to .env.local
3. set RESUME_OWNER_PASSWORD in .env.local
4. npm run dev
5. open http://localhost:3000

## Studio Access

- /studio/login signs in
- /studio redirects to login when unauthenticated

## Studio Behavior In Phase 1

- Save Draft stores the resume draft in this browser only via localStorage.
- Discard restores the last saved local draft.
- Reset clears the local draft and returns to the static baseline from data/resume.ts.
- Logout clears the auth session cookie.
- Public site visitors still see the baseline from data/resume.ts in Phase 1.

## Scripts

```bash
npm run dev
npm run build
npm start
```
