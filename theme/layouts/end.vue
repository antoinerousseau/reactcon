<script setup lang="ts">
import Equalizer from '../components/Equalizer.vue'
</script>

<template>
  <div class="slidev-layout end w-full h-full">
    <div class="my-auto w-full">
      <slot />
    </div>
    <Equalizer class="abs-bl m-10" />
  </div>
</template>
