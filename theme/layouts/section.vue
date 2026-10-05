<script setup lang="ts">
import SlideShell from '../components/SlideShell.vue'
import type { GlowPlacement } from '../types'

/** Template slides 2–5: Monument headline, optional one-line description. */
withDefaults(defineProps<{ glow?: GlowPlacement }>(), { glow: 'bottom' })
</script>

<template>
  <SlideShell name="sg-section" :glow="glow">
    <div class="sg-section-body">
      <slot />
    </div>
  </SlideShell>
</template>

<style scoped>
.sg-section-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
  min-height: 0;
  max-width: 1200px;
}
</style>
