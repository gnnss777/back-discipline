# Phase 7: Cloud Authentication - Context

**Gathered:** 2026-05-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can register and login with cloud credentials that persist across all devices. Uses Supabase for authentication and database, replacing localStorage-based auth.

</domain>

<decisions>
## Implementation Decisions

### Backend Setup
- **D-01:** Use Supabase for cloud authentication and database
- **D-02:** Create Supabase project, configure env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
- **D-03:** Install @supabase/ssr for Next.js 16 cookie-based auth

### Migration Strategy
- **D-04:** Start fresh — no existing localStorage users to migrate
- **D-05:** New users created directly in Supabase

### Token Expiration
- **D-06:** Supabase handles session automatically (default: 30 days)

### Error Handling
- **D-08:** Display auth errors via Toast notifications (non-blocking)
- **D-09:** Keep users on login page with error message on auth failure

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Research
- `.planning/research/STACK.md` — Supabase setup instructions
- `.planning/research/ARCHITECTURE.md` — Integration architecture
- `.planning/research/PITFALLS.md` — Security pitfalls to avoid

### Existing Code
- `.planning/PROJECT.md` — Project context and tech stack
- `.planning/REQUIREMENTS.md` — AUTH-01, AUTH-02, AUTH-03 requirements

</canonical_refs>

## Existing Code Insights

### Reusable Assets
- Existing AuthContext.tsx — requires refactoring for Supabase
- Login/register forms — can be adapted
- Lucide icons for user avatar

### Established Patterns
- LocalStorage-based auth (to be replaced with Supabase)
- Dark theme with gold accent
- Tailwind CSS 4 styling

### Integration Points
- AuthContext.tsx — swap to Supabase auth
- middleware.ts — add session refresh for Supabase
- Login/register pages — integrate Supabase auth

</code_context>

<specifics>
## Specific Ideas

Use Supabase for authentication and database — provides cross-device login out of the box.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-cloud-authentication*
*Context gathered: 2026-05-04*