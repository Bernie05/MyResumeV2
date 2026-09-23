# MyResumeV2

Next.js 14 (App Router) resume site with two faces built from one dataset:

- **Public view** — `/cv`, renders the resume from `data/resume.ts` (seeded into Redux on load).
- **Private editor** — `/secret`, a password-gated inline editor for the same data (NextAuth credentials login).

## Prerequisites

- Node.js 18+ and npm

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root with the following required variables:

   ```bash
   AUTH_SECRET=some-long-random-string
   RESUME_OWNER_PASSWORD=your-editor-login-password
   NEXTAUTH_URL=http://localhost:3000
   ```

   - `AUTH_SECRET` — used by NextAuth to sign/encrypt session tokens. Generate one with `openssl rand -base64 32`.
   - `RESUME_OWNER_PASSWORD` — the password used to log into `/secret` (the private editor). It's SHA-256 hashed and compared server-side; there's no user database.
   - `NEXTAUTH_URL` — the canonical URL of the running app (`http://localhost:3000` locally).

## Running locally

```bash
npm run dev
```

Then visit:

- `http://localhost:3000/cv` — public resume
- `http://localhost:3000/secret` — private editor (redirects to `/secret/login` if not authenticated)

## Other commands

```bash
npm run build        # Production build
npm run start         # Start production server (run `build` first)
npm run lint          # ESLint (next lint)
npm run type-check    # TypeScript check (tsc --noEmit)
```

There is no test runner configured in this project — don't run `npm test`. Verify changes with `npm run type-check`, `npm run lint`, and by exercising the dev server directly.

## Deploying to Vercel

The app is a standard Next.js 14 project, so Vercel's zero-config Next.js support applies.

### Option A — Vercel dashboard (recommended for first deploy)

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects the Next.js framework — leave the build command (`next build`) and output settings as default.
4. Under **Environment Variables**, add the same three variables from `.env.local`:
   - `AUTH_SECRET`
   - `RESUME_OWNER_PASSWORD`
   - `NEXTAUTH_URL` — set this to your production URL, e.g. `https://your-app.vercel.app` (or your custom domain). Update it again if you later attach a custom domain.
5. Click **Deploy**.

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel            # first run: links the project, deploys a preview
vercel --prod     # deploys to production
```

The CLI will prompt you to link/create a Vercel project on first run. Add env vars beforehand (or when prompted) via:

```bash
vercel env add AUTH_SECRET
vercel env add RESUME_OWNER_PASSWORD
vercel env add NEXTAUTH_URL
```

Add them for the `Production`, `Preview`, and `Development` environments as needed — `NEXTAUTH_URL` in particular should differ per environment (preview deploys get a unique `*.vercel.app` URL, so if you rely on it there, set it per-deployment or use `VERCEL_URL`).

### Post-deploy checklist

- Confirm `/cv` renders the public resume.
- Confirm `/secret/login` accepts `RESUME_OWNER_PASSWORD` and redirects into `/secret`.
- If login fails in production but works locally, double check `AUTH_SECRET` and `NEXTAUTH_URL` are set correctly in the Vercel project's environment variables (not just `.env.local`, which Vercel does not read).
