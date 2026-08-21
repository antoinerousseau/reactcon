# slidev-theme-decibel

Slidev theme built from Shotgun's [Decibel](https://github.com) design system — Backstage tokens, Inter, violet accent, cyan→violet gradient.

## Use

```md
---
theme: ./theme
---
```

Dark is the default (`colorSchema: dark`). Toggle light mode in the Slidev UI.

## Layouts

| Layout | Notes |
| --- | --- |
| `cover` | Title slide, optional `background`, equalizer mark |
| `intro` | Opening slide with optional background |
| `section` | Section divider |
| `statement` | Centered claim |
| `quote` | Quote with gradient rule |
| `fact` | Large statistic |
| `end` | Closing slide |
| `two-cols-header` | Header + two surface cards |

## Components

```md
<Badge variant="accent">scan</Badge>
<Badge variant="positive">checked_in</Badge>
<Badge variant="warning">still_loading</Badge>
<Badge variant="negative">unknown</Badge>
```

Variants: `default`, `accent`, `positive`, `negative`, `warning`, `informative`.
