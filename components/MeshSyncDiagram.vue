<script setup lang="ts">
/**
 * Sequence diagram of one scan travelling over the Bluetooth mesh.
 * Mirrors apps/backstage/src/providers/mesh:
 *   use-sync-action  → local transaction, then `sendData({ type: "syncAction" })`
 *   handlers/index   → `handleMeshSyncAction`: same TID → ignore, else upsert
 *   sync/sync-actions → every 5s, any phone pushes rows with `syncedAt: null`
 *
 * Drawn in a 1664-wide viewBox so it matches the slide's content width 1:1.
 */
const lanes = { a: 270, b: 832, s: 1394 }
const boxW = 460
</script>

<template>
  <svg
    class="mesh-diagram"
    viewBox="0 0 1664 696"
    width="1664"
    height="696"
    role="img"
    aria-label="A scan is committed locally, broadcast over Bluetooth, deduped by TID on the peer, then pushed to the server by any online phone."
  >
    <defs>
      <marker id="mesh-arrow-teal" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="18" markerHeight="18" markerUnits="userSpaceOnUse" orient="auto">
        <path d="M1 1 L11 6 L1 11 Z" fill="var(--sg-teal)" />
      </marker>
      <marker id="mesh-arrow-peri" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="18" markerHeight="18" markerUnits="userSpaceOnUse" orient="auto">
        <path d="M1 1 L11 6 L1 11 Z" fill="var(--sg-periwinkle)" />
      </marker>
    </defs>

    <!-- Lifelines -->
    <line v-for="x in [lanes.a, lanes.b, lanes.s]" :key="x" class="lifeline" :class="{ 'lifeline-server': x === lanes.s }" :x1="x" y1="76" :x2="x" y2="696" />

    <!-- Actors -->
    <g v-for="actor in [
      { x: lanes.a, title: 'Gate A', sub: 'scans the ticket', kind: 'phone' },
      { x: lanes.b, title: 'Gate B', sub: 'nearby phone, same event', kind: 'phone' },
      { x: lanes.s, title: 'Server', sub: 'whenever someone has signal', kind: 'server' },
    ]" :key="actor.title">
      <rect :class="['actor', `actor-${actor.kind}`]" :x="actor.x - 220" y="0" width="440" height="76" rx="8" />

      <!-- Phone icon: teal, portrait -->
      <g v-if="actor.kind === 'phone'" class="icon icon-phone" :transform="`translate(${actor.x - 220 + 34} 18)`">
        <rect x="0" y="0" width="26" height="40" rx="5" />
        <line x1="9" y1="33" x2="17" y2="33" />
      </g>

      <!-- Server icon: periwinkle, stacked units -->
      <g v-else class="icon icon-server" :transform="`translate(${actor.x - 220 + 28} 16)`">
        <rect x="0" y="0" width="38" height="17" rx="4" />
        <rect x="0" y="23" width="38" height="17" rx="4" />
        <circle class="dot" cx="9" cy="8.5" r="2.5" />
        <circle class="dot" cx="9" cy="31.5" r="2.5" />
      </g>

      <text class="t-actor" :class="`t-actor-${actor.kind}`" :x="actor.x + 20" y="34" text-anchor="middle">{{ actor.title }}</text>
      <text class="t-sub" :x="actor.x + 20" y="62" text-anchor="middle">{{ actor.sub }}</text>
    </g>

    <!-- 1 · Gate A commits locally -->
    <g>
      <rect class="box" :x="lanes.a - boxW / 2" y="104" :width="boxW" height="96" rx="8" />
      <circle class="badge" :cx="lanes.a - boxW / 2 + 40" cy="152" r="18" />
      <text class="t-badge" :x="lanes.a - boxW / 2 + 40" y="159" text-anchor="middle">1</text>
      <text class="t-title" :x="lanes.a - boxW / 2 + 76" y="146">Scan commits locally</text>
      <text class="t-sub" :x="lanes.a - boxW / 2 + 76" y="176">One transaction, <tspan class="mono">syncedAt: null</tspan></text>
    </g>

    <!-- 2 · Broadcast over Bluetooth -->
    <g v-click>
      <line class="arrow-teal" :x1="lanes.a" y1="262" :x2="lanes.b - 4" y2="262" marker-end="url(#mesh-arrow-teal)" />
      <circle class="badge" :cx="lanes.a + 40" cy="262" r="18" />
      <text class="t-badge" :x="lanes.a + 40" y="269" text-anchor="middle">2</text>
      <text class="t-title" :x="lanes.a + 76" y="248">Broadcast over Bluetooth</text>
      <text class="t-sub mono" :x="lanes.a + 76" y="300">{ type: "syncAction" }</text>
    </g>

    <!-- 3 · Gate B dedupes on TID -->
    <g v-click>
      <rect class="box" :x="lanes.b - boxW / 2" y="330" :width="boxW" height="124" rx="8" />
      <circle class="badge" :cx="lanes.b - boxW / 2 + 40" cy="378" r="18" />
      <text class="t-badge" :x="lanes.b - boxW / 2 + 40" y="385" text-anchor="middle">3</text>
      <text class="t-title" :x="lanes.b - boxW / 2 + 76" y="372">Known TID?</text>
      <text class="t-sub" :x="lanes.b - boxW / 2 + 76" y="404">Yes → ignore</text>
      <text class="t-sub" :x="lanes.b - boxW / 2 + 76" y="436">No → upsert <tspan class="mono">scanLogs</tspan> + action</text>
    </g>

    <!-- 4 · Result at Gate B -->
    <g v-click>
      <rect class="box box-ok" :x="lanes.b - boxW / 2" y="474" :width="boxW" height="80" rx="8" />
      <circle class="badge" :cx="lanes.b - boxW / 2 + 40" cy="514" r="18" />
      <text class="t-badge" :x="lanes.b - boxW / 2 + 40" y="521" text-anchor="middle">4</text>
      <text class="t-title" :x="lanes.b - boxW / 2 + 76" y="508">Next scan of that ticket</text>
      <text class="t-sub mono ok" :x="lanes.b - boxW / 2 + 76" y="538">already_checked_in</text>
    </g>

    <!-- 5 · Any phone pushes its outbox -->
    <g v-click>
      <line class="arrow-peri" :x1="lanes.a" y1="598" :x2="lanes.s - boxW / 2 - 4" y2="598" marker-end="url(#mesh-arrow-peri)" />
      <circle class="badge badge-peri" :cx="lanes.a + 40" cy="598" r="18" />
      <text class="t-badge" :x="lanes.a + 40" y="605" text-anchor="middle">5</text>
      <text class="t-title peri" :x="lanes.a + 76" y="584">Outbox push, every 5s</text>
      <text class="t-sub" :x="lanes.a + 76" y="632">only if online</text>

      <line class="arrow-peri" :x1="lanes.b" y1="660" :x2="lanes.s - boxW / 2 - 4" y2="660" marker-end="url(#mesh-arrow-peri)" />
      <circle class="badge badge-peri" :cx="lanes.b + 40" cy="660" r="18" />
      <text class="t-badge" :x="lanes.b + 40" y="667" text-anchor="middle">5</text>
      <text class="t-sub" :x="lanes.b + 76" y="646">Peers push too</text>
    </g>

    <!-- 6 · Server dedupes -->
    <g v-click>
      <rect class="box box-server" :x="lanes.s - boxW / 2" y="574" :width="boxW" height="104" rx="8" />
      <circle class="badge badge-peri" :cx="lanes.s - boxW / 2 + 40" cy="626" r="18" />
      <text class="t-badge" :x="lanes.s - boxW / 2 + 40" y="633" text-anchor="middle">6</text>
      <text class="t-title" :x="lanes.s - boxW / 2 + 76" y="620">Dedupes on TID</text>
      <text class="t-sub" :x="lanes.s - boxW / 2 + 76" y="650">First push wins, rest skipped</text>
    </g>
  </svg>
</template>

<style scoped>
.mesh-diagram {
  display: block;
  overflow: visible;
  font-family: var(--sg-font-sans);
}

.lifeline {
  stroke: rgb(255 255 255 / 18%);
  stroke-width: 2;
  stroke-dasharray: 6 8;
}

.lifeline-server {
  stroke: color-mix(in srgb, var(--sg-periwinkle) 45%, transparent);
}

.actor {
  stroke-width: 2;
}

/* Phones: neutral card with a teal edge */
.actor-phone {
  fill: color-mix(in srgb, var(--sg-teal) 8%, transparent);
  stroke: var(--sg-teal);
}

/* Server: periwinkle, filled, so it reads as a different kind of node */
.actor-server {
  fill: color-mix(in srgb, var(--sg-periwinkle) 24%, transparent);
  stroke: var(--sg-periwinkle);
}

.icon {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
}

.icon-phone {
  stroke: var(--sg-teal);
}

.icon-server {
  stroke: var(--sg-periwinkle);
}

.icon-server .dot {
  fill: var(--sg-periwinkle);
  stroke: none;
}

.t-actor.t-actor-server {
  fill: var(--sg-periwinkle);
}

.box-server {
  stroke: var(--sg-periwinkle);
}

.box {
  fill: #2a2a2a;
  stroke: var(--sg-border-subtle);
  stroke-width: 2;
}

.box-ok {
  stroke: var(--sg-teal);
}

.arrow-teal,
.arrow-peri {
  stroke-width: 4;
}

.arrow-teal {
  stroke: var(--sg-teal);
}

.arrow-peri {
  stroke: var(--sg-periwinkle);
}

.badge {
  fill: var(--sg-teal);
}

.badge-peri {
  fill: var(--sg-periwinkle);
}

.t-badge {
  font-size: 22px;
  font-weight: 700;
  fill: var(--sg-black);
}

.t-actor {
  font-size: 28px;
  font-weight: 700;
  fill: var(--sg-white);
}

.t-title {
  font-size: 28px;
  font-weight: 700;
  fill: var(--sg-white);
}

.t-title.peri {
  fill: var(--sg-periwinkle);
}

.t-sub {
  font-size: 22px;
  font-weight: 500;
  fill: var(--sg-grey);
}

.mono {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
}

.t-sub.ok {
  fill: var(--sg-teal);
}
</style>
