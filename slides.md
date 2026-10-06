---
theme: ./theme
canvasWidth: 1920
layout: cover
highlighter: shiki
lineNumbers: false
transition: slide-left
title: Surviving D-Day with Shotgun Backstage
mdc: true
---

# Surviving D-Day

## Shotgun Backstage: a React Native app for ground operations

Antoine Rousseau — Engineering Manager @ Shotgun

<!--
Speaker Notes:
- ReactCon Berlin. 30 minutes, then 10 for questions.
- Backstage is the app organizers use on D-Day: scan tickets, sell on site, live event data.
- Constraint: a 5-second freeze at the gate puts the queue on the street. Internet is optional.
- Four chapters: start & login, scan, sell, test & QA.
-->

---
layout: two-cols-header
---

# The door cannot stop

::left::

### Event D-Day

- Basements, festival fields, packed clubs
- Cellular dies when 10k people arrive
- Staff are stressed and won't open a manual
- A freeze at the gate can lead to dangerous crowding

::right::

### What the app must do

- Start and log in fast
- Scan instantly, offline
- Sell tickets or beers without an extra terminal
- Never lag, never crash

<!--
Speaker Notes:
- Paint the room: dark, loud, bouncers with gloves.
- We optimize for "is this person allowed in, right now", not for dashboards.
- These four needs are the four chapters.
-->

---
layout: section
glow: top-left
---

# Start fast

App launch & login

---

# Fast app launch

<v-clicks>

- **[Expo](https://expo.dev/)** — one toolchain, native modules when we need them
- **[Expo Router](https://docs.expo.dev/router/)** — file-based & protected routes
- **[Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)** via [Drizzle ORM](https://orm.drizzle.team/) — local DB, schema kept up to date by Drizzle migrations
- **[TanStack React Query](https://tanstack.com/query/latest/docs/framework/react/overview)** — hooks for data fetching, caching, and state management
- **[react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)** — synchronous key-value storage for settings
- **[Uniwind](https://docs.uniwind.dev/)** pro — Tailwind classes, C++ engine for fast rendering
- **[react-native-reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/)** & **[react-native-worklets](https://reactnative.dev/docs/worklets)** — Smooth animations

</v-clicks>

<!--
Speaker Notes:
- Many others useful Expo libraries used, hence the choice for Expo
- TanStack Query reads from SQLite
-->

---
layout: image-right
---

# Fast login

Create account → Open app → Scan QR → In

::right::

<SlidevVideo autoplay muted loop autoreset="slide">
  <source src="./videos/login.mp4" type="video/mp4" />
</SlidevVideo>

<!--
Speaker Notes:
- Can also log in with username and password
-->

---

# Types across the wire

Shared TypeScript types between server and app with oRPC.

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

Inputs and outputs are validated with [Zod](https://zod.dev/).

Old app versions get an HTTP 406 → `/outdated-version`.

<!--
Speaker Notes:
- oRPC: end-to-end TypeScript.
- x-app-version: we set a minimum version in an oRPC middleware.
- other middlewares: auth, permissions, logging, etc.
-->

---

# Architecture

Integrated in our TypeScript monorepo

```
shotgun/
├── apps/backstage/          # Expo / React Native app
├── apps/backstage-server/   # oRPC API
└── packages/backstage/      # Zod, Drizzle, and other shared code
```

<!--
Speaker Notes:
- Allows for code sharing and integrated CI
-->

---
layout: two-cols-header
---

# Keeping the local DB up to date

Events, tickets, deals, scan logs, orders, transfers…

::left::

### Initial load

- New phone: no cursor, so the whole event arrives as full pages
- 16 entity streams, pulled in parallel
- Keyset cursor: `(updatedAt, id)`
- Pages of 2,000 items every second until fully loaded

::right::

### Regular polling

- Every **10** seconds (or more for rarely-changing entities)
- Only when online, otherwise polling just pauses
- The app never waits for it

<!--
Speaker Notes:
- Full page (2,000) means there's more: poll again in 1s. Short page means we're current: back to steady polling (10s for most streams, slower for rarely-changing ones).
- Until the first pull is complete a missing ticket is "still_loading", not "unknown". We'll see that in chapter 2.
- All this is done in the background.
-->

---
layout: two-cols-header
---

# Who can do what

::left::

### Granular permissions, not just roles

- `scan` / `force_check_in`
- `sell_taptopay` / `sell_cash` / `sell_pix`
- `refund_all` / `refund_onsite`
- `display_scan_module` / `display_pos_module`

Assigned per event: a role gives defaults, which can be overridden

::right::

### Enforced twice

- Client: hide the module or button if not allowed
- Server: `permissionMiddleware` on oRPC

<!--
Speaker Notes:
- A bartender sells cash but doesn't refund last night's online sales.
- A door person scans, but can't force check-in.
- In the backend and Web admin we pick roles, that give presets of permissions for the allowed events.
- Offline, the UI uses the last synced permissions. The server checks again on every call.
-->

---
layout: section
glow: top-left
---

# Scan tickets

Fast and offline

---
layout: image-right
---

# You're in

QR → result overlay

<div class="flex gap-4 pt-10">
  <Badge variant="positive">Valid</Badge>
  <Badge variant="negative">Already in</Badge>
  <Badge variant="negative">Invalid</Badge>
</div>

::right::

<SlidevVideo autoplay muted loop autoreset="slide">
  <source src="./videos/scan.mp4" type="video/mp4" />
</SlidevVideo>

<!--
Speaker Notes:
- Play the recording (or live demo). 60-90 seconds max.
- Point out: full-screen result, no spinner.
- Then: "that overlay did not wait for our API."
- Tap to Pay has its own demo later. Don't play it here.
-->

---

# A simple, always-on scanner

Point the phone, get an answer. Nothing to find, nothing to tap.

The camera is the biggest battery and speed cost of the app.

<v-clicks>

- **Native session** — just keeping the camera open
- **Frame processor** — QR + barcode on every frame
- **The library** — [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/) is fine so far; we'll measure others if it isn't

</v-clicks>

<!--
Speaker Notes:
- Reliability first: staff with gloves, in the dark, in a hurry. The fewer gestures, the fewer mistakes.
- Costs: the native session, the frame processor, the library. Those are the battery and speed knobs.
- expo-camera for now. We'd measure alternatives if traces say so. No winner crowned.
-->

---
layout: statement
---

# A scan never waits on the network.

::right::

SQLite is the source of truth at the door.

The server is how we catch up — later.

<!--
Speaker Notes:
- This is the whole talk in one sentence.
- Ticket not in the local DB yet: still_loading. We never guess.
-->

---

# A local database of tickets

Everything a scan needs is already on the phone.

<v-clicks>

- One **SQLite JOIN** loads the ticket, deals, scan logs and transfers
- Instant: no request, no spinner, no timeout
- Kept fresh by the pull from chapter 1
- Ticket not there yet? `still_loading` — we never guess

</v-clicks>

<!--
Speaker Notes:
- TanStack Query reads from SQLite. It is not caching a REST call made at scan time.
- still_loading: ticket not in SQLite and the pull is incomplete. Staff wait.
- unknown: pull is complete and the code isn't in it.
-->

---

# Write locally first

```typescript
const syncAction = {
  uuid: generateTID(),
  eventId: payload.eventId,
  payload: scanLog,
  broadcastedAt: null,
  syncedAt: null,
};

// store locally
await db.transaction(async (tx) => {
  await upsert(client, schema.syncActions, [syncAction], { tx });
  await upsert(client, schema.scanLogs, [scanLog], { tx });
});

// then broadcast over Bluetooth mesh
void sendData({ type: "syncAction", syncAction });
```

<!--
Speaker Notes:
- Outbox: the scan is committed on the device before anyone else knows.
- syncedAt null = not on the server yet. broadcastedAt tracks the mesh. A failed broadcast doesn't roll back the scan.
- TIDs ([ATProto](https://atproto.com/specs/tid)): sortable, unique IDs generated offline with no server round-trip.
- Serial mutation scope { id: "scan" }: two rapid QR reads don't interleave.
-->

---
layout: two-cols-header
---

# Two ways to sync

The scan is committed. Now other devices need to know.

::left::

### Bluetooth mesh

- Phones at the door talk over **BLE GATT** — no pairing needed
- No internet, no server
- Only the sync action goes out, never the DB
- [Bridgefy](https://github.com/bridgefy/bridgefy-react-native) today

::right::

### Online

- Every phone pushes its pending scans to the server
- Server dedupes on UUID
- Any copy can deliver the scan
- Works as soon as the network is back

<!--
Speaker Notes:
- GATT = Generic Attribute Profile: how two Bluetooth Low Energy devices connect and exchange data by reading and writing "characteristics". Each phone advertises a service, scans for others, connects and writes packets. No pairing.
- Mesh gives the other gates the scan in a second or so, without internet.
- Online is the source of truth in the end. Both tracks are independent and both are idempotent.
- Diagram next.
-->

---

# Sync diagram: one scan, two phones

<MeshSyncDiagram />

<!--
Speaker Notes:
Click through:
1. Gate A commits locally: syncActions + scanLogs, syncedAt null. The door is already done.
2. Broadcast via Bridgefy, no internet. Only the sync action goes out, never the DB. On success A stamps broadcastedAt.
3. Gate B looks up the UUID. Known: ignore. Unknown: upsert the scan log and the sync action in one transaction.
4. Payoff: decideScan reads local scanLogs, so the next scan of that ticket at B is already_checked_in. No server.
5. Separate track: every 5s each phone pushes rows with syncedAt null. B has a copy too, so if A never reconnects, B delivers the scan.
6. Server dedupes on UUID: two phones pushing the same action is harmless.
- Android needs Bluetooth + location permissions. The simulator is a no-op.
-->

---
layout: two-cols-header
---

# Catching up when the network is back

Push and pull, in the background.

::left::

### Push — the outbox

- `syncActions.push` every **5s**, only if pending
- Server dedupes on UUID
- Bad items dropped; the rest of the batch still applies
- Scan already happened. This is catch-up.

::right::

### Pull — same loop as chapter 1

- Scans from other gates and the server land in the local DB
- Full page: again in **1s**. Short page: back to **~10s**
- Nothing blocks the door

<!--
Speaker Notes:
- Push is independent of pull. Offline: sync is paused and rows stay syncedAt null.
- Server handles each action on its own: invalid ones are dropped, known UUIDs are skipped, the rest apply.
- A succeeded scan sets redeemedAt on the server.
-->

---

# One QR, end to end

<v-clicks>

1. **Camera** reads the QR — always on
2. **SQLite query** loads the ticket, deals, scan logs, transfers
3. **`decideScan()`** returns one of 12 outcomes (<Badge variant="positive">checked_in</Badge>, <Badge variant="negative">already_checked_in</Badge>, <Badge variant="negative">resold</Badge>, etc.)
4. **Transaction** writes `syncAction` (offline generated `TID`) w/ `scanLog` payload
5. **Overlay** immediate feedback — staff already moved on
6. **Bluetooth mesh** broadcasts the scan log to nearby phones
7. **Push** to the server every few seconds, if we have a network

</v-clicks>

<!--
Speaker Notes:
- Recap slide: this is the architecture.
- Mesh and server push are asynchronous. The bouncer doesn't wait.
- decideScan: 12 outcomes, not a boolean. still_loading = pull incomplete, unknown = pull complete and code absent. already_checked_in reads local scanLogs, mesh included. Force check-in is a permission.
-->

---
layout: two-cols-header
---

::left::

# Limitation: the double scan

It takes **all** of these at the same time:

- The **same valid ticket** at **two different gates**
- Scanned within **the same second**
- Before the Bluetooth message from the first gate reaches the second

Then both scans say `checked_in`, and the server keeps both logs (different UUIDs).

<br />

***Almost impossible in practice**: no need to invent a distributed lock for it.*

::right::

# Unstable proprietary library

- We use [Bridgefy](https://github.com/bridgefy/bridgefy-react-native), but it can sometimes crash 
- We will replace it with **[`@shotgun/mesh`](https://github.com/shotgun-warehouse/mesh)** — a simpler Bluetooth mesh library we vibe-coded.

<!--
Speaker Notes:
- Be honest, but keep it in proportion: this is the question you will get, and it needs several things at once.
- Same ticket, two gates, same second, before the mesh message lands. The mesh shrinks that window but doesn't fully close it (range, permissions, no distributed lock).
- Say this sentence: we accept a tiny double-scan window over blocking the door.
- Why own the mesh: Bridgefy crashes in the field. @shotgun/mesh is GATT writes + TTL gossip for small meshes, inspired by BitChat.
-->

---
layout: section
glow: top-left
---

# Chapter 3

Sell

<!--
Speaker Notes:
- Scan path done. Now the other thing door and bar staff do: sell.
- Running long? Start cutting in chapter 4.
-->

---
layout: two-cols-header
---

# No terminal needed

Tickets at the door, beers at the bar.

::left::

### The need

- Sell tickets on site
- Sell beers, drinks, anything
- No card terminal to carry, charge and lose

::right::

### Our answer

- The phone is the terminal
- Payment, receipt and ticket in one flow
- Share the ticket, or print it

<!--
Speaker Notes:
- Same beat as the scan: the phone does the job, no extra hardware.
- Cash, card and Pix are permission-gated.
-->

---
layout: image-right
fit: contain
---

# Tap to Pay

Phone → tap → paid → share ticket

::right::

<SlidevVideo autoplay muted loop autoreset="slide">
  <source src="./videos/taptopay.mp4" type="video/mp4" />
</SlidevVideo>

<!--
Speaker Notes:
- Stripe Terminal handles payment. Cash, card and Pix are permission-gated.
- Our native Expo module (IosTapToPay) only shows Apple's "how to tap" sheet. Stripe does the rest.
- After the sale: share the ticket, or print it (next slide).
- Session expiry mid-event: reconnect and retry. Don't dwell unless asked.
-->

---
layout: image-right
fit: contain
---

# Printing over Bluetooth

Star Micronics — Bluetooth or USB

### What we print

The ticket they just bought, QR and all. It prints by itself after the sale, and
a cash sale opens the drawer.

<br />

### How

**[Skia](https://shopify.github.io/react-native-skia/)** draws the ticket → bitmap → printer. A local queue handles retries and
uncertain outcomes. The sale is done; the print is catch-up.

::right::

<img src="./images/printed-ticket.jpg" alt="Printed thermal ticket" />

<!--
Speaker Notes:
- Why Skia: the ticket layout is ours, not ESC/POS templates. And it's easier to test: the layout is drawn by code we can render and check without a printer.
- The queue lives on the device: same offline-first instinct as scans.
- Pairing and test print are in settings. After a sale a print is enqueued; cash sales can open the drawer.
- The Star printer is the only extra hardware at the till.
-->

---
layout: section
glow: top-left
---

# Chapter 4

Test & QA

<!--
Speaker Notes:
- Everything that lets us ship before D-Day without fear.
- Short on time? Keep OTA + Sentry, skip the rest.
-->

---
layout: two-cols-header
---

# Shipping updates

JS changes go over the air. Data changes migrate on the phone.

::left::

### OTA updates

- EAS Update: JS-only PRs reach phones without a store release
- Runtime version follows `appVersion`: native changes need a new binary

::right::

### Local DB migrations

- Drizzle migrations for the SQLite on the phone
- Schema lives in `packages/backstage`, shared with the server
- A schema change breaks app and server at compile time

<!--
Speaker Notes:
- Runtime version follows appVersion: JS-only PRs go OTA, native changes need a new binary.
- The local DB is in the hands of thousands of phones: the schema can't just be "recreated". Drizzle migrations handle the upgrade.
- x-app-version / 406 → /outdated-version: we force upgrades for incompatible clients.
-->

---
layout: image-right
fit: contain
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

Every PR publishes an EAS Update. Preview builds let you pick the channel in a
debug screen.

::right::

<img src="./images/dev-settings.png" alt="Dev settings" />

<!--
Speaker Notes:
- Preview only. Production staff never see this menu.
- That's how we test scan + Tap to Pay on real hardware the week of the event, without a TestFlight per PR.
-->

---
layout: two-cols-header
---

# Observability with Sentry

A freeze or a crash is a problem. A network error is not.

::left::

### Ignore the noise

```typescript
Sentry.init({
  ignoreErrors: [NETWORK_ERROR_MESSAGE_REGEX],
  tracesSampleRate: 1,
  enableLogs: true,
})
```

*Traces and logs run in production too.*

::right::

### Keep the door up

- Error boundary: toast, then retry
- Tag `git_hash` — which OTA
- Tag `context` + `action` — Scan, Mesh, Stripe

<!--
Speaker Notes:
- ignoreErrors: cellular dying is the product constraint. Don't page on "fetch failed".
- GlobalErrorWatcher: network errors are swallowed; anything else toasts and goes to Sentry. In prod we don't call the default handler: it would take down the JS runtime at the door.
- Traces (100%) and logs are on in production too, since late September.
- git_hash = EXPO_PUBLIC_GIT_HASH: you know which build is on the phone.
- reportError(context, action) is how Stripe, mesh and scan errors get their tags.
- Sentry.wrap(RootLayout) + wrapExpoRouterErrorBoundary: retry, not a white screen.
-->

---
layout: two-cols-header
---

# Tests: API & app

Vitest for the API. Maestro for the app.

::left::

### API — Vitest

Call the oRPC procedure. Real DB. Isolated per test.

```typescript
await call(syncActions.push, { syncActions }, { context })
```

UUID dedupe, permissions, refunds — same routers the phone hits.

::right::

### App — Maestro

YAML on a real iOS build. Seeded event, then teardown.

```yaml
- tapOn: { id: module_sell }
- tapOn: { id: cash }
- assertVisible: { id: sale_registered }
```

Login, ticketing, sell. Not the camera. Yet.

<!--
Speaker Notes:
- API: Vitest + call() from @orpc/server. Same procedures the app hits. Real Postgres, each test in a savepoint that's rolled back.
- syncActions.push is the key test: UUID is idempotent, a bad item doesn't fail the batch, a succeeded scan sets redeemedAt.
- decideScan / evaluateScan: Vitest on the client (~850 lines of tests), no DB. Don't mix it into the API column unless asked.
- Maestro: login, seeded event, create a ticket, cash sale, logout. testIDs, not screenshots.
- CI: EAS workflow on main: seed an event, iOS e2e build, Maestro (2 retries), teardown.
- Camera scan isn't in Maestro (lighting, hardware). Channel surfing is how we QA that.
-->

---
layout: cards
---

# Takeaways

::cards::

<Card label="Treat the network as optional">

Scan against SQLite. Sync is an outbox.

</Card>

<Card label="Name the race">

Mesh shrinks double-scans. It does not give you a lock.

</Card>

<Card label="Share types, not URLs">

Monorepo + oRPC + Zod.

</Card>

<!--
Speaker Notes:
- Leave this up and walk the three cards slowly.
- Invite questions: the double-scan window, mesh vs Bridgefy, camera battery, printing, Expo modules, permissions, testing, Sentry.
-->

---
layout: end
---

# Thank you

## Questions

Antoine Rousseau — Engineering Manager @ Shotgun

::right::

<img src="./images/linkedin.svg" alt="LinkedIn" />

<!--
Speaker Notes:
- 10 minutes of Q&A. Likely questions:
  - Double-scan: UUID idempotency + local scanLogs. The window exists before mesh/server. We chose door speed.
  - Battery: the camera session, frame processor and library (expo-camera today).
  - Mesh: Bridgefy crashed in the field. In-house @shotgun/mesh: GATT gossip, small meshes, we own the crashes.
  - Conflict UI: none. Staff see already_checked_in from local logs.
  - Printing: Star thermal printers, Skia-rendered tickets, local queue. On-site tickets, not PDF-only.
  - Testing: Vitest on decideScan and oRPC; Maestro covers login/sell/ticketing, not camera scan (yet).
-->
