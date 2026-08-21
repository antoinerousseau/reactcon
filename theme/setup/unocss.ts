export default () => ({
  shortcuts: {
    'bg-main': 'bg-[var(--decibel-surface-primary)] text-[var(--decibel-content-primary)]',
    'border-main': 'border-[var(--decibel-border-quaternary)]',
  },
  theme: {
    fontFamily: {
      title: '"Monument Extended", sans-serif',
    },
    colors: {
      accent: 'var(--decibel-content-accent)',
      surface: {
        primary: 'var(--decibel-surface-primary)',
        secondary: 'var(--decibel-surface-secondary)',
        tertiary: 'var(--decibel-surface-tertiary)',
      },
      content: {
        primary: 'var(--decibel-content-primary)',
        secondary: 'var(--decibel-content-secondary)',
        tertiary: 'var(--decibel-content-tertiary)',
        accent: 'var(--decibel-content-accent)',
        negative: 'var(--decibel-content-negative)',
        warning: 'var(--decibel-content-warning)',
        positive: 'var(--decibel-content-positive)',
        informative: 'var(--decibel-content-informative)',
      },
    },
  },
})
