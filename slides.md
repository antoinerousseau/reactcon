---
theme: default
background: https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=80
class: text-center
highlighter: shiki
lineNumbers: false
transition: slide-left
title: Surviving D-Day - Offline-First React Native
mdc: true
---

# Surviving D-Day

### Building a Fast, Offline-First, Hardware-Integrated React Native App

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer hover:bg-white hover:bg-opacity-10">
    Antoine Rousseau — Engineering Manager @ Shotgun <CarbonArrowRight class="inline"/>
  </span>
</div>

<!--
Speaker Notes:
- Welcome everyone to ReactCon Berlin!
- Today we're talking about real-world mobile engineering when failure is not an option.
- How we built "Shotgun Backstage" to power ground operations at live events on D-Day.
-->

---
layout: two-cols-header
---

# The Ground Operations Reality

::left::

### The Event D-Day Environment
* **Extreme environments**: Basements, open fields, packed venues.
* **Network instability**: Cellular networks fail when 10,000 attendees arrive.
* **Stressed staff**: Bouncers and bartenders need instant app response.
* **Zero downtime permitted**: Entrance queues cannot halt.

::right::

### Non-Negotiable Pillars

* ⚡ **Speed**: Sub-second ticket scanning and fast POS checkout.
* 🛡️ **Reliability**: Zero crashes with strict observability via Sentry.
* 🔌 **Offline-First**: Uninterrupted functionality without network connectivity.
* 🔒 **Security**: Granular role-based permissions.

<!--
Speaker Notes:
- Paint the picture: Noise, dark venues, bad connectivity, drunk attendees, stressed staff.
- If the app lags or crashes for 5 seconds, queue lines spill onto the street.
- We had to design an architecture that treats internet connectivity as a luxury, not a dependency.
-->

---
layout: default
---

# High-Level Monorepo Architecture

Unified TypeScript repository running on **Expo** and **EAS**.

```
shotgun/
├── apps/
│   ├── backstage/         # React Native (Expo) Mobile App
│   └── backstage-server/  # Backend API Services
└── packages/
    └── backstage/         # Shared Logic, Contracts & Types
```

<v-clicks>

* 🚀 **Expo & EAS**: Built with Expo EAS for reproducible builds and Over-The-Air (OTA) updates.
* 🔗 **Type-Safe API**: Integrated **oRPC** with **Zod** schema validation for end-to-end type coverage.
* 🎨 **Fast UI**: Built with **Uniwind Pro** for rapid Tailwind-style styling on native platforms.
* 🏎️ **Navigation & Forms**: Driven by `expo-router` and `react-hook-form`.

</v-clicks>

<!--
Speaker Notes:
- Keeping app, server, and shared package in one repo allowed full visibility across teams.
- End-to-end TypeScript ensures schema changes on the API break app builds at compile time rather than runtime.
-->

---

# Type-Safe Communication: oRPC & Zod

Eliminating API runtime mismatches between server and venue hardware.

```typescript
// packages/backstage/src/schemas/ticket.ts
import { z } from 'zod';

export const ScanTicketSchema = z.object({
  ticketId: z.string(),
  scannedAt: z.string().datetime(),
  gateId: z.string(),
});

// apps/backstage/src/api/client.ts
import { createORPCClient } from '@orpc/client';
import type { Router } from '../../../backstage-server/src/router';

export const api = createORPCClient<Router>({ ... });

// Usage inside app component with autocomplete & full validation
const result = await api.tickets.scan(ScanTicketSchema.parse(payload));
```

<!--
Speaker Notes:
- We chose oRPC over standard REST or GraphQL for lightweight, end-to-end type safety.
- Zod guarantees input and output contracts match before writing to the local store or hitting the wire.
-->

---

# Offline-First Storage Engine

How we query tens of thousands of tickets locally on consumer devices.

```
┌────────────────────────────────────────────────────────┐
│                   React Native App                     │
├───────────────────────────┬────────────────────────────┤
│   TanStack Query (Cache)  │    Local UI State / Hooks  │
└──────────────┬────────────┴──────────────▲─────────────┘
               │                           │
               ▼                           │
┌──────────────────────────────────────────┴─────────────┐
│                 SQLite Local Database                  │
└────────────────────────────────────────────────────────┘
```

<v-clicks>

* 💾 **SQLite Engine**: Powered by Expo SQLite for persistent, high-speed local queries.
* 🔄 **TanStack Query**: Handles memory caching, UI re-renders, and query invalidation.
* ⏱️ **ATProto TID**: Generated sortable, short UUIDs via `@atproto/tid` for chronologically ordered offline entries.

</v-clicks>

<!--
Speaker Notes:
- We do not read from remote servers during scan operations.
- All reads execute against local SQLite. TanStack Query sits on top to provide reactive UI updates.
- Sortable TIDs allow us to maintain order across items created offline on different devices.
-->

---

# Multi-Device Sync: Polling & Mesh Network

Preventing double-scans when internet connectivity drops completely.

```
         [ Remote Server ]
                 ▲
       Entity Cursor Polling
                 │
┌────────────────┴────────────────┐
│   Device A (Gate 1)             │
│   Scan Ticket #104              │
└────────────────┬────────────────┘
                 │
   P2P Bluetooth Mesh (Bridgefy)
                 │
┌────────────────▼────────────────┐
│   Device B (Gate 2)             │
│   Mark Ticket #104 Scanned      │
└─────────────────────────────────┘
```

* 🔄 **Online Sync**: Delta polling using `last_updated_at` entity cursors.
* 📡 **Offline Mesh**: Broadcasts scan events via **Bridgefy** Bluetooth P2P mesh network across nearby phones.

<!--
Speaker Notes:
- When online, cursor-based polling pulls down delta updates using timestamp cursors.
- When offline, Bridgefy broadcasts scan events across Bluetooth mesh, updating nearby devices directly without server roundtrips.
-->

---

# POS & Hardware Integration

Turning consumer iPhones and Android devices into venue terminals.

<div class="grid grid-cols-2 gap-4">

<div>

### 💳 Tap to Pay
* Integrated **Stripe Tap to Pay** using `@stripe/stripe-terminal-react-native`.
* Eliminates dedicated POS hardware rentals for event organizers.

</div>

<div>

### 🖨️ Thermal Printing
* Integrated `expo-print` for printing physical receipts and ticket passes on-site.
* Simple integration with standard Bluetooth/network event printers.

</div>

</div>

<v-click>

### 📸 Fast Camera Scanning
* Selected `expo-camera` over `vision-camera` for reduced complexity and sufficient scan performance.

</v-click>

<!--
Speaker Notes:
- Tap to Pay lets any iPhone or Android phone accept contactless payment directly on the device.
- Standardized libraries like expo-camera provided optimal performance without heavy custom native builds.
-->

---

# Native Extensions: Custom Expo Modules

Writing Swift code when native UI components are required.

```swift
// ios/BackstageModule.swift
import ExpoModulesCore
import ProximityReader

public class BackstageModule: Module {
  public func definition() -> ModuleDefinition {
    Name("BackstageNative")

    AsyncFunction("showTapToPayEducation") { () in
      if #available(iOS 15.4, *) {
        // Trigger Apple native payment onboarding modal
        try await ProximityReaderDiscovery.Topic.payment(.howToTap)
      }
    }
  }
}
```

* Clean Swift abstraction wrapped inside an **Expo Module**.
* Invokes Apple's native `ProximityReaderDiscovery` onboarding experience seamlessly.

<!--
Speaker Notes:
- When you need true native features, Expo Modules allow you to write Swift or Kotlin directly.
- Here we trigger Apple's built-in educational modal for Tap to Pay with minimal bridge overhead.
-->

---

# UX Details & Sensory Feedback

Building an intuitive UI for loud, dark, high-pressure environments.

* 📳 **Haptics & Audio**: Custom vibration patterns and audio cues provide instant pass/fail signals to bouncers without looking at the screen.
* 🌙 **High-Contrast UI**: Designed using **Uniwind Pro** with heavy contrast for low-light environments.
* ⚡ **Micro-Interactions**: Blur effects, fast gesture handlers, and smooth SVG rendering for instant tactile responsiveness.

<!--
Speaker Notes:
- In a club with flashing lights and loud music, sight isn't enough.
- Haptics and loud audio cues tell staff instantly if a ticket is valid or duplicated without reading text.
-->

---

# Quality Assurance & Testing Pipeline

Ensuring absolute stability before D-Day.

<div class="grid grid-cols-2 gap-4">

<div>

### Backend Unit & API Testing
* Powered by **Vitest** for fast unit tests and endpoint integration checks.

</div>

<div>

### End-to-End Mobile Testing
* Powered by **Maestro**.
* Declarative YAML test scripts running on actual mobile devices.

</div>

</div>

```yaml
# .maestro/scan_ticket.yaml
appId: com.shotgun.backstage
---
- launchApp
- tapOn: "Scan Mode"
- assertVisible: "Ready to scan"
- cameraInject: "valid_ticket_qr.png"
- assertVisible: "Ticket Validated"
```

<!--
Speaker Notes:
- Vitest handles API logic, while Maestro handles E2E mobile flows via readable YAML.
- Maestro executes simulated camera injections and UI interactions without flaky Detox drivers.
-->

---

# Developer Experience: "Channel Surfing"

Rapid QA and branch testing on physical hardware using `expo-updates`.

```
   PR Created ➔ EAS Workflow Triggers ➔ EAS OTA Update Published
                                              │
                                              ▼
                        ┌───────────────────────────────────────────┐
                        │   In-App Developer Debug Screen           │
                        ├───────────────────────────────────────────┤
                        │  Select Branch:                           │
                        │  [ feature/tap-to-pay-fix      ▼ ]        │
                        │  [ Download & Restart Bundle   ]          │
                        └───────────────────────────────────────────┘
```

* **Automated Preview Builds**: Every PR generates an isolated EAS Update bundle automatically.
* **Branch Switching**: QA teams switch branches on physical phones directly inside the debug screen without recompiling.

<!--
Speaker Notes:
- Recompiling native binaries for every PR review slows down QA.
- We built a custom debug menu using expo-updates that lets testers select and stream JS bundles from any active git branch instantly.
-->

---
layout: center
class: text-center
---

# Key Takeaways

<div class="text-left inline-block">

1. **Design Local-First**: Treat internet access as an optional optimization.
2. **Leverage Native Hardware**: Tap to Pay and Bluetooth Mesh transform off-the-shelf mobile phones into enterprise terminals.
3. **Typesafety across Boundaries**: Monorepo + oRPC + Zod eliminates runtime contract bugs.
4. **Invest in DX**: In-app OTA branch switching accelerates QA cycles.

</div>

---
layout: center
class: text-center
---

# Thank You!

### Questions & Discussion

**Antoine Rousseau**
Engineering Manager @ Shotgun

🔗 [github.com/shotgun-warehouse/shotgun](https://github.com/shotgun-warehouse/shotgun)

<!--
Speaker Notes:
- Open the floor for the 10-minute Q&A session.
- Keep answers focused on conflict resolution, battery management, and custom Expo module details if asked.
-->