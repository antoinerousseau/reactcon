<script setup lang="ts">
import ShotgunLogo from './ShotgunLogo.vue'
</script>

<template>
  <footer class="sg-footer">
    <ShotgunLogo :width="131" />
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
</style>
