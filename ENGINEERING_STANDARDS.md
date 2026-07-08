# AirSense OS - Engineering Standards

This document establishes the mandatory engineering standards for all modules within AirSense OS. Strict adherence is required to maintain a Palantir-tier, production-ready codebase.

---

## 1. Naming Conventions

### File & Folder Naming
- **Directories:** `kebab-case` (e.g., `incident-management`, `auth`, `ui`).
- **Components:** `PascalCase` (e.g., `DeviceTable.tsx`, `GlobalHeader.tsx`).
- **Hooks:** `camelCase` starting with `use` (e.g., `useWebSockets.ts`, `useAuth.ts`).
- **Utilities/Services:** `camelCase` (e.g., `dateFormatter.ts`, `apiClient.ts`).
- **Types/Interfaces:** `PascalCase`. Do **not** prefix with `I` (e.g., `DeviceData`, not `IDeviceData`).

### Redux & State Management
- **Slices:** `camelCase` suffixed with `Slice` (e.g., `themeSlice.ts`, `authSlice.ts`).
- **Actions/Reducers:** `camelCase` (e.g., `setTheme`, `loginSuccess`).
- **State Interfaces:** `PascalCase` (e.g., `ThemeState`).

### RTK Query & API
- **API Slices:** `camelCase` suffixed with `Api` (e.g., `devicesApi.ts`, `weatherApi.ts`).
- **Endpoints:** `camelCase` describing the action (e.g., `getIncidents`, `updateDeviceStatus`).
- **Generated Hooks:** Will inherently be `use[EndpointName][Query/Mutation]` (e.g., `useGetIncidentsQuery`).
- **Payload/Response Types:** `PascalCase` suffixed with `Request` or `Response` (e.g., `IncidentResponse`, `UpdateDeviceRequest`).

### CSS & Styling
- Avoid custom CSS files. If required for global scoping in `index.css`, use `kebab-case`.

---

## 2. Tailwind Usage Rules
- **No Arbitrary Values:** Arbitrary values (e.g., `w-[17px]`, `text-[13px]`) are strictly forbidden. You must use the design system tokens (e.g., `w-4`, `text-sm`).
- **Dynamic Classes:** You must use the `cn()` utility (`clsx` + `tailwind-merge`) when conditionally applying Tailwind classes to prevent CSS specificity collisions.
- **Component Variants:** Use `class-variance-authority` (cva) to manage component states (primary, secondary, destructive) rather than complex ternary operators.

---

## 3. Accessibility (a11y) Rules
- **Keyboard Navigation:** Every interactive element must be accessible via the `Tab` key and actionable via `Enter`/`Space`.
- **Aria Labels:** Icon-only buttons must contain a visually hidden `<span>` or an `aria-label` describing the action.
- **Color Contrast:** All text must meet WCAG 2.1 AA standards against its background.
- **Complex UI:** Modals, Selects, and Dropdowns must use the `radix-ui` headless primitives to guarantee focus-trapping and screen-reader state announcements.

---

## 4. Performance Rules
- **Memoization:** Use `useMemo` for expensive synchronous calculations (e.g., filtering large GIS datasets). Use `useCallback` for functions passed as props to heavily re-rendered child components.
- **State Colocation:** Keep React state as close to where it is used as possible. Do not put UI toggle states in Redux.
- **Server State:** Do not store server responses in Redux slices. All server state must be managed by RTK Query cache.
- **Imports:** Never use barrel exports/imports (e.g., `import { X } from '@/shared'`) if it causes circular dependencies or bloats chunk sizes.

---

## 5. Documentation Standards
- **JSDoc:** Mandatory for all exported shared utilities, complex hooks, and RTK Query endpoints.
- **Prop Types:** All React components must have an explicitly defined `interface [ComponentName]Props`.
- **Inline Comments:** Explain *why* a piece of logic exists, not *what* it does. The code explains the *what*.

---

## 6. Commit Standards
- **Conventional Commits:** Enforced via Husky. Commits must follow the format: `<type>(<scope>): <description>`.
- **Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`, `build`.
- **Example:** `feat(domains): add websocket hook for live incidents`

---

## 7. Review Checklist
Before any module is considered complete, it must pass this checklist:
> [!IMPORTANT]
> 1. Does the code violate FSD/DDD? (e.g., UI component importing directly from another UI component's local folder instead of shared?)
> 2. Are there any `any` types or `@ts-ignore` flags? (Forbidden without explicit tech lead approval).
> 3. Do all `useEffect` blocks have exhaustive and correct dependency arrays?
> 4. Are there any arbitrary Tailwind values?
> 5. Is the component keyboard navigable?
> 6. Does the build command (`npm run build`) pass without warnings?
