# TypeScript Elite Standards (v1.0) - Hooke Store

## 1. Strict Typing
- **Rule**: `any` is strictly prohibited. Use `unknown` or specific interfaces.
- **Rule**: Enable and follow `strict: true` in `tsconfig.json`.
- **Rule**: Use `interface` for public APIs and `type` for unions/aliases.

## 2. Safety
- **Rule**: Handle all potential `null` or `undefined` states using optional chaining (`?.`) or nullish coalescing (`??`).
- **Rule**: No casting with `as` unless absolutely necessary (e.g., when interfacing with legacy libraries). Prefer type guards.

## 3. Clean Code
- **Rule**: No unused locals or parameters (`noUnusedLocals`, `noUnusedParameters`).
- **Rule**: Standardize naming: interfaces start with `I` (Optional, per team preference) or PascalCase.
- **Rule**: Enums should be used for fixed sets of values; otherwise, use Tagged Unions.
