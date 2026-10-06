<script setup lang="ts">
import SlideShell from '../components/SlideShell.vue'
import type { GlowPlacement } from '../types'

/**
 * Template slides 8/16: slide title across the top, two equal 800px columns
 * underneath. The template gives the columns no card chrome — they are plain
 * text blocks separated by the 64px gutter.
 */
const props = withDefaults(defineProps<{
  glow?: GlowPlacement
  class?: string
  layoutClass?: string
}>(), { glow: 'top-right' })
</script>

<template>
  <SlideShell name="sg-two-cols-header" :glow="glow" :layout-class="layoutClass">
    <div class="col-header">
      <slot />
    </div>
    <div class="sg-cols">
      <div class="col-left" :class="props.class">
        <slot name="left" />
      </div>
      <div v-click class="col-right" :class="props.class">
        <slot name="right" />
      </div>
    </div>
    <div class="col-bottom">
      <slot name="bottom" />
    </div>
  </SlideShell>
</template>

<style scoped>
.col-header {
  flex: none;
}

.sg-cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--sg-gutter);
  align-content: start;
  flex: 1 1 auto;
  min-height: 0;
}

.col-left,
.col-right {
  min-width: 0;
  min-height: 0;
}

.col-bottom {
  flex: none;
}
</style>
