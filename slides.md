---
theme: ./theme
layout: cover
background: https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=80
class: text-center
highlighter: shiki
lineNumbers: false
transition: slide-left
title: Surviving D-Day — Offline-First React Native
mdc: true
---

# Surviving D-Day

### Offline-first ground operations in React Native

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-3 py-2 rounded-sm cursor-pointer border border-white/20 hover:bg-white/10">
    Antoine Rousseau — Engineering Manager @ Shotgun <carbon-arrow-right class="inline-block" />
  </span>
</div>

<!--
Speaker Notes:
- ReactCon Berlin. 30 minutes, then 10 for questions.
- Shotgun Backstage is the app organizers use on D-Day: scan tickets at the door, sell on site, see live event data.
- Constraint: a 5-second freeze at the gate spills the queue onto the street. Internet is optional.
- Today we follow one scan through the architecture — not a tour of the npm list.
-->

---
layout: two-cols-header
---

# The door cannot stop

::left::

### D-Day

- Basements, fields, packed clubs
- Cellular dies when 10k people arrive
- Staff are stressed and not looking at docs
- A freeze at the gate is a street problem

::right::

### What the architecture must do

- Scan in well under a second, offline
- Keep selling on a normal phone
- Sync nearby devices without a server
- Fail honestly — never invent a "valid" ticket

<!--
Speaker Notes:
- Paint the room: dark, loud, drunk attendees, bouncers with gloves.
- We do not optimize for pretty dashboards. We optimize for "is this person allowed in, right now."
- Honest failure matters as much as speed: still_loading is better than a false unknown or a false valid.
-->

---
layout: center
class: text-center
---

# Watch one scan

Press-and-hold → QR → result overlay

<div class="flex justify-center gap-2 pt-4">
  <Badge variant="positive">Valid</Badge>
  <Badge variant="warning">Already in</Badge>
  <Badge variant="informative">Still loading</Badge>
</div>

<!--
Speaker Notes:
- Play the recording (or live demo if the device is ready). 60–90 seconds max.
- Ask them to watch three things: you hold to open the camera (not always-on), the result is full-screen, there is no spinner waiting on the network.
- If you also show Tap to Pay, do it after the scan — selling is the second job, scanning is the talk.
- Then: "that overlay did not wait for our API."
-->

---

# The rule

**A scan never waits on the network.**

SQLite is the source of truth at the door.

The server is how we catch up — later.

<!--
Speaker Notes:
- This is the whole talk in one sentence.
- TanStack Query is the reactive layer on top of SQLite, not the cache of a REST call we make at scan time.
- If the ticket is not in the local DB yet, we say still_loading. We do not guess.
-->

---

# Shape of the system

Expo app, oRPC server, shared SQLite schema — one TypeScript repo.

```
shotgun/
├── apps/backstage/          # Expo / React Native
├── apps/backstage-server/   # oRPC API (Next.js)
└── packages/backstage/      # Zod, Drizzle, scan types
```

<v-clicks>

- Phone: Expo, `expo-router`, Uniwind, `expo-sqlite`
- Wire: oRPC + Zod, typed as `APIClient` from the server
- IDs created offline: ATProto TIDs (`TID.nextStr()`)

</v-clicks>

<!--
Speaker Notes:
- This sits inside a larger Shotgun monorepo. For Backstage, these three packages are the contract.
- Schema changes in packages/backstage break the app and the server at compile time.
- Skip the library laundry list. They will see the pieces as we walk the scan.
-->

---

# One QR, end to end

<v-clicks>

1. **Press-and-hold** opens `expo-camera` — not always-on (battery, accidents)
2. **SQLite JOIN** loads the ticket, deals, scan logs, transfers
3. **`decideScan()`** returns one of 12 outcomes
4. **Transaction** writes `syncActions` + `scanLogs`
5. **Overlay** immediately — staff already moved on
6. **Bridgefy** broadcasts the scan log to nearby phones
7. **Push** to the server every 5s, if we have a network

</v-clicks>

<!--
Speaker Notes:
- Spend time here. This is the architecture.
- Serial mutation scope { id: "scan" } so two rapid QR reads do not interleave.
- Mesh and server push are asynchronous. The bouncer does not wait.
- Next slides zoom into 3, 4, 6, and 7.
-->

---

# `decideScan()` is the product

```typescript
export type ScanDecision =
  | "still_loading" | "unknown"
  | "refunded" | "canceled" | "transferred" | "resold"
  | "wrong_time" | "wrong_access_list" | "several_access_lists"
  | "already_checked_in" | "verification_needed"
  | "checked_in";

if (ticket == null) {
  return loadedRatio < 1 ? "still_loading" : "unknown";
}
```

`loadedRatio` = local shotguns / server scannable count.

<!--
Speaker Notes:
- 12 decisions, not a boolean. Access lists, time windows, resales, verification warnings.
- still_loading: ticket not in SQLite yet, and we know the pull is incomplete. Staff wait. That is the correct UX.
- unknown: we believe we have the full dataset and this code is not in it.
- already_checked_in looks at local scanLogs — including logs that arrived over mesh from another gate.
- Force check-in is a permission, not a default.
-->

---

# Write locally first

```typescript
const syncAction = {
  uuid: generateTID(),
  eventId: payload.eventId,
  payload: payloadWithDefaults,
  broadcastedAt: null,
  syncedAt: null,
};

await db.transaction(async (tx) => {
  await upsert(client, schema.syncActions, [syncAction], { tx });
  await upsert(client, schema.scanLogs, [payloadWithDefaults], { tx });
});

void sendData({ type: "syncAction", syncAction });
```

The door is done. Sync is an outbox.

<!--
Speaker Notes:
- Outbox pattern: the scan is committed on device before anyone else knows.
- syncedAt null means "not on the server yet." A 5-second interval pushes pending rows.
- broadcastedAt tracks mesh. Failure to broadcast does not roll back the scan.
- TID gives us sortable, unique IDs with no server round-trip.
-->

---
layout: two-cols-header
---

# Catching up with the server

::left::

### Pull — 18 entity streams

- Keyset cursor: `(updatedAt, id)`
- Batches of 2,000 (server max 5,000)
- **10s** steady, **1s** while the batch is full
- First launch: cursor `null`, full dataset

::right::

### Why not `Date`?

```typescript
sql`(${updatedAt}, ${id})
  > (${cursor.updatedAt}, ${cursor.id})`

// JS Date drops microseconds
to_char(..., 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')
```

Miss a row, or pull it twice.

<!--
Speaker Notes:
- Split routers, not one giant sync blob. Legacy lastUpdatedAt endpoint still exists; current clients do not use it.
- Microsecond timestamps as strings: Postgres is finer than JS Date. Without this, keyset pagination skips or duplicates under load.
- Push is separate: syncActions.push, every 5s, only if pending rows exist.
- Invalid payloads are dropped per-item on the server — the rest of the batch still applies.
-->

---
layout: two-cols-header
---

# Nearby gates: Bridgefy mesh

::left::

### What it actually does

- Broadcasts **scan logs**, not the whole DB
- Peer upserts `scanLogs` + `syncActions`
- Same UUID → ignore
- Peers keep `syncedAt: null` and **can push too** — server dedupes on UUID

::right::

### The race we still have

Two gates, both offline, same ticket, same second.

Mesh has not arrived yet.

Both see `checked_in`.

Server later keeps both UUIDs as scans — we do not invent a distributed lock.

<!--
Speaker Notes:
- Be honest. This is the question you will get.
- Mesh shrinks the window. It does not close it. Bluetooth range, permissions, HYBRID mode, no rebroadcast of received actions.
- The handler comment "only the original device can push" is stale: we broadcast immediately with syncedAt null, so any online peer's 5s outbox flush will call syncActions.push. Server skips if that UUID already exists.
- That's useful: if the scanning phone never reconnects, a neighbor can still deliver the scan.
- Local decideScan uses scanLogs: once the mesh packet arrives, the next scan at gate B is already_checked_in.
- We accept a small double-scan window over blocking the door. Say that sentence.
- Android needs Bluetooth + location permissions. Simulator is a no-op.
-->

---

# Types across the wire

Scan is local. Everything else is a typed oRPC client — not REST, not GraphQL.

```typescript
import type { APIClient } from "backstage-server/client";

export function createAPIClient(headers?: Headers): APIClient {
  const link = new RPCLink({
    url: env.SERVER_URL,
    headers, // Bearer JWT, x-app-version
    interceptors: [onError(/* network | outdated */)],
  });
  return createORPCClient(link);
}
```

Same router type on phone and server. Old binaries get `406` → `/outdated-version`.

<!--
Speaker Notes:
- oRPC because we wanted end-to-end TypeScript without maintaining an OpenAPI client.
- GraphQL in this app is only Expo's API, for listing EAS channels.
- x-app-version: we force upgrades before D-Day rather than debug three app versions in a basement.
-->

---
layout: two-cols-header
---

# A phone is the terminal

::left::

### Stripe Tap to Pay

- `@stripe/stripe-terminal-react-native`
- `easyConnect({ discoveryMethod: "tapToPay" })`
- Also cash, card, Pix — **permission-gated**
- Retry on session expiry mid-event

::right::

### Native only when the OS has the UI

```swift
Name("IosTapToPay")

AsyncFunction("educate") { () async throws in
  guard #available(iOS 18.0, *) else { throw ... }
  let discovery = ProximityReaderDiscovery()
  let content = try await discovery.content(
    for: .payment(.howToTap)
  )
  try await discovery.presentContent(content, from: vc)
}
```

<!--
Speaker Notes:
- Stripe Terminal does the payment. The Expo module only presents Apple's "how to tap" education sheet.
- Module name is IosTapToPay, not a generic BackstageModule.
- No dedicated POS hardware. Organizers already have iPhones and Pixels.
- We do not print thermal tickets from the app today — PDF / email / on-screen QR. Don't imply printers if asked; that's the honest answer.
-->

---
layout: two-cols-header
---

# Who can do what

Roles are a default. Events override.

::left::

### Permissions, not just admin/editor

- `scan` / `force_check_in`
- `sell_taptopay` / `sell_cash` / `sell_pix`
- `refund_all` / `refund_onsite`
- `display_scan_module` / `display_pos_module`

::right::

### Enforced twice

- Server: `permissionMiddleware` on oRPC
- Client: hide the module, still fail closed on the API
- Cached locally in `eventPermissions` for offline UI

<!--
Speaker Notes:
- A bartender should sell cash and not refund last night's online sales.
- A door person may only scan, and may not force check-in.
- Cohosts inherit a subset. Per-event overrides live in eventMemberPermissionOverrides.
- Offline: we still gate the UI from the last synced permission set. Writes go through the outbox and the server will reject them if the token is not allowed.
-->

---

# Channel surfing

QA on a physical phone, no native rebuild.

```typescript
setUpdateRequestHeadersOverride({
  "expo-channel-name": channel,
});

if ((await checkForUpdateAsync()).isAvailable) {
  await fetchUpdateAsync();
}
await reloadAsync();
```

Every PR publishes an EAS Update. Preview builds pick the channel in a debug screen.

<!--
Speaker Notes:
- Runtime version follows appVersion. JS-only PRs are OTA; native changes still need a binary.
- Preview environment only — production staff do not see this menu.
- This is how we test scan + Tap to Pay on real hardware the week of the event without a TestFlight per PR.
- If time is short, this is the slide to skip. The scan path is not.
-->

---
layout: center
class: text-center
---

# Takeaways

<div class="text-left inline-block">

1. **Treat the network as optional.** Scan against SQLite. Sync is an outbox.
2. **Name the race.** Mesh shrinks double-scans. It does not give you a lock.
3. **Fail honestly.** `still_loading` beats a wrong valid.
4. **Share types, not URLs.** Monorepo + oRPC + Zod.
5. **Go native only for OS UI.** Stripe + `ProximityReaderDiscovery`, not a custom radio stack.

</div>

<!--
Speaker Notes:
- Leave this up. Walk the five lines slowly.
- Invite questions on: the remaining double-scan window, Bridgefy battery, Expo modules, permissions.
-->

---
layout: end
class: text-center
---

# Thank you

### Questions

**Antoine Rousseau**
Engineering Manager @ Shotgun

[github.com/shotgun-warehouse/shotgun](https://github.com/shotgun-warehouse/shotgun)

<!--
Speaker Notes:
- 10 minutes Q&A.
- Likely questions:
  - Double-scan: UUID idempotency + local scanLogs. Window exists before mesh/server. We chose door speed.
  - Battery: press-and-hold camera, keep-awake only while scanning, Bridgefy HYBRID is the expensive part.
  - Conflict UI: none. Staff see already_checked_in from local logs.
  - Printing: not in the app. Share PDF / email / QR.
  - Testing: Vitest on decideScan and oRPC; Maestro covers login/sell/ticketing, not camera scan (yet).
-->
