<script setup lang="ts">
import ShotgunLogo from '../components/ShotgunLogo.vue'
import SlideShell from '../components/SlideShell.vue'

/** Closing slide — the cover treatment, reused as a bookend. */
</script>

<template>
  <SlideShell name="sg-end" glow="cover" :footer="false">
    <ShotgunLogo class="sg-end-logo" :width="240" />
    <div class="sg-end-body">
      <slot />
    </div>
  </SlideShell>
</template>

<style scoped>
.sg-end-logo {
  flex: none;
}

.sg-end-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
  min-height: 0;
  padding-bottom: 64px;
}
</style>
