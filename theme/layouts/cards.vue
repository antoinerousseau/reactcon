<script setup lang="ts">
import SlideShell from '../components/SlideShell.vue'
import type { GlowPlacement } from '../types'

/**
 * Template slide 11: slide title, then a row of translucent cards. The title
 * goes in the default slot; put <Card> components under `::cards::` and they
 * split the row evenly.
 */
withDefaults(defineProps<{ glow?: GlowPlacement }>(), { glow: 'top-right' })
</script>

<template>
  <SlideShell name="sg-cards" :glow="glow">
    <div class="sg-cards-header">
      <slot />
    </div>
    <div class="sg-card-row">
      <slot name="cards" />
    </div>
  </SlideShell>
</template>

<style scoped>
.sg-cards-header {
  flex: none;
}

.sg-card-row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  column-gap: var(--sg-gutter);
  flex: 1 1 auto;
  min-height: 0;
}
</style>
