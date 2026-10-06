<script setup lang="ts">
import ShotgunLogo from '../components/ShotgunLogo.vue'
import SlideShell from '../components/SlideShell.vue'

/**
 * Closing slide — the cover treatment, reused as a bookend. Optional
 * `::right::` content (e.g. a QR code) sits beside the text.
 */
</script>

<template>
  <SlideShell name="sg-end" glow="cover" :footer="false">
    <ShotgunLogo class="sg-end-logo" :width="240" />
    <div class="sg-end-body">
      <div class="sg-end-main">
        <slot />
      </div>
      <div v-if="$slots.right" class="sg-end-aside">
        <slot name="right" />
      </div>
    </div>
  </SlideShell>
</template>

<style scoped>
.sg-end-logo {
  flex: none;
}

.sg-end-body {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 64px;
  flex: 1 1 auto;
  min-height: 0;
  padding-bottom: 64px;
}

.sg-end-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.sg-end-aside {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sg-end-aside :deep(img) {
  display: block;
  width: 420px;
  height: 420px;
  border-radius: 24px;
}
</style>
