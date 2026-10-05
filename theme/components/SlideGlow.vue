<script setup lang="ts">
import { computed } from 'vue'
import glowBottom from '../assets/glow-bottom.webp'
import glowCover from '../assets/glow-cover.webp'
import glowTopLeft from '../assets/glow-top-left.webp'
import glowTopRight from '../assets/glow-top-right.webp'
import type { GlowPlacement } from '../types'

/**
 * The deck's signature: a soft four-colour gradient bleeding off one edge.
 *
 * Each placement is exported from the Figma template at its blur-inclusive
 * render bounds, so the boxes below are the artwork's real position on the
 * 1920x1080 artboard rather than the layer box Figma reports.
 */
const PLACEMENTS = {
  cover: { src: glowCover, left: 0, top: 198, width: 1920, height: 882 },
  bottom: { src: glowBottom, left: 191, top: 593, width: 1583, height: 487 },
  'top-right': { src: glowTopRight, left: 788, top: 0, width: 1132, height: 819 },
  'top-left': { src: glowTopLeft, left: 0, top: 0, width: 1235, height: 769 },
}

const props = withDefaults(defineProps<{
  placement?: GlowPlacement
}>(), {
  placement: 'bottom',
})

const glow = computed(() => props.placement === 'none' ? null : PLACEMENTS[props.placement])
</script>

<template>
  <img
    v-if="glow"
    class="sg-glow"
    :src="glow.src"
    :width="glow.width"
    :height="glow.height"
    :style="{ left: `${glow.left}px`, top: `${glow.top}px` }"
    alt=""
    aria-hidden="true"
  >
</template>

<style scoped>
.sg-glow {
  position: absolute;
  z-index: 0;
  border-radius: 0;
  pointer-events: none;
  user-select: none;
}
</style>
