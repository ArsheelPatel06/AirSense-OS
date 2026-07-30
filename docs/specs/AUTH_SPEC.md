# Authentication Specification (Phase 2A)

## 1. Authentication Philosophy
Authentication is the front door to the AirSense ecosystem. It must feel light, calm, and incredibly premium. It establishes trust immediately. It borrows from the "Minimal Light" theme (similar to Notion or Linear) utilizing ample whitespace, crisp typography, and fluid, non-blocking interactions. 

## 2. User Journey
The experience must feel like a single continuous flow rather than disjointed screens.
`Welcome` ➔ `Login` ➔ `Forgot Password (Optional)` ➔ `Reset Password (Optional)` ➔ `Email Verification` ➔ `Two-Factor` ➔ `Success` ➔ `Role Resolution` ➔ `Platform Resolution` ➔ `Dashboard`

## 3. Information Architecture
- The core focus is strictly on the authentication form.
- Secondary elements (Help, Contact, Status) are minimized and pushed to the periphery (e.g., footer links).
- Brand presence is strong but elegant (simple logo, subtle environmental illustration).

## 4. Screen Inventory
1. Welcome
2. Login
3. Register
4. Forgot Password
5. Reset Password
6. Verify Email
7. Two-Factor Authentication
8. Accept Invitation
9. Session Expired
10. Unauthorized
11. Magic Link / SSO (Future Placeholder)

## 5. Navigation Flow
There is no global navigation header.
- Users can toggle between Login and Register.
- Users can navigate to Forgot Password from Login.
- Users can return to Login from any recovery/verification state.
- Post-login naturally routes the user to the Shared App Shell.

## 6. Desktop Experience
- Split layout: 
  - **Left/Center**: Clean, white card floating on a subtle gradient or minimal off-white background.
  - **Right (Optional)**: A very subtle, high-quality environmental graphic or abstract representation of air quality (glassmorphism/mesh gradient).
- Extremely focused. The form takes center stage.

## 7. Tablet Experience
- Centers the authentication card.
- Removes or severely reduces the abstract graphic to prioritize the form.
- Maintains generous padding.

## 8. Mobile Experience
- Full-screen form.
- Bottom-aligned actions for easy thumb reach.
- Native keyboard optimization (email/number pads).

## 9. Form Behavior
- **Autofocus**: First input is focused on load.
- **Tab Index**: Strict, logical tab ordering.
- **Enter Key**: Submits the current form.
- **Inputs**: Float labels or clean outside labels. High contrast when active.

## 10. Validation Strategy
- **Inline, Real-time**: Validation occurs on blur (not on every keystroke, which is annoying).
- **Clear Rules**: Password requirements check off visually as the user types.

## 11. Error Messaging
- **Tone**: Helpful, calm, non-accusatory. (e.g., "We couldn't find an account with that email." instead of "INVALID EMAIL").
- **Visuals**: Soft red outlines, subtle shake animation on failed submit.

## 12. Loading States
- **Submit Buttons**: Turn into inline spinners. Never disable and gray-out without a loading indicator.
- **Transitions**: The card height animates smoothly if the content changes (e.g., switching from Login to 2FA).

## 13. Success States
- **Visuals**: A soft green checkmark or subtle success message.
- **Motion**: A smooth, slight delay (300ms) before redirecting to allow the user to register the success.

## 14. Motion Guidelines
- **Card mounting**: Slight slide up and fade in (`y: 20`, `opacity: 0` ➔ `y: 0`, `opacity: 1`).
- **Page transitions**: Cross-fade between states (Login ➔ 2FA).
- **Duration**: Fast (200-300ms). No slow, dragging animations.

## 15. Accessibility
- 100% keyboard navigable.
- ARIA labels on all inputs and icon buttons.
- Minimum WCAG AA contrast ratio for all text.
- `aria-invalid` and `aria-describedby` for error states.

## 16. Theme Rules
- Inherits `Minimal Light`.
- Background: `#FAF9F6` or pure white.
- Text: `#111827` for primary headings, `#6B7280` for secondary.
- Primary Button: Solid dark/black or vibrant primary green depending on final brand accent, but kept extremely minimal.

## 17. Component Inventory
- Auth Card Wrapper
- Floating Label Input
- Password Input (with visibility toggle)
- Primary Submit Button (with loading state)
- Secondary Text Link
- Social Login Button (Google/Microsoft placeholders)
- OTP Input Group (for 2FA)

## 18. API Requirements (Stage B)
- `/api/v1/auth/login`
- `/api/v1/auth/register`
- `/api/v1/auth/verify`
- `/api/v1/auth/reset-password`
- JWT token storage (HttpOnly cookie or secure local storage).
- Role resolution endpoint.

## 19. Future Extensions
- Enterprise SSO (SAML/Okta) button placeholders.
- Organization Selector (if a user belongs to multiple organizations, they choose one after 2FA but before the dashboard).

## 20. Acceptance Criteria
- Matches definition of done from the Product Blueprint.
- Flawless transition between Login and 2FA.
- Perfect layout across Mobile, Tablet, and Desktop.
- 0 accessibility violations in Lighthouse.
