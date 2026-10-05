<script setup lang="ts">
import SlideShell from '../components/SlideShell.vue'
import type { GlowPlacement } from '../types'

/** Template slide 18: one number set in Monument, with its explanation under it. */
withDefaults(defineProps<{ glow?: GlowPlacement }>(), { glow: 'top-right' })
</script>

<template>
  <SlideShell name="sg-fact" :glow="glow">
    <div class="sg-fact-body">
      <slot />
    </div>
  </SlideShell>
</template>

<style scoped>
.sg-fact-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
  min-height: 0;
  max-width: 982px;
}
</style>
