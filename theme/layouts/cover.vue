<script setup lang="ts">
import ShotgunLogo from '../components/ShotgunLogo.vue'
import SlideShell from '../components/SlideShell.vue'

/**
 * Title slide. The template's own cover is a pure brand slide (centred logo on
 * the full-width glow); a talk needs a title, so this keeps the glow and the
 * lockup and borrows the section-title type treatment for the headline.
 */
</script>

<template>
  <SlideShell name="sg-cover" glow="cover" :footer="false">
    <ShotgunLogo class="sg-cover-logo" :width="240" />
    <div class="sg-cover-body">
      <slot />
    </div>
  </SlideShell>
</template>

<style scoped>
.sg-cover-logo {
  flex: none;
}

.sg-cover-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
  min-height: 0;
  padding-bottom: 64px;
}
</style>
