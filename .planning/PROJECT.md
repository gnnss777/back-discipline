# Project: Back Discipline - UI/UX Redesign MVP

**Created:** 2026-04-14
**Status:** Planning

## Overview

Comprehensive UI/UX redesign and feature expansion for the Back Discipline training app, transforming it into a complete workout companion for back training with progress tracking, workout logging, and user authentication.

## Goals

1. Redesign UI/UX to MVP level with complete progress tracking
2. Add simple authentication with email/password + Stripe payments
3. Implement workout logging (sets, reps, weight, RPE, notes)
4. Add progress visualization (charts, volume tracking, frequency)
5. Embed videos in exercise library
6. Add configurable rest timer
7. Offline-first architecture with local storage
8. Cleaner codebase (remove duplicate structure)

## Current State

- Next.js 16 App Router app
- Dark theme (#0A0A0A background, #B8956A gold accent)
- 5 pages: Home, livro (program), biblioteca (exercises), dashboard, chapter reader
- Static content: 12 chapters, 16 exercises
- Tailwind CSS 4, Oswald font, Lucide icons

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.3 |
| Language | TypeScript |
| UI Library | React 19.2 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Auth | NextAuth.js or custom |
| Payments | Stripe |
| Storage | LocalStorage + sync |

## Success Criteria

- [ ] User can register/login with email/password
- [ ] User can log workouts with sets, reps, weight, RPE, notes
- [ ] Dashboard shows progress overview
- [ ] Volume tracking and charts work
- [ ] Exercise library has embedded videos
- [ ] Rest timer works with audio
- [ ] App works offline
- [ ] Clean codebase architecture

---

*Planning initiated: 2026-04-14*