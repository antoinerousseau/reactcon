<script setup lang="ts">
import SlideShell from '../components/SlideShell.vue'
import type { GlowPlacement } from '../types'

/**
 * Template slide 15: media bled to the slide edges with a centred caption
 * underneath. No footer, same as the template.
 */
withDefaults(defineProps<{ glow?: GlowPlacement }>(), { glow: 'none' })
</script>

<template>
  <SlideShell name="sg-media" :glow="glow" :footer="false">
    <div class="sg-media-stage">
      <slot />
    </div>
    <div class="sg-media-caption">
      <slot name="caption" />
    </div>
  </SlideShell>
</template>

<style scoped>
.sg-media-stage {
  flex: none;
  width: 1920px;
  height: 908px;
  overflow: hidden;
  background: rgb(255 255 255 / 4%);
}

.sg-media-stage :deep(img),
.sg-media-stage :deep(video) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.sg-media-caption {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  min-height: 0;
  text-align: center;
}
</style>
