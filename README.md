# Cool Stuff Sticker Sheet

A preview wall of coded animations. Each card runs the real build live and
carries a number in the corner, so a reviewer can call them out by number
("number 1 on the home page, number 2 on the events page").

- **`index.html`**: the grid. Numbered cards; click one to expand in a lightbox.
- **`all.html`**: the reel. Every animation at full size, stacked to scroll through.

## Add a new animation

1. Drop its self-contained HTML into `animations/`.
2. Add an entry to the array in `data.js` (this is the single source of truth).

The number on each card is just its position in that array, so reordering the
array renumbers the sheet. Set `status: 'soon'` for a placeholder slot with no
build yet (no `src` needed).

## Hosting

Plain static files, no build step. Published with GitHub Pages. The pages carry
a `noindex` tag so they stay link-only (reachable if shared, not search-indexed).

Built by Vicky · Code/+/Trust
