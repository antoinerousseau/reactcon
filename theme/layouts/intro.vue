<script setup lang="ts">
import { computed } from 'vue'
import { handleBackground } from '@slidev/client'

const props = defineProps<{
  background?: string
}>()

const style = computed(() => handleBackground(props.background, true))
</script>

<template>
  <div class="slidev-layout intro" :style="style">
    <div class="my-auto w-full">
      <slot />
    </div>
  </div>
</template>
