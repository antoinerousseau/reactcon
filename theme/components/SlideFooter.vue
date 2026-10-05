<script setup lang="ts">
import ShotgunLogo from './ShotgunLogo.vue'

/**
 * Footer from the template: logo bottom-left, copyright bottom-right, both
 * inset 68px. The template's "Line 3" divider between them sits at stroke
 * opacity 0, so it is deliberately left out here.
 */
withDefaults(defineProps<{ copyright?: string }>(), { copyright: '© 2026' })
</script>

<template>
  <footer class="sg-footer">
    <ShotgunLogo :width="131" />
    <span class="sg-footer-copy">{{ copyright }}</span>
  </footer>
</template>

<style scoped>
.sg-footer {
  position: absolute;
  left: 68px;
  right: 68px;
  top: var(--sg-footer-y);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
  pointer-events: none;
}

.sg-footer-copy {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  color: var(--sg-content-secondary);
}
</style>
