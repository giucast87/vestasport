# Vesta Sport — website

Static site. No build step, no dependencies: upload the whole folder to any
web host (Netlify, Vercel, Altervista, Aruba, a plain Apache/Nginx server…)
or just double-click `index.html` to open it locally.

## Pages

| File | Menu entry |
|---|---|
| `index.html` | Home |
| `team.html` | iRacing Team |
| `partners.html` | Partners |
| `contact.html` | Contact |
| `apply.html` | Driver application |
| `privacy-policy.html` | (footer link — placeholder text) |

Layout, navigation pattern (top bar that scrolls away + slide-in drawer),
full-bleed image heroes, rounded "update" panels on a glowing background,
roster page, partner cards and form styling follow the reference site you
picked. The webshop entry was left out.

## What to fill in

Everything that needs your input is marked with an HTML comment or a dashed
placeholder box:

- **`team.html`** — the roster is a set of `Name / Role` placeholders, plus
  three counters (`data-count="0"`). Put the real crew and numbers in.
  The small coloured tile before each name is where a country flag or a
  portrait goes.
- **`partners.html`** — three placeholder partner cards. Duplicate or delete
  the `.partner` block per partner, drop the logo into `.plogo`.
- **Footer** — four `PARTNER` slots, replace each `<div class="fslot">` with
  an `<img>`.
- **`contact.html`** — the phone number is a dummy (`+39 000 000 0000`).
- **`privacy-policy.html`** — placeholder text, needs a real GDPR notice
  before going live.
- **Forms** — `apply.html` and `contact.html` are styled but not wired to a
  back end. Point them at a form service (Formspree, Netlify Forms, Web3Forms)
  or your own endpoint; right now submitting shows a notice.

## Images

`assets/img/` holds the photos you sent, cropped for each slot. They are
around 650–700 px wide, which is fine for the cards but a little soft on a
large screen for the full-width heroes (`hero.jpg`, `*-hero.jpg`,
`footer.jpg`). If you have the originals at full resolution, drop them in
with the same file names — nothing else needs to change.

## Regenerating

`_source/` contains the small Python generator used to build the pages
(shared header/footer). Run `python3 pages.py` from inside `_source/` after
copying it back to the site root if you'd rather edit there. Editing the
`.html` files directly is perfectly fine too — the generator is optional.

## Colours & type

Set in `assets/style.css` under `:root` — Vesta blue `#2f62ff`,
Vesta red `#e0102b`, black background. Font: Poppins (Google Fonts).
