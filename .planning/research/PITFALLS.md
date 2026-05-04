# Domain Pitfalls: User Profile, Cross-Device Login, and Reading Progress

**Domain:** Mobile-first reading app (Back Discipline) adding cloud auth and progress sync to localStorage-based app
**Researched:** 2026-05-04
**Confidence:** MEDIUM-HIGH

## Critical Pitfalls

Mistakes that cause rewrites, security vulnerabilities, or major user experience issues.

---

### Pitfall 1: Storing Authentication Tokens in localStorage

**What goes wrong:** XSS vulnerabilities allow attackers to steal authentication tokens, leading to account compromise.

**Why it happens:** localStorage is accessible via JavaScript, making it vulnerable to cross-site scripting (XSS) attacks. Any third-party script, browser extension, or XSS vulnerability can read tokens stored there.

**Consequences:** 
- Account takeover via stolen tokens
- Unauthorized access to user data
- Inability to invalidate sessions remotely (no server-side session revocation)
- Violation of OWASP security recommendations

**Prevention:** 
- Store tokens in httpOnly, Secure, SameSite cookies instead of localStorage
- Use server-side session management with session IDs (not JWTs stored client-side)
- Implement refresh token rotation with secure cookie storage
- Add CSRF protection tokens

**Detection:** 
- Security audits flag localStorage token access
- User reports of unauthorized account access

**Sources:** 
- OWASP Documentation (HIGH confidence)
- GetNextKit Blog, "7 Common Next.js Authentication Mistakes" (2025-11-17) (HIGH confidence)
- SecPal/frontend Issue #208 (HIGH confidence)

---

### Pitfall 2: Big-Bang Data Migration from localStorage to Cloud

**What goes wrong:** Migrating all user data in a single API request causes failures, timeouts, and data loss.

**Why it happens:** 
- Payload size limits on API requests
- Network timeouts on large transfers
- No ability to handle partial failures
- No rollback capability

**Consequences:** 
- Incomplete migration leaving users with partial data
- User data loss
- Forced re-import from manual backups
- Poor user experience requiring re-authentication

**Prevention:** 
- Implement batch-based sync with chunks of rows per request
- Use upsert method for idempotent operations (insert new records, update on conflict)
- Track successful batches with `last_synced_at` timestamp
- Implement retry logic for failed batches only
- Use delta syncing after initial full sync (only sync changed records)

**Detection:** 
- API timeout errors in logs
- Incomplete data in cloud database
- User complaints of missing data

**Sources:** 
- TechNet Experts, "Best Strategy for Migrating Local App Data to Supabase" (2025-11-24) (MEDIUM confidence)

---

### Pitfall 3: File Hash Mismatch Breaking Reading Progress Sync

**What goes wrong:** Reading progress fails to sync between devices because the book file content hash differs.

**Why it happens:** 
- Different file sources (different EPUB versions)
- Metadata modifications byCalibre or other library software
- File re-encoding or format changes
- Different partial content checksums

**Consequences:** 
- Progress shows "latest from this device" when it shouldn't
- Users lose reading progress on secondary devices
- Cannot reconcile progress conflicts
- "No progress found" errors when pulling

**Prevention:** 
- Implement multiple sync matching strategies: content hash, filename, or ISBN/identifier
- Display sync ID/hash in UI for debugging
- Add manual "force sync" option for users
- Warn users when file hashes mismatch
- Use filename-based matching as fallback

**Detection:** 
- User reports progress not syncing
- Logs showing content hash mismatches
- Conflict resolution showing same book with different hashes

**Sources:** 
- KOReader Issue #13794 (2025-05-15) (HIGH confidence)
- Readest Issue #2300 (2025-10-22) (HIGH confidence)

---

### Pitfall 4: Cross-Device Session Cookie Misconfiguration

**What goes wrong:** Sessions don't persist across devices or subdomains due to cookie configuration errors.

**Why it happens:** 
- Missing `SameSite` attribute
- Incorrect `Domain` attribute (must include leading dot for subdomains)
- Missing `Secure` flag for HTTPS
- Cookie path issues

**Consequences:** 
- Users logged out when switching devices
- Session works on one subdomain but not another
- Auth fails silently in production but works in development

**Prevention:** 
- Set `SameSite: 'lax'` for session cookies
- Use `.example.com` (with leading dot) for cross-subdomain sharing
- Set `Secure: true` in production
- Ensure `Domain` matches all intended subdomains
- Test cookie behavior across different browsers and devices

**Detection:** 
- User reports of being logged out between devices
- Different behavior on subdomains
- Session token not sent in requests

**Sources:** 
- Brian Morrison II, "Next.js Session Management" (Clerk, 2025-12-19) (HIGH confidence)
- Roy Anger, "Authentication for Serverless and Edge Deployments" (Clerk, 2026-04-22) (HIGH confidence)

---

### Pitfall 5: Middleware-Only Authentication

**What goes wrong:** Authentication only checked in middleware allows bypass via static routes or CVE exploits.

**Why it happens:** 
- Middleware doesn't run on static assets
- Middleware can be bypassed with specific HTTP headers (CVE-2025-29927)
- Data Access Layer (DAL) checks not implemented

**Consequences:** 
- Unauthorized access to static routes
- Complete auth bypass in self-hosted deployments
- Server Actions publicly callable without auth checks
- XSS can bypass client-side-only auth

**Prevention:** 
- Implement auth checks at every boundary: middleware, Server Components, Route Handlers, Server Actions
- Never rely solely on middleware for security
- Use defense-in-depth: client-side for UX, server-side for security
- Update Next.js to patched versions (>=15.2.3, >=14.2.25)
- Block vulnerable headers at edge/WAF

**Detection:** 
- Unauthorized API access logs
- Users accessing content without authentication
- CVE-2025-29927 scanning attempts

**Sources:** 
- NVD CVE-2025-29927 (CVSS 9.1 Critical) (HIGH confidence)
- GetNextKit Blog (2025-11-17) (HIGH confidence)

---

## Moderate Pitfalls

### Pitfall 6: Race Conditions in User Profile Creation

**What goes wrong:** Users access application before webhook creates their database record, causing errors.

**Why it happens:** 
- Webhook arrives after user navigates to protected page
- Async webhook processing not yet complete
- No loading state while waiting for record

**Consequences:** 
- Users see error pages on first visit
- Protected content inaccessible
- Poor first impression

**Prevention:** 
- Use upsert pattern in both webhooks and page load
- Implement loading states that wait for record creation
- Create database record at registration time, not via webhook
- Add defensive checks for "user not found" scenarios

**Sources:** 
- Clerk Documentation, "How to sync Clerk user data to your database" (2025-12-19) (HIGH confidence)

---

### Pitfall 7: Device ID Conflicts in Progress Sync

**What goes wrong:** Multiple devices share the same device ID, causing sync conflicts and incorrect progress updates.

**Why it happens:** 
- Settings copied between devices preserving device_id
- No unique device identifier generated
- User-modified settings causing collisions

**Consequences:** 
- Progress shows "latest from this device" incorrectly
- Sync conflicts between devices
- Incorrect progress resolution

**Prevention:** 
- Generate unique device ID on first launch
- Allow users to view device ID in settings
- Add device ID validation in sync logic
- Provide troubleshooting UI showing device IDs

**Sources:** 
- Calibre-Web-Automated Issue #1214 (2026-03-18) (HIGH confidence)

---

### Pitfall 8: Progress Offset Inconsistencies Across Screen Sizes

**What goes wrong:** Reading progress position differs between devices with different screen sizes, causing incorrect sync.

**Why it happens:** 
- Progress tracked by position (CFI) vs page number
- Different visible content per screen size
- Font size and margin settings affect visible content

**Consequences:** 
- Progress off by 1-3 pages after sync
- Percentages don't match (54% local vs 58% remote for same position)
- Conflict prompts for single-device progress

**Prevention:** 
- Use CFI (Continuous Fragment Identifiers) for position tracking
- Normalize progress on sync (accept slight offsets)
- Don't show conflict for < 0.01% difference
- Allow manual force-sync option

**Sources:** 
- Readest Issue #3137 (2026-02-01) (HIGH confidence)

---

### Pitfall 9: Session Token vs Database User Drift

**What goes wrong:** Session token exists but user deleted from database, causing silent failures.

**Why it happens:** 
- Session validated but user no longer exists
- Account deletion after session creation
- Database sync issues

**Consequences:** 
- Frontend appears logged in
- Backend refuses operations with confusing errors
- Silent failures in data access

**Prevention:** 
- Always verify backend token and check user existence in DB
- Return 403 for deleted users with valid sessions
- Implement session revocation on account deletion
- Add "user not found" logging

**Sources:** 
- AckermannQ, "The Subtle Art of Trust: Syncing Auth Between Frontend, Backend, and Database" (Forem, 2025-05-28) (MEDIUM confidence)

---

### Pitfall 10: Token Refresh Failures Silently

**What goes wrong:** Token refresh fails silently, leaving users "logged in" but unable to access data.

**Why it happens:** 
- Supabase/API issues causing timeouts
- No error handling for refresh failures
- Network issues during refresh

**Consequences:** 
- Users see 401 errors unexpectedly
- No clear error messages
- Users think app is broken

**Prevention:** 
- Implement proper error handling for refresh failures
- Add fallback mechanisms (re-auth prompt)
- Cache user data for degraded mode
- Show clear error messages

**Sources:** 
- Toolstac, "Supabase Auth with Next.js 13+" (2025-09-02) (MEDIUM confidence)

---

## Minor Pitfalls

### Pitfall 11: Missing CSRF Protection

**What goes wrong:** Custom authentication without CSRF protection vulnerable to cross-site request forgery.

**Why it happens:** 
- Cookies sent automatically with requests
- No CSRF token validation
- Over-reliance on SameSite cookie protection alone

**Prevention:** 
- Implement CSRF token in forms
- Validate CSRF tokens on state-changing operations
- Use SameSite cookies as defense-in-depth, not sole protection

---

### Pitfall 12: Full User Objects Returned to Client

**What goes wrong:** Exposing sensitive user data (passwords, internal IDs) to client-side JavaScript.

**Why it happens:** 
- Returning full database user objects
- Not implementing data minimization
- Including internal metadata in responses

**Prevention:** 
- Return only necessary fields to client
- Sanitize user objects before sending to frontend
- Implement DTO (Data Transfer Object) patterns

---

### Pitfall 13: Progress Sync Not Idempotent

**What goes wrong:** Multiple sync attempts create duplicate progress records or conflicting states.

**Why it happens:** 
- No upsert logic for progress records
- No conflict resolution strategy
- Re-running sync creates duplicates

**Prevention:** 
- Use upsert for progress (insert or update on conflict)
- Implement conflict resolution: latest wins, or user choice
- Make sync operations idempotent

---

### Pitfall 14: Ignoring Storage Quotas

**What goes wrong:** Chrome storage.sync quota (100KB total, 8KB per item) exceeded, causing sync failures.

**Why it happens:** 
- Storing large data in sync storage
- Not monitoring quota usage
- No fallback to local storage

**Prevention:** 
- Use `getBytesInUse()` before large writes
- Fallback to localStorage when quota exceeded
- Store only lightweight settings in sync storage

**Sources:** 
- MaterialYouNewTab Issue #108 (2025-12-21) (MEDIUM confidence)

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **User Profile Migration** | Storing tokens in localStorage | Migrate to httpOnly cookies before cloud auth |
| **Cross-Device Login** | Cookie misconfiguration | Test across all device/browser combinations |
| **Reading Progress Sync** | File hash mismatch | Implement multiple matching strategies |
| **Cloud Auth Integration** | Big-bang migration | Batch sync with retry logic |
| **Profile + Progress Combo** | Data consistency | Transactions or eventual consistency handling |
| **Session Management** | Middleware-only auth | Implement auth at every boundary |

---

## Sources

### HIGH Confidence (Verified)

- **OWASP Authentication Cheat Sheet** — Token storage security
- **NVD CVE-2025-29927** — Next.js middleware bypass vulnerability
- **Clerk Documentation** — Session management patterns
- **KOReader/KOReader Issues** — Reading progress sync pitfalls
- **GetNextKit Blog** — Next.js auth mistakes

### MEDIUM Confidence

- **TechNet Experts** — Data migration strategy
- **Toolstac** — Supabase + Next.js integration
- **Forem Community** — Auth sync patterns
- **Readest/KOReader Issues** — Sync debugging

---

## Appendix: Reading Progress Sync Architecture Notes

Based on research, reading progress sync is notoriously difficult because:

1. **File identity problem**: Same book file must be identified across devices. Content hash is most reliable but fails when files differ.

2. **Position representation**: CFI (Continuous Fragment Identifiers) are standard but can drift with font/settings. Page numbers are unreliable across device types.

3. **Conflict resolution**: Even single-device usage shows conflicts due to timing. Use threshold logic (< 0.01% diff = no conflict).

4. **Bidirectional sync**: Implement webhooks for real-time sync, not just polling.

5. **Offline handling**: Queue changes offline, flush when online. Handle partial failures gracefully.