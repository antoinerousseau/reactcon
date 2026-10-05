<script setup lang="ts">
import SlideShell from '../components/SlideShell.vue'
import type { GlowPlacement } from '../types'

/**
 * Template slides 12/13: text block on the left, an 824px square of media
 * anchored to the top-right corner of the content area.
 *
 * The template fills that square with a photo, so `fit` defaults to cover.
 * Portrait sources — phone recordings, app screenshots — want `contain`.
 */
withDefaults(defineProps<{
  glow?: GlowPlacement
  fit?: 'cover' | 'contain'
}>(), { glow: 'bottom', fit: 'cover' })
</script>

<template>
  <SlideShell name="sg-image-right" :glow="glow">
    <div class="sg-image-right-grid">
      <div class="sg-image-right-text">
        <slot />
      </div>
      <div class="sg-image-right-media" :class="`is-${fit}`">
        <slot name="right" />
      </div>
    </div>
  </SlideShell>
</template>

<style scoped>
.sg-image-right-grid {
  display: grid;
  grid-template-columns: 680px 824px;
  justify-content: space-between;
  flex: 1 1 auto;
  min-height: 0;
}

.sg-image-right-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding-bottom: 64px;
}

.sg-image-right-media {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 824px;
  height: 824px;
  overflow: hidden;
  border-radius: var(--sg-radius);
}

.sg-image-right-media :deep(img),
.sg-image-right-media :deep(video) {
  width: 100%;
  height: 100%;
  border-radius: var(--sg-radius);
}

.sg-image-right-media.is-cover :deep(img),
.sg-image-right-media.is-cover :deep(video) {
  object-fit: cover;
}

.sg-image-right-media.is-contain :deep(img),
.sg-image-right-media.is-contain :deep(video) {
  object-fit: contain;
}
</style>
