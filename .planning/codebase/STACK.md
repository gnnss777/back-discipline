# Technology Stack

**Analysis Date:** 2026-04-14

## Languages

**Primary:**
- **TypeScript** 5.x - Used throughout the application for type safety and modern React development. All source code in `src/` uses TypeScript.

**Secondary:**
- **JavaScript/JSX** - Legacy support via Next.js configuration. No direct `.js` files in source.

## Runtime

**Environment:**
- **Node.js** - Standard Next.js runtime. No explicit version in package.json, but compatible with Node 18+.

**Package Manager:**
- **npm** (via package-lock.json)
- Lockfile present: `package-lock.json` at root and `app/package-lock.json`

## Frameworks

**Core:**
- **Next.js** 16.2.3 - React framework with App Router. Handles routing, server-side rendering, and build process.
- **React** 19.2.4 - UI library. Used for all components.
- **React DOM** 19.2.4 - React rendering for DOM.

**Styling:**
- **Tailwind CSS** 4.x - Utility-first CSS framework.
- **@tailwindcss/postcss** - PostCSS integration for Tailwind 4.

**Build/Dev:**
- **Turbopack** - Used implicitly via Next.js dev server (default in Next.js 16).
- **PostCSS** - Configured via `postcss.config.mjs`.

## Key Dependencies

**Critical:**
- **next** 16.2.3 - Framework core, routing, SSR/SSG capabilities.
- **react** 19.2.4 - Component library.
- **lucide-react** ^1.8.0 - Icon library for UI components.

**Type Definitions:**
- **@types/node** ^20 - Node.js type definitions.
- **@types/react** ^19 - React type definitions.
- **@types/react-dom** ^19 - React DOM type definitions.

**Development/Tooling:**
- **typescript** ^5 - TypeScript compiler.
- **eslint** ^9 - Linting.
- **eslint-config-next** 16.2.3 - ESLint configuration for Next.js.
- **tailwindcss** ^4 - CSS framework.

## Configuration

**Environment:**
- No `.env` files detected in the codebase.
- Configuration is managed via `next.config.ts`.

**Build:**
- `next.config.ts` - Next.js configuration file (currently minimal).
- `postcss.config.mjs` - PostCSS configuration with Tailwind CSS plugin.
- `tsconfig.json` - TypeScript configuration.

**Key TypeScript settings in `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

**Key PostCSS settings in `postcss.config.mjs`:**
```javascript
{
  plugins: {
    "@tailwindcss/postcss": {}
  }
}
```

**Key ESLint settings in `app/eslint.config.mjs`:**
- Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- Global ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`.

## Platform Requirements

**Development:**
- Node.js 18+ recommended.
- npm or yarn for package management.

**Production:**
- Next.js can be deployed to various platforms (Vercel, Netlify, custom servers).
- Static export capability (via `next build`).

---

*Stack analysis: 2026-04-14*