<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'accent' | 'positive' | 'negative' | 'warning' | 'informative'
}>(), {
  variant: 'default',
})
</script>

<template>
  <span class="decibel-badge" :data-variant="variant">
    <slot />
  </span>
</template>

<style scoped>
.decibel-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: var(--decibel-radius-2xs);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25;
  white-space: nowrap;
  border: 1px solid transparent;
}

.decibel-badge[data-variant='default'] {
  background: var(--decibel-fill-secondary);
  color: var(--decibel-content-secondary);
}

.decibel-badge[data-variant='accent'] {
  background: color-mix(in oklch, var(--decibel-fill-accent) 22%, transparent);
  color: var(--decibel-content-accent);
  border-color: var(--decibel-fill-accent);
}

.decibel-badge[data-variant='positive'] {
  background: color-mix(in oklch, var(--decibel-content-positive) 16%, transparent);
  color: var(--decibel-content-positive);
}

.decibel-badge[data-variant='negative'] {
  background: var(--decibel-fill-negative);
  color: var(--decibel-content-negative);
}

.decibel-badge[data-variant='warning'] {
  background: color-mix(in oklch, var(--decibel-content-warning) 16%, transparent);
  color: var(--decibel-content-warning);
}

.decibel-badge[data-variant='informative'] {
  background: color-mix(in oklch, var(--decibel-content-informative) 16%, transparent);
  color: var(--decibel-content-informative);
}
</style>
