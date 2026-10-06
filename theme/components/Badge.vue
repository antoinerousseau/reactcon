<script setup lang="ts">
/**
 * Status pill. The template palette has no red/green, so the accent colours
 * carry the semantics: teal reads positive, peach cautionary, and negative
 * uses --sg-red, a red added to match the palette.
 */
withDefaults(defineProps<{
  variant?: 'default' | 'accent' | 'positive' | 'negative' | 'warning' | 'informative'
}>(), {
  variant: 'default',
})
</script>

<template>
  <span class="sg-badge" :data-variant="variant">
    <slot />
  </span>
</template>

<style scoped>
.sg-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: var(--sg-radius);
  font-size: var(--sg-note-size);
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0;
  white-space: nowrap;
}

.sg-badge[data-variant='default'] {
  background: var(--sg-surface-raised);
  color: var(--sg-content-secondary);
}

.sg-badge[data-variant='accent'],
.sg-badge[data-variant='positive'] {
  background: color-mix(in srgb, var(--sg-teal) 18%, transparent);
  color: var(--sg-teal);
}

.sg-badge[data-variant='warning'] {
  background: color-mix(in srgb, var(--sg-peach) 18%, transparent);
  color: var(--sg-peach);
}

.sg-badge[data-variant='negative'] {
  background: color-mix(in srgb, var(--sg-red) 18%, transparent);
  color: var(--sg-red);
}

.sg-badge[data-variant='informative'] {
  background: color-mix(in srgb, var(--sg-periwinkle) 18%, transparent);
  color: var(--sg-periwinkle);
}
</style>
