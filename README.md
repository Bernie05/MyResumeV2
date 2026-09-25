# MyResumeV2

Next.js 14 (App Router) resume site with two faces built from one dataset:

- **Public view** — `/`, renders the resume from `data/resume.json`, with a **Download CV** button that generates a PDF.
- **Private editor** — `/secret`, a password-gated inline editor for the same data (NextAuth credentials login). **Publish** saves your changes to the live site.

The old `/cv` URL permanently redirects to `/`.

## How content is stored

There's no database. The resume lives in [`data/resume.json`](data/resume.json) in this repo (`data/resume.ts` just imports it with the `ResumeData` type).

When you click **Publish** in the editor:

```
/secret → edit → Publish
   ↓
PUT /api/resume (owner session required)
   ↓
commits data/resume.json to GitHub via the GitHub API
   ↓
Vercel sees the commit and redeploys (~1 minute)
   ↓
the public page shows the update
```

- Unpublished edits are kept as a draft in your browser's localStorage (key `resume-editor`), so closing the tab doesn't lose them.
- Every publish is a git commit — use GitHub history to see or revert past versions.
- Because the site commits to the repo, **run `git pull` before editing code locally** to avoid merge conflicts.

## Download CV

The **Download CV** button builds an A4 PDF in the visitor's browser from the same resume data, so it always matches the published content — there's no separate PDF file to keep in sync. The layout lives in [`components/resume/pdf/ResumePdfDocument.tsx`](components/resume/pdf/ResumePdfDocument.tsx) (built with `@react-pdf/renderer`, loaded only when the button is clicked).

It includes the header/contact info, summary, experience, education, skills, certifications, projects, character references, and declaration. Web-only sections (testimonials, portfolio, services, stats) and placeholder links like `#/facebook` are left out.

## Prerequisites

- Node.js 18+ and npm
- A GitHub repo for this project (needed for **Publish**)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a GitHub fine-grained personal access token (needed for **Publish**):
   - GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
   - **Repository access:** *Only select repositories* → this repo
   - **Permissions → Contents:** *Read and write*

3. Create a `.env.local` file in the project root:

   ```bash
   AUTH_SECRET=some-long-random-string
   RESUME_OWNER_PASSWORD=your-editor-login-password
   NEXTAUTH_URL=http://localhost:3000

   GITHUB_TOKEN=github_pat_xxxxxxxx
   GITHUB_REPO=your-username/MyResumeV2
   GITHUB_BRANCH=main
   ```

   - `AUTH_SECRET` — used by NextAuth to sign/encrypt session tokens. Generate one with `openssl rand -base64 32`.
   - `RESUME_OWNER_PASSWORD` — the password used to log into `/secret`. It's SHA-256 hashed and compared server-side; there's no user database.
   - `NEXTAUTH_URL` — the canonical URL of the running app (`http://localhost:3000` locally).
   - `GITHUB_TOKEN` — the token from step 2. Only used server-side; never prefix it with `NEXT_PUBLIC_`.
   - `GITHUB_REPO` — `owner/repo` that **Publish** commits to.
   - `GITHUB_BRANCH` — the branch Vercel deploys to production (usually `main`). Defaults to `main`.

> **Note:** Publishing from your local dev server commits to the real repo and branch above, and triggers a production redeploy.

## Running locally

```bash
npm run dev
```

Then visit:

- `http://localhost:3000/` — public resume
- `http://localhost:3000/secret` — private editor (redirects to `/secret/login` if not authenticated)

## Other commands

```bash
npm run build        # Production build
npm run start        # Start production server (run `build` first)
npm run lint         # ESLint (next lint)
npm run type-check   # TypeScript check (tsc --noEmit)
```

There is no test runner configured in this project — don't run `npm test`. Verify changes with `npm run type-check`, `npm run lint`, and by exercising the dev server directly.

## Deploying to Vercel

The app is a standard Next.js 14 project, so Vercel's zero-config Next.js support applies.

### Option A — Vercel dashboard (recommended for first deploy)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects the Next.js framework — leave the build command (`next build`) and output settings as default.
4. Under **Environment Variables**, add all six variables from `.env.local`:
   - `AUTH_SECRET`
   - `RESUME_OWNER_PASSWORD`
   - `NEXTAUTH_URL` — set this to your production URL, e.g. `https://your-app.vercel.app` (or your custom domain). Update it again if you later attach a custom domain.
   - `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`
5. Make sure the Vercel **Production Branch** (Settings → Git) matches `GITHUB_BRANCH`, so publishes trigger production deploys.
6. Click **Deploy**.

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
vercel env add GITHUB_TOKEN
vercel env add GITHUB_REPO
vercel env add GITHUB_BRANCH
```

Add them for the `Production`, `Preview`, and `Development` environments as needed — `NEXTAUTH_URL` in particular should differ per environment (preview deploys get a unique `*.vercel.app` URL, so if you rely on it there, set it per-deployment or use `VERCEL_URL`).

### Post-deploy checklist

- Confirm `/` renders the public resume and `/cv` redirects to it.
- Confirm **Download CV** downloads a PDF.
- Confirm `/secret/login` accepts `RESUME_OWNER_PASSWORD` and redirects into `/secret`.
- Make a small edit, click **Publish**, and check that a new commit appears on GitHub and the live site updates about a minute later.

## Troubleshooting

- **Login fails in production but works locally** — double check `AUTH_SECRET` and `NEXTAUTH_URL` in the Vercel project's environment variables (Vercel does not read `.env.local`).
- **Publish fails** — the editor shows the reason, and the server logs it with an `[api/resume]` prefix (Vercel → Project → Logs). Common causes:
  - `GitHub storage is not configured` — `GITHUB_TOKEN` or `GITHUB_REPO` is missing.
  - `401` / `403` from GitHub — the token expired, or it lacks **Contents: Read and write** on this repo.
  - `404` from GitHub — `GITHUB_REPO` or `GITHUB_BRANCH` is wrong.
- **Published but the site didn't change** — check that Vercel's production branch matches `GITHUB_BRANCH`, and that the deploy finished in the Vercel dashboard.
