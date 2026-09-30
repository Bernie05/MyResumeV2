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

Never run two `next dev` instances on the same project folder (they share `.next` and corrupt it). If the browser shows "missing required error components, refreshing...", stop all dev servers, delete `.next`, and restart `npm run dev`.

There is no test runner configured (no `test`/`format` scripts) — don't invoke `npm test`. Verify changes with `npm run type-check` and `npm run lint`, and by running the dev server for UI changes.

Required env vars (`.env.local`): `AUTH_SECRET`, `RESUME_OWNER_PASSWORD`, `NEXTAUTH_URL`; `RESEND_API_KEY` + `INQUIRY_TO_EMAIL` for the contact form (`app/api/inquiry/route.ts`). See `README.md` for setup, local run, and Vercel deployment instructions.

## Architecture

Next.js 14 App Router resume site with two faces built from one dataset:\

- **Public view** — `app/page.tsx` (route `/`) renders `MainView` → the selected template (see Templates below; `ResumePage` is the default), which reads resume content from `data/resume.ts` (seeded into Redux on mount via `useResumeOperations().loadResume`, with `data/resume.ts` as the fallback if the store is empty).
- **Private editor** — `app/secret/page.tsx` renders `SecretResumeEditor`, gated by `middleware.ts` (matches `/secret/:path*`) which checks a NextAuth JWT and redirects to `/secret/login` if absent, preserving the original path in a `?next=` param.

The old `/cv` URL permanently redirects to `/` (see `next.config.js`).

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
- Top-level sections are wrapped in `EditableSection` (`components/templates/shared/EditableSection.tsx`, built on `createSectionProps` from `components/secret/utils/componentUtil.tsx`) to make whole sections clickable/outlined in edit mode.
- Each list-backed section (Experience/Education/Skills/etc.) implements its own header/add/delete/loading/empty UI inline in its own component — there is no shared list-section shell component.

- **Layout:** `SecretResumeEditor` is a slim top bar (title, save chip, Preview/Publish, overflow menu with Discard/Reset/Logout) plus a 360px left sidebar (`components/secret/EditorSidebar.tsx`; MUI Drawer below `md`). The sidebar's list view starts with the **design picker** (`DesignPicker.tsx`, a MUI Select with thumbnail + label; picking calls `setDraft({ template })`), then the sections in their resolved order (`resolveSectionOrder(draft, template.sections)`), each with a drag handle (@dnd-kit) and a hide/show eye toggle; selecting one (or clicking it in the canvas) drills into `renderSectionEditor()`'s form for `PREVIEW_SECTION_TO_EDITOR_SECTION[section]` (services/contact have no form: hint to click text in the preview) and smooth-scrolls the canvas to `#<sectionId>`. The Projects form lists items in the active design's display order (`template.orderProjects`) but edits the original index. All editor text inputs use `AutoGrowTextField` (auto-growing textarea, no truncation; Enter/newlines dropped for single-line fields) instead of MUI's `TextField` directly.

### Templates (multiple designs, one dataset)

`components/templates/index.tsx` is the design registry: `templates` maps an id to `{ label, Component }`, and every template is a `ComponentType<ResumeTemplateProps>` (`{ resume: ResumeData; position?: NavbarPosition }`). `ResumeData.template` stores the chosen id (set via the **Design** picker (thumbnail cards from the registry's `thumbnail`) in `SecretResumeEditor`, saved/published like any other draft change); `resolveTemplate(id)` falls back to `default` for unknown/missing ids (e.g. older persisted drafts). Both `MainView` (public `/`) and the editor canvas render `resolveTemplate(...).Component`, so the selected design is what visitors see and what you edit.

- `default` — Design 1, the original `components/resume/*` (`ResumePage`).
- `showcase` — Design 2, `components/templates/showcase/*` (bold editorial: expanded wordmark, full-bleed project screenshots, ruled lists).

**Adding a design:** create `components/templates/<id>/`, add one registry line. To stay click-to-edit, a design must emit the **existing** `InlineEditableFieldId`s / `ResumeEditableSection`s — no editor changes needed. Use `EditableSection` for each top-level section and `useEditableItem(section)` (`hook/useInlineEditing.tsx`) for fields: `field(id)` returns `{ props, sx }` (spread `props`, merge `sx`), plus `isEditMode`, `onAddAction`, `onDeleteAction` using the editor's action strings (`"projects"`, `"projects.3.tech"`, `"experience.0.bullet"`, `"skills.1.item"`, delete `"<section>.<index>"`, …; see `handleAddAction`/`handleDeleteAction` in `SecretResumeEditor.tsx`). Hide empty sections outside edit mode. Keep list item field ids on the item's **original** index even if the design reorders items.

Each design owns its color scheme (no shared accent): Design 1 uses `theme/sectionPalette.ts`, Showcase uses `components/templates/showcase/tokens.ts`. Shared across designs: `theme/fonts.ts` (Archivo variable font), `hook/useInquiryForm.ts` (contact form state + `/api/inquiry` submit), `downloadResumePdf`.

**Edit accent:** each registry entry has `editAccent(isDarkMode)` and `sections` (the design's default section order). Template roots set it as the CSS var `--edit-accent`; `EditableSection`, `getInlineFieldSx`, `withEditableField`, `createSectionProps` etc. read it via `editAccent(pct)` from `theme/editAccent.ts` (color-mix, teal fallback). The editor passes `resolveTemplate(...).editAccent(isDarkMode)` to `CustomPopover`/sidebar, which render outside the template root.

**Hidden sections:** `ResumeData.hiddenSections?: ResumeEditableSection[]` (toggled from the sidebar via `onToggleSectionHidden` in `EditorContext`; `about` can't be hidden). Templates wrap their root in `HiddenSectionsProvider` (`components/templates/shared/sectionVisibility.tsx`); `EditableSection` then renders nothing on the public page and a dimmed block with a Hidden/Show badge in the editor. Navs must drop links to hidden sections (`useHiddenSections` / `isSectionHidden`). PDF export (`components/resume/pdf`) ignores `hiddenSections`.
**Section order:** `ResumeData.sectionOrder?: ResumeEditableSection[]` (absent = the design's default; never written to `data/resume.json`). `resolveSectionOrder(resume, template.sections)` in `components/templates/shared/sectionOrder.tsx` is the single source of truth: it merges the saved order with the design's defaults (unknown ids dropped, missing ones inserted after their default predecessor) and pins `about` first and `contact` last (not draggable; the footer follows contact). Each template calls it, renders a `section id → element` map in that order, and wraps its root in `SectionOrderProvider`; navs sort their links with `useSectionOrder()`, and the sidebar list uses the same result, so list, canvas and nav can't drift. Showcase renders education + certifications side by side only when adjacent in the order (else each full width via `ShowcaseCredentials only=…`). The sidebar reorders with **@dnd-kit** (`core`, `sortable`, `utilities`; mouse/touch/keyboard sensors): every drag-over calls `onReorder` (saved via `setDraft`, so the canvas follows live and Discard reverts), and a drop selects the section and scrolls to it.

### Auth

`auth.ts` defines NextAuth `authOptions` with a single Credentials provider: the submitted password is SHA-256 hashed and compared (timing-safe) against `RESUME_OWNER_PASSWORD`. There's no user database — a successful login just yields a fixed `resume-owner` identity. `signInUp()` wraps `signIn("credentials", ...)` with typed options for the login form.

### Styling/theme

MUI (`@mui/material`, `@emotion/*`) is the component library. `context/ThemeContext.tsx` provides light/dark mode; `theme/sectionPalette.ts` is Design 1's palette, consumed by `withEditableField` and section components. Path alias `@/*` maps to the repo root (see `tsconfig.json`).

### Utilities

There is no shared `lib/`/`components/utils/` helper layer — an earlier `lib/` (formatting/validation/array/object/storage/api helpers) and `components/utils/componentUtils.ts` were unused dead code and have been removed. Redux persistence uses `redux-persist/lib/storage` directly (see `store/index.ts`), not a project-owned storage wrapper. If you need a shared helper, check `store/hooks.ts` first (it already centralizes the typed Redux hooks), and only add a new `lib/` file once it has a real caller.
