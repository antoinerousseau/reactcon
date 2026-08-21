<script setup lang="ts">
import Equalizer from '../components/Equalizer.vue'
</script>

<template>
  <div class="slidev-layout section w-full h-full">
    <div class="my-auto">
      <Equalizer class="mb-6" />
      <slot />
    </div>
  </div>
</template>
