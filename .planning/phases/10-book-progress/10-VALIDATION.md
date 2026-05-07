---
phase: 10
slug: book-progress
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-05
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | No test framework installed — all behavioral verification is manual for Phase 10 |
| **Config file** | none |
| **Quick run command** | `cd app && npx tsc --noEmit` |
| **Full suite command** | `cd app && npx tsc --noEmit && npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd app && npx tsc --noEmit`
- **After every plan wave:** Run `cd app && npx tsc --noEmit && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | BOOK-04 | structural | `cd app && npx tsc --noEmit` | ✅ | ⬜ pending |
| 10-01-02 | 01 | 1 | BOOK-04 | structural | `cd app && npx tsc --noEmit` | ✅ | ⬜ pending |
| 10-01-03 | 01 | 1 | BOOK-04 | structural | `cd app && npx tsc --noEmit` | ✅ | ⬜ pending |
| 10-02-01 | 02 | 2 | BOOK-01 | structural | `cd app && npx tsc --noEmit` | ✅ | ⬜ pending |
| 10-02-02 | 02 | 2 | BOOK-05 | structural | `cd app && npx tsc --noEmit` | ✅ | ⬜ pending |
| 10-02-03 | 02 | 2 | BOOK-06 | structural+manual | `cd app && npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements (TypeScript compiler + Next.js build).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| CheckCircle icon appears on completed chapters | BOOK-01 | CSS/rendering — no test framework | Visit /livro logged in, complete a chapter, return to /livro — verify gold CheckCircle on completed chapter |
| Last-read chapter gold left-border + "CONTINUAR LEITURA" | BOOK-02 | CSS/rendering — no test framework | Visit /livro/[slug], return to /livro — verify gold left-border on last-read chapter |
| 44px touch targets on nav buttons | BOOK-03 | CSS/layout — no test framework | Inspect nav buttons on /livro/[slug] — verify min-h-[44px] on prev/next/CONCLUIR buttons |
| Mobile font 18px + line-height 2.0 | BOOK-05 | CSS/layout — no test framework | Read chapter content on mobile — verify text-lg (18px) and leading-[2.0] |
| CONCLUIR toggle marks/unmarks chapter | BOOK-01 | Interactive — no test framework | Tap CONCLUIR → verify "CONCLUÍDO" + filled CheckCircle, tap again → verify "CONCLUIR" + outline |
| Dynamic progress counter updates | BOOK-06 | Interactive — no test framework | Complete chapters → verify counter changes from "0 / 11" to "1 / 11" etc. |
| Progress bar animates | BOOK-06 | CSS animation — no test framework | Complete chapters → verify bar width increases with transition |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
