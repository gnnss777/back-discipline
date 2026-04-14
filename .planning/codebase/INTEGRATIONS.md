# External Integrations

**Analysis Date:** 2026-04-14

## APIs & External Services

**Content/Data:**
- No external content APIs detected.
- Content is stored locally as TypeScript objects in `src/lib/content.ts` and markdown files in `livro/`.

**External Libraries:**
- **lucide-react** ^1.8.0 - Icon library for UI components. Imported from npm package, not API.
  - No API key required.

## Data Storage

**Content Storage:**
- **Local File System** - Static content in TypeScript modules.
  - Primary: `app/src/lib/content.ts` (447 lines) - Contains all chapter content as string values.
  - Secondary: `app/src/lib/chapters.ts` (116 lines) - Chapter metadata and navigation.
  - Markdown source: `livro/` directory - Contains 11 chapter markdown files.

**No external database:**
- No database integration detected.
- No ORM or database client dependencies.

## Authentication & Identity

**Auth Provider:**
- None detected.
- No authentication libraries (no next-auth, Clerk, Firebase Auth, etc.).
- App appears to be fully public with no user accounts.

## Monitoring & Observability

**Error Tracking:**
- None detected.
- No Sentry, Bugsnag, or similar error tracking integration.

**Logs:**
- Standard console logging via Next.js.
- No external logging service (no Datadog, LogRocket, etc.).

## Font Resources

**Google Fonts:**
- **Oswald** - Loaded via `next/font/google`
  - Weights: 400, 500, 600, 700
  - Subsets: latin
  - Used for: Typography across the entire app

## Static Assets

**Local Assets:**
- Located in `public/` directory:
  - `window.svg`, `vercel.svg`, `next.svg`, `globe.svg`, `file.svg`
- No CDN or external asset hosting detected.

**PDF:**
- `toaz.info-john-meadows-back-training-manual-pr_a488a21d04fa88ba4c843b174aab4eb7.pdf` - Local asset in root.

## CI/CD & Deployment

**Hosting:**
- No explicit hosting platform configured.
- Compatible with Vercel, Netlify, or any Node.js hosting.

**CI Pipeline:**
- None detected.
- No GitHub Actions, GitLab CI, or similar configuration files.

## Environment Configuration

**Required env vars:**
- None detected.
- No `.env` files present.

**Secrets location:**
- Not applicable - no external secrets required.

## Webhooks & Callbacks

**Incoming:**
- None detected.
- No webhook endpoints defined.

**Outgoing:**
- None detected.
- No external API calls from the application.

## Summary

This is a **static content application** with:
- No external API integrations
- No database
- No authentication
- No external services
- Local-only content storage

The application reads fitness training content (Back Discipline program) from local TypeScript modules and serves it via Next.js App Router. It is a self-contained, serverless-ready web application.

---

*Integration audit: 2026-04-14*