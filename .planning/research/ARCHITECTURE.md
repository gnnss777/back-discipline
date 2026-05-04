# Architecture Research: User Profile, Cloud Auth & Book Mobile Optimization

**Project:** Back Discipline - v1.1 User Profile & Book Improvements  
**Researched:** 2026-05-04  
**Domain:** Mobile-first web app with cloud-synced authentication  
**Confidence:** MEDIUM-HIGH

---

## Executive Summary

This document outlines the architecture integration strategy for adding three connected features to the existing Back Discipline Next.js application: user profile management, cross-device cloud authentication, and mobile-optimized book reading with progress tracking. The core architectural shift required is moving from client-side localStorage persistence to server-side cloud storage with proper session management via httpOnly cookies.

The existing localStorage-based auth system stores user credentials, workout data, and progress directly in the browser. This architecture cannot support cross-device login because there is no central data store. The recommended approach integrates a managed auth provider (Supabase Auth) that provides both authentication and database capabilities, enabling seamless cross-device synchronization while maintaining the existing dark-themed UI patterns.

Key integration points include replacing the custom AuthContext with Supabase session management, creating a user profile table that syncs with existing localStorage user data, and adding reading progress tracking as a new data entity that associates with user accounts. The data flow shifts from client-driven localStorage reads/writes to server-side API calls and real-time subscriptions, requiring changes to both the authentication layer and the data fetching patterns throughout the application.

---

## 1. Integration Points Identified

### 1.1 Authentication Layer Integration

The primary integration point is the authentication system, which currently uses a custom AuthContext with localStorage for persistence. The existing auth implementation in `context/AuthContext.tsx` manages login state, user object storage, and session persistence through localStorage keys. This must be replaced with Supabase Auth which provides session management via httpOnly cookies, enabling cross-device session persistence.

The integration involves mapping the existing user data structure to Supabase's user schema. The current localStorage stores user objects with properties like email, name, and subscription status. Supabase Auth provides a similar user object through its authentication service, but requires additional configuration for storing extended profile data. The solution creates a `user_profiles` table that extends the base Supabase user with application-specific fields matching the existing data structure.

The login flow integration requires updating both the login page (`pages/login.tsx` or `app/login/page.tsx`) and the registration flow to use Supabase's auth methods instead of the current localStorage-based validation. The existing AuthContext provides methods like `login`, `register`, and `logout` that must be rewritten to call Supabase Auth APIs while maintaining the same interface for consuming components.

### 1.2 Data Persistence Integration

The second integration point involves the data storage layer. Currently, the application uses separate localStorage keys for different data types: user information, workout logs, and progress data. The migration to Supabase creates corresponding database tables and updates data access patterns throughout the application.

The existing data mapping includes users stored under `bd_users`, workouts under `bd_workouts`, and progress under `bd_progress`. These localStorage keys map to database tables as follows: the user profile data moves to a `profiles` table (Supabase convention), workout data moves to a `workouts` table, and progress data moves to a `progress` table. Each table includes a foreign key linking to the Supabase auth user ID, enabling proper data isolation between users.

The integration requires creating database migration scripts that export existing localStorage data and import it into the new Supabase tables. For users with existing localStorage data, the migration runs on first login, detecting existing localStorage data and syncing it to the cloud database. This approach preserves user data during the transition while establishing the foundation for cross-device sync.

### 1.3 Book Reading Component Integration

The third integration point is the book/livro component. The existing chapter-based content delivery in `pages/livro.tsx` or `app/livro/page.tsx` needs mobile optimization and reading progress tracking. This requires adding a new reading progress entity and modifying the chapter navigation component.

The integration adds a `reading_progress` table that tracks which chapters a user has read, scroll position within chapters, and last read timestamp. The existing livro page components check this table on load to restore the user's reading position and display progress indicators. The mobile optimization integrates through responsive design updates to the chapter content display without requiring structural changes to the existing content delivery system.

---

## 2. New vs Modified Components

### 2.1 New Components Required

The architecture introduces several new components and infrastructure elements to support cloud authentication and reading progress tracking.

A Supabase client configuration file (`lib/supabase.ts`) initializes the connection to the Supabase project with environment variables for the project URL and anon key. This client handles both authentication and database operations, replacing the localStorage dependency for user data.

A middleware configuration file (in Next.js 16, this would be `proxy.ts` at the project root) handles session validation for protected routes. This file runs on every request, validates the Supabase session cookie, and redirects unauthenticated users to the login page while allowing authenticated users to access protected content. The middleware also handles session refresh, ensuring that expired tokens are silently renewed without user intervention.

A profile management API route (`app/api/profile/route.ts`) handles reading and updating user profile data. This includes fetching the extended profile information that Supabase Auth doesn't store by default, such as subscription status, preferences, and display name. The route integrates with Supabase's Row Level Security (RLS) to ensure users can only access their own profile data.

A reading progress tracking module (`lib/reading-progress.ts`) provides functions to save progress, fetch current position, and sync progress across devices. This module calls the Supabase `reading_progress` table and handles real-time subscriptions for immediate UI updates when progress changes on any device.

### 2.2 Modified Components

Several existing components require modification to integrate with the new architecture while preserving existing functionality.

The AuthContext provider (`context/AuthContext.tsx`) requires significant modification to replace localStorage-based auth with Supabase session management. The existing interface remains largely intact—methods like `user`, `loading`, `login`, `register`, and `logout` continue to exist—but their implementation shifts from localStorage operations to Supabase Auth calls. The context now subscribes to Supabase's auth state changes, providing real-time updates when sessions start or end.

The login and registration pages (`app/login/page.tsx` and `app/register/page.tsx`) modify their form submission handlers to call Supabase Auth instead of validating against localStorage. The existing form validation logic remains, but the submission calls `supabase.auth.signInWithPassword` or `supabase.auth.signUp` with the form credentials. Error handling adapts to Supabase's error format while maintaining the same user feedback patterns.

The top navigation bar (`components/Header.tsx` or similar) requires modification to add the user profile icon and dropdown menu. The existing navigation likely already has a layout structure; this change adds a conditional rendering that displays the profile menu when a user is authenticated. The menu links to profile settings and includes a logout action that calls the Supabase sign-out method.

The livro/chapter page (`app/livro/page.tsx`) requires modification to integrate reading progress tracking. This includes adding progress indicators to chapter lists, storing scroll position on navigation away from the page, and restoring position when returning to a chapter. The mobile optimization applies through Tailwind CSS classes rather than structural changes, ensuring the existing content renders properly on smaller screens.

Data fetching hooks throughout the application modify their storage calls from localStorage to Supabase queries. This affects workout logging, progress tracking, and any other features that currently read from or write to localStorage. The hooks maintain the same return values and loading states while the underlying data source changes.

---

## 3. Data Flow Changes

### 3.1 Authentication Data Flow

The authentication data flow fundamentally changes from client-side validation to server-side session management with cookie-based persistence.

Currently, the authentication flow works as follows: the user enters credentials on the login page, the form submission handler checks the email and password against data stored in localStorage (or allows registration that writes to localStorage), a successful login creates a user object stored in localStorage with the key `bd_users`, and subsequent page loads read this localStorage key to restore the authenticated state.

The new authentication flow operates differently: the user enters credentials on the login page, the form submission calls `supabase.auth.signInWithPassword()`, upon successful authentication Supabase returns a session object containing an access token and refresh token, Supabase automatically stores these tokens in httpOnly cookies that persist across devices, and the middleware validates these cookies on every request, refreshing expired tokens automatically.

The key difference is that the session now lives in HTTP-only cookies managed by the browser and Supabase, rather than in localStorage accessible to JavaScript. This enables cross-device session persistence because the browser automatically sends the cookies with requests from any device, and the server validates these cookies against the Supabase session store.

### 3.2 User Profile Data Flow

User profile data follows a similar pattern, shifting from local storage to database queries with server-side validation.

Currently, user profile data flows through localStorage: registration stores user details in `bd_users` localStorage, login retrieves this data from localStorage, and profile updates modify the localStorage value.

The new profile data flow uses Supabase: the `profiles` table stores extended user data linked to the Supabase auth user ID, the profile API route reads and writes this data with RLS enforcement, and the client fetches profile data through server actions or API routes that validate the session.

The integration logic checks for existing localStorage data on first login: if localStorage contains user data but the database is empty, the system migrates that data to the database; if the database already has data, it uses the database values and may update localStorage to match for consistency.

### 3.3 Reading Progress Data Flow

Reading progress tracking represents a new data flow that didn't exist in the previous architecture.

The flow operates entirely through Supabase: when a user opens a chapter, the client fetches their progress for that chapter from the `reading_progress` table, if progress exists the UI restores the scroll position, as the user reads the client periodically saves progress (debounced to avoid excessive writes), and on chapter navigation the final position is saved and the next chapter's progress is fetched.

Cross-device synchronization happens automatically through Supabase's real-time capabilities: when progress saves on one device, the change propagates to Supabase, and when the user opens the book on another device, the fetch retrieves the latest progress from the server.

### 3.4 Workout and Progress Data Flow

The existing workout and progress data flows modify to support cloud sync while maintaining the same user experience.

Currently, both workout logs and progress data read from and write to localStorage keys (`bd_workouts` and `bd_progress`). The new flow maintains this data in Supabase tables with foreign keys to the user ID: workout data flows through the `workouts` table with user_id foreign key, progress data flows through the `progress` table with user_id foreign key, and both tables use RLS to ensure users only access their own data.

The migration strategy for existing workout and progress data mirrors the user profile migration: on first login, check localStorage for existing data and migrate to Supabase if present. This ensures users don't lose their historical data when the architecture transitions.

---

## 4. Suggested Build Order

### 4.1 Phase 1: Foundation Infrastructure (Week 1)

The first phase establishes the Supabase project, configures the authentication layer, and creates the basic infrastructure for the remaining features.

Begin by creating a Supabase project through the Supabase dashboard and obtaining the project URL and anon key. Configure the environment variables in the Next.js application `.env.local` file with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Create the Supabase client configuration in `lib/supabase.ts`, initializing the connection with the standard Supabase createClient method.

Next, create the database schema by executing SQL migrations that create the `profiles`, `workouts`, `progress`, and `reading_progress` tables. Configure Row Level Security policies on each table to enforce that users can only read and write their own records. The SQL includes statements creating the tables with appropriate columns, setting up foreign key relationships to the auth.users table, and creating RLS policies that use `auth.uid() = user_id`.

Finally, create the `proxy.ts` middleware file that handles session validation and route protection. This middleware checks for a valid Supabase session cookie on protected routes and redirects to login when no session exists. Test that the middleware correctly protects dashboard routes while allowing access to public pages.

### 4.2 Phase 2: Authentication Integration (Week 2)

The second phase integrates Supabase Auth into the existing application, replacing the localStorage-based authentication with cloud-based session management.

Begin by updating the AuthContext in `context/AuthContext.tsx` to use Supabase session management. This involves replacing localStorage reads and writes with Supabase auth state subscriptions, updating the login and registration methods to call Supabase auth functions, and maintaining the existing interface so consuming components don't require changes.

Modify the login and registration pages to use the updated AuthContext methods. Keep the existing form validation and error handling logic, but replace the data persistence with Supabase auth calls. Verify that users can register, login, and logout successfully with the new system.

Implement the user profile migration logic that detects existing localStorage user data on first login and migrates it to the Supabase database. This ensures backward compatibility for existing users while transitioning to the new architecture. Test the migration with a localStorage user to verify data transfers correctly.

Finally, verify that sessions persist across browser restarts and work on different devices by testing the login on multiple browsers or using browser devtools to simulate different environments. Confirm that the httpOnly cookies properly carry the session across requests.

### 4.3 Phase 3: Profile UI and Top Bar (Week 3)

The third phase adds the user interface elements for profile management and updates the navigation to include profile access.

Add the profile icon and dropdown menu to the top navigation bar. This includes creating a user avatar component that displays when logged in, a dropdown menu with links to profile settings and logout, and responsive styling that works on mobile devices. The component uses the AuthContext's user object to display user information.

Create a profile settings page (`app/profile/page.tsx`) that allows users to update their display name, email preferences, and other profile fields. This page reads from and writes to the `profiles` table through the profile API route. Include form validation and error handling matching the existing application patterns.

Add logout functionality that calls `supabase.auth.signOut()` and redirects to the landing page. Verify that logout clears the session and prevents access to protected routes.

### 4.4 Phase 4: Book Mobile Optimization and Progress (Week 4)

The fourth phase adds mobile optimization to the book reading experience and implements reading progress tracking.

Begin by adding the `reading_progress` table integration to the livro page components. Create the progress tracking module in `lib/reading-progress.ts` with functions to save progress, fetch progress, and subscribe to real-time updates. Integrate these functions into the chapter display components.

Apply mobile optimization through Tailwind CSS classes to improve readability on smaller screens. This includes adjusting font sizes, spacing, and layout for mobile viewports without changing the underlying content structure. Test on various mobile device sizes to ensure proper rendering.

Add progress indicators to the chapter list showing which chapters have been completed. Implement the scroll position tracking that saves progress when users navigate away from a chapter and restores position when returning. Verify that progress syncs across devices by testing on multiple browsers.

### 4.5 Phase 5: Data Migration and Cleanup (Week 5)

The final phase completes the migration, cleans up localStorage dependencies, and verifies the complete system.

Run comprehensive tests across all features to verify that authentication, profile management, book reading, and progress tracking work correctly. Test edge cases including session expiration, offline behavior, and data conflict resolution.

Remove localStorage code that is no longer needed after the migration, keeping only any localStorage usage for non-user-specific features like UI preferences. Update the codebase to remove references to the old localStorage keys (`bd_users`, `bd_workouts`, `bd_progress`).

Deploy the changes to the staging environment and conduct user acceptance testing with a small group of existing users. Monitor for any authentication issues, data sync problems, or performance concerns. After successful testing, deploy to production and monitor the auth system closely in the first few days.

---

## 5. Architecture Diagram

The following ASCII diagram illustrates the component relationships and data flow in the new architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Client                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │   Login      │    │   Dashboard  │    │     Livro    │     │
│  │   Page       │    │    Page      │    │    Page      │     │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘     │
│         │                   │                   │              │
│         └───────────────────┼───────────────────┘              │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │   AuthContext   │                          │
│                    │   (Supabase)    │                          │
│                    └────────┬────────┘                          │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTPOnly Cookies
                              │ (Session Token)
┌─────────────────────────────▼───────────────────────────────────┐
│                      Next.js Server                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     proxy.ts                              │  │
│  │              (Session Validation)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐              │
│         │                   │                   │              │
│  ┌──────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐         │
│  │  Profile    │    │   Workout   │    │   Reading   │         │
│  │  API Route  │    │  API Route  │    │  Progress   │         │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘         │
│         │                   │                   │              │
└─────────┼───────────────────┼───────────────────┼───────────────┘
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase Cloud                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   profiles   │  │   workouts   │  │reading_progress│        │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                                                    │
│  ┌──────▼──────────────────────────────────────────┐          │
│  │                 auth.users                      │          │
│  │            (Authentication)                     │          │
│  └─────────────────────────────────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Alternative Approaches Considered

### 6.1 Managed Auth Providers (Clerk, Auth0)

Clerk and Auth0 provide fully managed authentication with excellent Next.js integration. Clerk offers the smoothest Next.js integration with native Edge support and minimal configuration, making it a strong choice for teams prioritizing developer experience. The trade-off is per-user pricing at scale and vendor lock-in. For this project, Supabase was chosen because it provides both authentication and database in a single platform, reducing the number of external services required.

### 6.2 Self-Hosted Auth (Auth.js/Better Auth)

Better Auth provides a self-hosted alternative with database-backed sessions. This approach offers full control over the authentication infrastructure and avoids vendor lock-in. However, it requires more setup and maintenance than managed solutions. The Supabase approach was chosen because the database integration is already required for cross-device data sync, making Supabase Auth a natural fit that reduces infrastructure complexity.

### 6.3 Firebase Auth

Firebase Auth provides similar functionality to Supabase Auth with a mature ecosystem. However, Firebase's database (Firestore) has different query patterns than PostgreSQL (which Supabase provides), and the SQL capabilities of Supabase better match the existing application's data model. Supabase was chosen to maintain SQL consistency with the existing data patterns.

---

## 7. Security Considerations

### 7.1 Token Storage Security

The migration from localStorage to httpOnly cookies significantly improves security by preventing JavaScript access to authentication tokens. This protects against XSS attacks that could otherwise exfiltrate stored tokens. The Supabase auth session uses short-lived access tokens (default 1 hour) with automatic refresh, limiting the window of exposure if tokens are compromised.

### 7.2 Row Level Security

All database tables use Supabase's Row Level Security to enforce data isolation. The RLS policies use `auth.uid() = user_id` to ensure users can only access their own records. This provides defense-in-depth: even if a bug in the application allows unauthorized access at the API level, the database enforces proper isolation.

### 7.3 CSRF Protection

The httpOnly cookie approach naturally provides CSRF protection because browsers automatically include cookies with requests. However, the application should implement additional CSRF measures for state-changing operations, particularly for actions that aren't protected by Supabase's built-in mechanisms.

---

## 8. Open Questions for Phase-Specific Research

Several architectural decisions require deeper investigation during implementation:

The offline capability strategy needs clarification: the existing localStorage approach provides offline access to content, but the cloud-based architecture requires network connectivity. Should offline reading be supported, and if so, what sync strategy handles offline progress changes?

The subscription migration path needs definition: the current system likely includes subscription status in user data. How does the subscription state integrate with Supabase, and what happens if subscription status changes mid-session?

The initial data migration scope needs refinement: the migration strategy for existing localStorage data requires testing to ensure all data types migrate correctly. Should the migration be one-time or continuous (bidirectional sync during a transition period)?

---

## Sources

- Supabase Auth documentation (2026): Authentication patterns, session management, httpOnly cookies
- Next.js 16 proxy.ts documentation: Middleware migration from middleware.ts to proxy.ts
- Clerk migration guides: Best practices for migrating from local auth to cloud auth
- Supabase RLS documentation: Database security policies for multi-tenant data isolation
- Web search: "Next.js localStorage auth to cloud auth migration best practices 2026"