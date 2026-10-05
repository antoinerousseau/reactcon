<script setup lang="ts">
import SlideFooter from './SlideFooter.vue'
import SlideGlow from './SlideGlow.vue'
import type { GlowPlacement } from '../types'

/** Every layout's outer frame: background, glow, content stack, footer. */
withDefaults(defineProps<{
  name: string
  glow?: GlowPlacement
  footer?: boolean
  layoutClass?: string
}>(), {
  glow: 'bottom',
  footer: true,
})
</script>

<template>
  <div class="slidev-layout" :class="[name, layoutClass]">
    <SlideGlow :placement="glow" />
    <div class="sg-content">
      <slot />
    </div>
    <SlideFooter v-if="footer" />
  </div>
</template>

<style scoped>
.sg-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
</style>
