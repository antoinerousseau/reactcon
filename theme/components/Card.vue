<script setup lang="ts">
/**
 * The template's principle card: translucent white panel, label pinned to the
 * top in grey, the statement itself pushed to the bottom in white.
 */
defineProps<{ label?: string }>()
</script>

<template>
  <div class="sg-card">
    <p v-if="label" class="sg-card-label">{{ label }}</p>
    <div class="sg-card-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.sg-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  padding: 40px 48px 56px;
  background: var(--sg-surface-raised);
  border-radius: var(--sg-radius);
}

.sg-card-label {
  margin: 0;
  font-size: var(--sg-h3-size);
  font-weight: 700;
  line-height: 1.32;
  letter-spacing: -0.02em;
  color: var(--sg-content-secondary);
}

.sg-card-body {
  font-size: var(--sg-h3-size);
  font-weight: 700;
  line-height: 1.32;
  letter-spacing: -0.02em;
  color: var(--sg-content-primary);
}

.sg-card-body :deep(p) {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  color: inherit;
}
</style>
