# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint (next lint)
npm run type-check   # tsc --noEmit
```

There is no test runner configured (no `test`/`format` scripts) — don't invoke `npm test`. Verify changes with `npm run type-check` and `npm run lint`, and by running the dev server for UI changes.

Required env vars (`.env.local`): `AUTH_SECRET`, `RESUME_OWNER_PASSWORD`, `NEXTAUTH_URL`. See `README.md` for setup, local run, and Vercel deployment instructions.

## Architecture

Next.js 14 App Router resume site with two faces built from one dataset:\

- **Public view** — `app/cv/page.tsx` renders `MainView` → `ResumePage`, which reads resume content from `data/resume.ts` (seeded into Redux on mount via `useResumeOperations().loadResume`, with `data/resume.ts` as the fallback if the store is empty).
- **Private editor** — `app/secret/page.tsx` renders `SecretResumeEditor`, gated by `middleware.ts` (matches `/secret/:path*`) which checks a NextAuth JWT and redirects to `/secret/login` if absent, preserving the original path in a `?next=` param.

Note: there is currently no `app/page.tsx` (no route for bare `/`) — `/cv` is effectively the resume home page in this branch's state.

### Data flow

`types/resume.ts` defines the `ResumeData` shape (personal info, experience, education, skills, certifications, projects, portfolio, stats, social links). `data/resume.ts` is the static baseline/seed data.

State lives in Redux (`store/index.ts`), with `redux-persist` persisting only the `resumeData` slice to localStorage (key `resume-editor`). Two slices:

- `store/slices/authSlice.ts`
- `store/slices/resumeDataSlice.ts` — load/draft actions (`loadResumeDataStart/Success/Failure`, `replaceResumeDraft`) plus `hasChanges`/`lastSaved` bookkeeping and `markAsSaved`/`resetToBaseline`/`discardChanges` for the editor's save/discard flow. There are no per-entity (experience/education/etc.) reducers — all field-level edits go through `replaceResumeDraft` with a full updated `ResumeData` object.

`store/hooks.ts` exposes typed selectors (`useResumeData`, `useResumeLoading`, etc.) and `useResumeOperations()`, which only wraps initial data loading (`loadResume`). The editor's actual mutation path is `hook/useResumeEditor.tsx`'s `setDraft`, which dispatches the single `replaceResumeDraft` action with the whole updated `ResumeData` object — `SecretResumeEditor.tsx` builds each new draft locally (immutably) and hands it to `setDraft` rather than dispatching per-entity add/update/delete actions. `resumeDataSlice.ts` only defines the load/draft/save/reset actions (`loadResumeDataStart/Success/Failure`, `replaceResumeDraft`, `markAsSaved`, `clearResumeData`, `resetToBaseline`, `discardChanges`) — there are no per-entity CRUD reducers.

`Providers.tsx` composes the app-wide context stack in order: `SessionProvider` (NextAuth) → Redux `Provider` → `PersistGate` → `ThemeContextProvider`.

### Editor/inline-editing pattern

The same `ResumePage`/section components render in both public and edit contexts; edit affordances are driven entirely by `EditorContext` (`context/EditorContext.tsx`), not by separate component trees:

- `isEditMode`, `activeSection`, `activeInlineFieldId` track what's selected.
- `hook/useEditor.ts` re-exports granular selector hooks (`useIsEditMode`, `useActiveField`, `useOnFieldClick`, `useOnSectionClick`, etc.) over that context — prefer these over calling `useEditor()` directly and destructuring, to avoid unnecessary re-renders.
- `components/hoc/withEditableField.tsx` is the HOC that makes a leaf component (text, box, etc.) clickable/highlightable in edit mode; it takes `targetFieldId`/`targetSectionId` props identifying which field the click should open in the editor. `InlineEditableFieldId` and `ResumeEditableSection` (defined in `components/secret/constants/constant.tsx` and `components/resume/ResumePage.tsx` respectively) are the closed sets of valid field/section identifiers — extend those when adding a new editable field or section.
- `ResumePage.tsx` wraps each top-level resume section in a `Box` with `createSectionProps` (from `components/secret/utils/componentUtil.tsx`) to make whole sections clickable when `interactiveSections` is true.
- Each list-backed section (Experience/Education/Skills/etc.) implements its own header/add/delete/loading/empty UI inline in its own component — there is no shared list-section shell component.

### Auth

`auth.ts` defines NextAuth `authOptions` with a single Credentials provider: the submitted password is SHA-256 hashed and compared (timing-safe) against `RESUME_OWNER_PASSWORD`. There's no user database — a successful login just yields a fixed `resume-owner` identity. `signInUp()` wraps `signIn("credentials", ...)` with typed options for the login form.

### Styling/theme

MUI (`@mui/material`, `@emotion/*`) is the component library. `context/ThemeContext.tsx` provides light/dark mode; `theme/sectionPalette.ts` maps resume sections to their accent colors, consumed by `withEditableField` and section components. Path alias `@/*` maps to the repo root (see `tsconfig.json`).

### Utilities

There is no shared `lib/`/`components/utils/` helper layer — an earlier `lib/` (formatting/validation/array/object/storage/api helpers) and `components/utils/componentUtils.ts` were unused dead code and have been removed. Redux persistence uses `redux-persist/lib/storage` directly (see `store/index.ts`), not a project-owned storage wrapper. If you need a shared helper, check `store/hooks.ts` first (it already centralizes the typed Redux hooks), and only add a new `lib/` file once it has a real caller.
