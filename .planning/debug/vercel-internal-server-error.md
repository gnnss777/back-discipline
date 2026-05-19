---
status: investigating
trigger: "Vercel deployment builds successfully but live site shows Internal Server Error"
created: 2026-05-07T15:23:00Z
updated: 2026-05-07T15:30:00Z
---

## Current Focus
hypothesis: CONFIRMED — proxy.ts crashes on every request because Supabase env vars are missing/invalid on Vercel
test: Traced code path: proxy.ts -> createServerClient() throws when env vars are falsy or invalid URL
expecting: @supabase/ssr createServerClient throws "Your project's URL and Key are required" if falsy, or network error if placeholder URL
next_action: Implement fix — make proxy.ts graceful when Supabase env vars are missing

## Symptoms
expected: Site loads normally after successful Vercel deployment
actual: Internal Server Error appears in browser on the live site
errors: No build-time errors. Runtime error is "Internal Server Error" — no stack trace visible to user. No Vercel function logs provided.
reproduction: Visit the deployed site URL after successful build (commit 3b6d439)
started: Started after deploying v1.1 milestone (phases 7-10: Supabase auth, user profile, book progress). Previous deploys worked before Supabase integration.

## Eliminated

## Evidence
- timestamp: 2026-05-07T15:23:00Z
  checked: Key context provided
  found: Previous deploys worked BEFORE Supabase integration. Proxy.ts runs on EVERY request. Env vars are placeholder values NOT set in Vercel.
  implication: Supabase integration is the breaking change. Proxy.ts crashing on every request would explain site-wide 500 error.

- timestamp: 2026-05-07T15:25:00Z
  checked: proxy.ts (app/src/proxy.ts)
  found: Calls createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!) with non-null assertions on lines 10-11. Then calls supabase.auth.getUser() on line 30. Has a matcher config that runs on ALL routes except _next/static, _next/image, and favicon.ico.
  implication: If env vars are undefined or placeholder, createServerClient will throw. Since proxy runs on every request, ALL requests fail with 500.

- timestamp: 2026-05-07T15:26:00Z
  checked: .env.local (app/.env.local)
  found: NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here — both are placeholder values. Also, .env.local is NOT deployed to Vercel.
  implication: On Vercel, these env vars are either UNDEFINED (if not set in Vercel dashboard) or have placeholder values from build-time inlining for NEXT_PUBLIC_ vars. Either way, Supabase client creation or auth.getUser() will fail.

- timestamp: 2026-05-07T15:27:00Z
  checked: @supabase/ssr createServerClient source (node_modules/@supabase/ssr/dist/main/createServerClient.js)
  found: Line 9-11: `if (!supabaseUrl || !supabaseKey) { throw new Error("Your project's URL and Key are required to create a Supabase client!") }` — This is a GUARANTEED throw when env vars are falsy.
  implication: CONFIRMED — if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are undefined/empty on Vercel, createServerClient throws immediately, killing the proxy and returning 500.

- timestamp: 2026-05-07T15:28:00Z
  checked: Next.js 16 proxy docs and environment variables docs
  found: (1) Proxy runs on every route by default — no way to skip per-request. (2) NEXT_PUBLIC_ env vars are inlined at BUILD TIME into client bundles. (3) For server-side (proxy runs server-side), non-NEXT_PUBLIC_ vars are only available at runtime. (4) .env files are NOT deployed to Vercel.
  implication: Even if .env.local has placeholder values, they may be inlined at build time for NEXT_PUBLIC_ vars (but since they're invalid URLs, auth.getUser() would still fail with network error). On Vercel without env vars set, they'd be undefined → createServerClient throws.

- timestamp: 2026-05-07T15:29:00Z
  checked: Server actions and other Supabase usage (auth.ts, reading-progress.ts, profile.ts)
  found: Three server action files also call createSupabaseServerClient, but these are only invoked on form submission — not on every request. The proxy.ts is the critical path because it runs on EVERY page load.
  implication: Server actions would also fail, but the primary blocker is proxy.ts since it prevents ALL pages from loading.

## Resolution
root_cause: proxy.ts calls createServerClient with Supabase env vars that are either undefined (not set in Vercel environment variables) or placeholder values ("your-anon-key-here"). The @supabase/ssr createServerClient function throws an error when these values are falsy, and if they're placeholder strings, supabase.auth.getUser() will fail with a network/API error. Since proxy.ts runs on EVERY request via its matcher config, this unhandled exception causes ALL routes to return 500 Internal Server Error. The previous deployment worked because there was no proxy.ts (Supabase was added in v1.1).
fix: Make proxy.ts gracefully handle missing/invalid Supabase configuration by checking env vars before creating the client, and wrapping the Supabase call in try/catch
verification: 
files_changed: []
