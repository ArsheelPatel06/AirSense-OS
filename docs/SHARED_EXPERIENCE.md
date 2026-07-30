# Shared Experience Blueprint

This document defines the overarching structural and experiential rules that apply across the entire AirSense ecosystem. It ensures that when a user logs in, they experience a unified product rather than a fragmented collection of dashboards.

## 1. Global Navigation Architecture

The global flow defines how users enter and traverse the ecosystem:

`Landing` ➔ `Authentication` ➔ `Platform Selection (if applicable)` ➔ `Platform Dashboard`

## 2. Platform Switching

Users with access to multiple platforms (e.g., System Administrators) must be able to switch contexts without logging out. The platform switcher lives in the **Shared Header**, NOT the sidebar.

`Administrator` ➔ `Operations` ➔ `Switch Platform (Header)` ➔ `Government` ➔ `Switch Platform (Header)` ➔ `IoT`

## 3. User Types & Platform Access Matrix

| User Role | Operations | Government | IoT | Maintenance | Admin | Citizen |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **System Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Operations Eng.**| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **IoT Engineer** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Gov. Official** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Maintenance** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Citizen** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## 4. Authentication Flow

The standard path for an authenticated user:

`Landing` ➔ `Login` ➔ `Authenticate` ➔ `Role Resolution` ➔ `Platform Resolution` ➔ `Workspace Restore` ➔ `Dashboard`

## 5. Frozen Enterprise Shell

Every Enterprise Platform MUST reuse this exact application shell layout. Only colors, navigation items, and branding accents change.

```text
┌──────────────────────────────────────────────────────────┐
│ Logo │ Platform │ Search │ Notifications │ Profile │ Help│
├──────────────┬───────────────────────────────────────────┤
│ Sidebar      │                                           │
│              │                                           │
│              │ Workspace                                 │
│              │                                           │
│              │ Widgets                                   │
│              │                                           │
├──────────────┴───────────────────────────────────────────┤
│ System Status │ Version │ Environment │ Connection       │
└──────────────────────────────────────────────────────────┘
```

## 6. Shared Sidebar Rules

- **Width**: Fixed standard width (e.g., 260px), collapses to icons only (e.g., 64px).
- **Collapse Behavior**: Hover to peek, click to lock.
- **Animations**: Fast, smooth easing.
- **Icons**: Standard stroke weight, uniform styling.

## 7. Notification System

A single, global Notification Center. 
- Used across all platforms.
- Categorized by Severity (Critical, Warning, Info).
- Supports actions (e.g., "Acknowledge", "View Incident").

## 8. Shared Profile

A unified profile schema across the ecosystem containing:
- Avatar, Name, Organization, Role
- Preferences, Theme override, Language
- Logout action

## 9. Theme System

Themes are defined at the platform level to establish context immediately upon entry:

- **Landing**: Eco Light (Greens, Whites, Natural)
- **Authentication**: Minimal Light (Clean, Premium, Linear/Notion style)
- **Operations**: Mission Dark (High contrast, Dark Blue/Gray, critical alerts pop)
- **Government**: Executive Light (Professional, clean data viz, Whites/Blues)
- **IoT**: Technical Light (Utilitarian, Monospace fonts, dense data)
- **Maintenance**: Industrial Light (High visibility accents, rugged UI)
- **Administration**: Slate Light (Neutral, settings-focused)
- **Citizen**: Mobile Light (App-like, friendly, accessible)

## 10. Design Language

To maintain the visual contract, all platforms adhere to standard tokens for:
- **Border radius**: Standardized tokens (no arbitrary pixel values).
- **Shadows**: Soft, multi-layered ambient shadows.
- **Motion**: Snap-to-place, 200-300ms ease-out transitions.
- **Spacing**: Strict 4/8/16/24/32px grid.
- **Typography**: Inter (or designated sans-serif), strict scale.
- **Components**: Standardized Buttons, Inputs, Cards, and Dialogs.
