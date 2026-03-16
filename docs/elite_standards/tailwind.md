# Tailwind CSS Elite Standards (v1.0) - Hooke Store

## 1. Design Tokens
- **Rule**: Use tokens defined in `tailwind.config.ts`.
- **Rule**: Avoid arbitrary values (e.g., `text-[13px]`) unless specifically required for pixel-perfect pixel-art or legacy overlays.
- **Rule**: Prefer semantic color names (e.g., `text-hooke-900`) over generic ones.

## 2. Organization
- **Rule**: Group utility classes by category: Layout -> Spacing -> Typography -> Visual -> State/Hover.
- **Rule**: Use the `cn()` utility (clsx + tailwind-merge) for dynamic class concatenation to prevent class collisions.

## 3. Aesthetics
- **Rule**: Maintain the premium, minimalist aesthetic (Black/White/Gray scales).
- **Rule**: Use subtle animations and transitions for all interactive elements.
