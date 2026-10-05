<script setup lang="ts">
import SlideShell from '../components/SlideShell.vue'
import type { GlowPlacement } from '../types'

withDefaults(defineProps<{ glow?: GlowPlacement }>(), { glow: 'bottom' })
</script>

<template>
  <SlideShell name="sg-default" :glow="glow">
    <slot />
  </SlideShell>
</template>
