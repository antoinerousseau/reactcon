import { defineShikiSetup } from '@slidev/types'

export default defineShikiSetup(() => {
  // The deck is dark-only, so both schemes resolve to the same theme.
  return {
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-dark',
    },
  }
})
