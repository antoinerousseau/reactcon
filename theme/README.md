# slidev-theme-shotgun-slides

Slidev theme matching Shotgun's [`[Template] Slides`](https://www.figma.com/slides/JbZGcU32ody4omFuhskeUV/-Template---Slides) Figma deck — Monument Extended display type, Space Grotesk text, `#1b1b1b` ground, and the four-colour gradient glow bleeding off one edge.

## Use

```md
---
theme: ./theme
canvasWidth: 1920
---
```

`canvasWidth: 1920` matters. The theme is sized in the Figma artboard's own
pixels, so every number in `vars.css` and the layouts is the number in the
design. Drop it and the type scale will be twice the intended size.

Dark only — the template has no light mode.

## Tokens

`styles/vars.css` mirrors the Figma file's `Shotgun Slides` variable collection
and text styles:

| Figma | Token |
| --- | --- |
| Black / White / Grey | `--sg-black` `--sg-white` `--sg-grey` |
| Color / Color 2 / Color 3 / Pink | `--sg-teal` `--sg-peach` `--sg-periwinkle` `--sg-pink` |
| Title (Monument Black 96, upper) | `--sg-title-size` |
| Header 1–3 (Space Grotesk Bold) | `--sg-h1-size` … `--sg-h3-size` |
| Body 1–3 (Space Grotesk Medium) | `--sg-body-1-size` … `--sg-body-3-size` |
| Note (Space Grotesk Regular 20) | `--sg-note-size` |

Layout grid: 128px margins, 64px gutters, 1664px of content, footer at y=994.

## Layouts

| Layout | Template slide | Notes |
| --- | --- | --- |
| `cover` | 1 + 2 | Logo, Monument headline |
| `section` | 2–5 | Divider: Monument headline + one-line description |
| `default` | 9 | Slide title, then content |
| `statement` | 6 | Big claim left, elaboration under `::right::` |
| `split` | 7 | Label left, stacked content under `::right::` |
| `two-cols-header` | 8, 16 | Title across the top, `::left::` / `::right::` below |
| `image-right` | 12, 13 | Text left, 824px media square under `::right::` |
| `media` | 15 | Full-bleed media + `::caption::`, no footer |
| `cards` | 11 | Title, then `<Card>`s under `::cards::` |
| `fact` | 18 | One number in Monument + explanation |
| `quote` | 32 | Centred avatar, quote, attribution |
| `end` | — | Closing bookend, cover treatment |

Every layout takes a `glow` prop: `bottom` (default on most), `top-right`,
`top-left`, `cover`, or `none`. `image-right` also takes `fit: cover | contain`
— use `contain` for portrait sources like phone recordings.

## Components

```md
<Card label="Treat the network as optional">

Scan against SQLite. Sync is an outbox.

</Card>
```

```md
<Badge variant="positive">checked_in</Badge>
<Badge variant="warning">still_loading</Badge>
<Badge variant="negative">unknown</Badge>
```

The template palette has no red or green, so the accents carry the semantics:
teal reads positive, peach cautionary, pink negative. Variants: `default`,
`accent`, `positive`, `negative`, `warning`, `informative`.

`<SlideGlow>`, `<SlideFooter>`, `<ShotgunLogo>` and `<SlideShell>` are the
internals the layouts are built from; you rarely need them in markdown.

## Assets

`assets/glow-*.webp` are exported from the Figma file at each placement's
blur-inclusive render bounds, which is why `SlideGlow` positions them at
hard-coded boxes rather than percentages. `styles/fonts/` holds Monument
Extended; Space Grotesk comes from Slidev's font loader.
