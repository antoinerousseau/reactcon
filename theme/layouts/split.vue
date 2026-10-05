<script setup lang="ts">
import SlideShell from '../components/SlideShell.vue'
import type { GlowPlacement } from '../types'

/**
 * Template slide 7: section label parked on the left, the actual content
 * stacked down the right-hand column. Good for a list that needs room.
 */
withDefaults(defineProps<{ glow?: GlowPlacement }>(), { glow: 'bottom' })
</script>

<template>
  <SlideShell name="sg-split" :glow="glow">
    <div class="sg-split-grid">
      <div class="sg-split-label">
        <slot />
      </div>
      <div class="sg-split-body">
        <slot name="right" />
      </div>
    </div>
  </SlideShell>
</template>

<style scoped>
.sg-split-grid {
  display: grid;
  grid-template-columns: 560px 680px;
  justify-content: space-between;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0;
}

.sg-split-label,
.sg-split-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sg-split-label {
  justify-content: center;
}

/* Top-aligned so <v-clicks> reveals grow downwards instead of
   re-centring and shifting the lines already on screen. */
.sg-split-body {
  justify-content: flex-start;
}
</style>
