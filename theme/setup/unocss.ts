export default () => ({
  shortcuts: {
    'bg-main': 'bg-[var(--sg-surface)] text-[var(--sg-content-primary)]',
    'border-main': 'border-[var(--sg-border-subtle)]',
  },
  theme: {
    fontFamily: {
      title: '"Monument Extended", sans-serif',
      sans: '"Space Grotesk", sans-serif',
    },
    colors: {
      accent: 'var(--sg-content-accent)',
      teal: 'var(--sg-teal)',
      pink: 'var(--sg-pink)',
      peach: 'var(--sg-peach)',
      periwinkle: 'var(--sg-periwinkle)',
      red: 'var(--sg-red)',
      surface: {
        DEFAULT: 'var(--sg-surface)',
        raised: 'var(--sg-surface-raised)',
      },
      content: {
        primary: 'var(--sg-content-primary)',
        secondary: 'var(--sg-content-secondary)',
        accent: 'var(--sg-content-accent)',
        inverse: 'var(--sg-content-inverse)',
      },
    },
    borderRadius: {
      card: 'var(--sg-radius)',
    },
  },
})
