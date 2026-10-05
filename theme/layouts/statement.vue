<script setup lang="ts">
import SlideShell from '../components/SlideShell.vue'
import type { GlowPlacement } from '../types'

/**
 * Template slide 6 ("Highlight"): one important thing, stated big on the left,
 * with the supporting sentence set in the right-hand column.
 */
withDefaults(defineProps<{ glow?: GlowPlacement }>(), { glow: 'bottom' })
</script>

<template>
  <SlideShell name="sg-statement" :glow="glow">
    <div class="sg-statement-grid">
      <div class="sg-statement-lead">
        <slot />
      </div>
      <div class="sg-statement-aside">
        <slot name="right" />
      </div>
    </div>
  </SlideShell>
</template>

<style scoped>
.sg-statement-grid {
  display: grid;
  grid-template-columns: 660px 680px;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 auto;
  min-height: 0;
}

.sg-statement-lead,
.sg-statement-aside {
  min-width: 0;
}
</style>
