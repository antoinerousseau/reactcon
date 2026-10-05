<script setup lang="ts">
import SlideShell from '../components/SlideShell.vue'
import type { GlowPlacement } from '../types'

/** Template slide 32: centred avatar, quote, then attribution. */
withDefaults(defineProps<{ glow?: GlowPlacement }>(), { glow: 'bottom' })
</script>

<template>
  <SlideShell name="sg-quote" :glow="glow">
    <div class="sg-quote-body">
      <slot />
    </div>
  </SlideShell>
</template>

<style scoped>
.sg-quote-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  min-height: 0;
  width: 872px;
  margin: 0 auto;
  text-align: center;
}
</style>
