<script setup lang="ts">
import { computed } from 'vue'
import { handleBackground, resolveAssetUrl } from '@slidev/client'

const props = defineProps<{
  background?: string
}>()

const style = computed(() => {
  if (!props.background)
    return {}

  const isColor = props.background[0] === '#' || props.background.startsWith('rgb')
  if (isColor)
    return handleBackground(props.background, true)

  const url = resolveAssetUrl(props.background)
  return {
    ...handleBackground(props.background, true),
    backgroundImage: `linear-gradient(oklch(0.222 0 0 / 0.42), oklch(0.222 0 0 / 0.82)), url("${url}")`,
  }
})
</script>

<template>
  <div class="slidev-layout cover" :style="style">
    <div class="my-auto w-full">
      <slot />
    </div>
  </div>
</template>
