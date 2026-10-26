# leomuzicarvalho.github.io

A short presentation about me, built to share on screen during calls with recruiters.
Plain HTML, CSS and JS. No build step.

## Run it locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Presenting

| Key | Action |
| --- | --- |
| → ↓ Space PageDown | Next slide |
| ← ↑ Shift+Space PageUp | Previous slide |
| Home / End | First / last slide |
| F | Fullscreen |
| T | Switch dark / light theme (dark is the default, the choice is remembered) |

Every slide has its own link: `/#4` opens slide 4. On a phone, swipe.

## Editing

- `index.html`: the slides, one `<section class="slide">` each.
- `assets/theme.css`: colours (dark and light), fonts, sizes, spacing and motion. Change the look here.
- `assets/deck.css`: layouts and slide mechanics.
- `assets/deck.js`: navigation and scaling.

Slides are drawn on a 1600 × 900 canvas (640 × 1200 on phones) and scaled to fit the window,
so sizes in `theme.css` are canvas pixels.

## Save as PDF

Open the page in Chrome, print, choose "Save as PDF", set margins to none and turn on
background graphics. Each slide becomes one page.
