# Next.js Elite Standards (v1.0) - Hooke Store

## 1. Image Optimization
- **Rule**: ALWAYS use `next/image` with proper `width`, `height`, and `alt` text.
- **Rule**: Use `priority` for Hero images above the fold.
- **Rule**: Avoid `img` tags entirely to leverage Vercel's automatic image optimization and prevent Cumulative Layout Shift (CLS).

## 2. Component Architecture
- **Rule**: Default to React Server Components (RSC) for data fetching and heavy logic.
- **Rule**: Use `'use client'` ONLY when interactivity (hooks, event listeners) is required.
- **Rule**: Keep client components at the leaves of the component tree whenever possible.

## 3. Performance & Strategy
- **Rule**: Use `next/script` with appropriate strategies (`afterInteractive`, `lazyOnload`).
- **Rule**: Implement `loading.tsx` skeletons for all dynamic routes.
- **Rule**: Leverage Next.js caching (Request Memoization, Data Cache, Full Route Cache).

## 4. Linting
- **Rule**: Build MUST fail on any ESLint warnings or errors.
- **Rule**: No unused variables, imports, or parameters.
