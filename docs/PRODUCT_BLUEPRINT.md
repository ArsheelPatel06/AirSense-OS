# AirSense Product Blueprint

This document serves as the master single source of truth for the AirSense Frontend. 

**MANDATORY RULE:** No page may be implemented until its design specification, navigation flow, and user journey have been reviewed and approved.

---

## 1. AirSense Ecosystem

To ensure the system scales elegantly, the frontend is divided into three distinct categories forming a complete ecosystem.

```text
AirSense Ecosystem
│
├── Public Experience
│   ├── Landing Website
│   └── Citizen Portal
│
├── Shared Experience
│   ├── Authentication
│   ├── User Identity
│   ├── Notifications
│   ├── Search
│   ├── Profile
│   ├── Help Center
│   ├── Theme Engine
│   └── Command Palette (Future)
│
└── Enterprise Products
    ├── Administration
    ├── IoT
    ├── Operations
    ├── Government
    └── Maintenance
```

---

## 2. AirSense Design Principles

This is the design constitution of the AirSense frontend:

- **Action before information**: Every page should guide the user toward the next decision.
- **Context before detail**: Show the big picture before exposing technical depth.
- **Realtime where it matters**: Live updates only where operationally valuable.
- **Consistency over novelty**: Shared patterns across all products.
- **Progressive disclosure**: Don't overwhelm users with advanced options.
- **Maps are first-class citizens**: Spatial context is a core part of AirSense.
- **Accessibility is not optional**: Every interaction must support keyboard navigation and readable contrast.

---

## 3. Workspace Philosophy

Every Enterprise Product is built using a rigid hierarchical philosophy. Applications NEVER bypass the SDK.

`Product` ➔ `Workspaces` ➔ `Widgets` ➔ `Shared Services` ➔ `SDK`

*Example (Operations Platform):*
`Operations Platform` ➔ `Mission Control Workspace` ➔ `Live Map Widget` & `Alert Widget` ➔ `AirSense SDK`

---

## 4. Recommended Development Order

1. **Phase 1: Landing Website** (Reuse existing design, polish - DONE)
2. **Phase 1.5: Shared Experience Blueprint** (Define cross-platform routing, shared services, and design language - DONE)
3. **Phase 2A: Authentication Experience** (Design & UI only)
4. **Phase 2B: Authentication Logic** (API, Validation, Tokens, Redirects)
5. **Phase 3: Shared Application Shell** (Header, Sidebar, Navigation, Theme, Profile)
6. **Phase 4: Shared UI Components** (Cards, Tables, Charts, Forms, Dialogs)
7. **Phase 5: Administration (Minimal)** (Users, Roles, Permissions)
8. **Phase 6: IoT** (Clearest workflow. Establishes UI patterns)
9. **Phase 7: Operations** (Reuse widgets, maps, telemetry, alerts)
10. **Phase 8: Government** (Reuse everything)
11. **Phase 9: Maintenance**
12. **Phase 10: Citizen Portal**

---

## 5. Strict Implementation Sequence

**MANDATORY RULE:** Every single page or major feature MUST follow this exact sequence. Never jump straight to React components.

1. **Product Definition**
2. **User Journey**
3. **Navigation Flow**
4. **Information Architecture**
5. **Wireframe**
6. **Visual Design Reference**
7. **Design Specification**
8. **UI Implementation**
9. **Interaction Polish**
10. **API Integration**
11. **QA Review**
12. **Release**

---

## 6. Definition of Done

A page is **not complete** until all of the following are true:

- [ ] Design Specification approved.
- [ ] Navigation verified.
- [ ] User journey validated.
- [ ] Responsive layouts completed.
- [ ] Accessibility reviewed.
- [ ] Loading, empty, error, and success states implemented.
- [ ] Motion polished.
- [ ] Visual QA completed.
- [ ] Integrated with shared shell.
- [ ] Connected to services (when applicable).
- [ ] Product review passed.

---

## Page Design Specification Template (24-Point)

Before **ANY** page is implemented, a new Markdown specification MUST be created and approved covering these exactly 24 points:

1. **User Persona**: 
2. **Goal**: 
3. **Entry Points**: 
4. **Exit Points**: 
5. **Navigation**: 
6. **Information Hierarchy**: 
7. **Layout**: 
8. **Widgets**: 
9. **Cards**: 
10. **Tables**: 
11. **Charts**: 
12. **Maps**: 
13. **Primary Actions**: 
14. **Secondary Actions**: 
15. **AI Insights**: 
16. **Empty State**: 
17. **Loading State**: 
18. **Error State**: 
19. **Success State**: 
20. **Mobile Layout**: 
21. **Accessibility**: 
22. **Data Sources**: 
23. **Service Connections**: 
24. **Future Extensions**: 
