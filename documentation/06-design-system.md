# Design system

The site should read like a calm, trustworthy hospital notice board: plain words, real photos, clear phone numbers, no marketing decoration. Any new page must look like it was always part of the site.

## Tokens

### Colours

| Token | Hex | Use |
| --- | --- | --- |
| Paper (page background) | `#FAF8F4` | `body`, alternating sections |
| Surface | `#FFFFFF` | Cards, header, white sections |
| Ink (text) | `#1C2321` | Main text, footer background |
| Muted text | Tailwind `stone-500` / `stone-600` | Secondary text |
| Line | `#E7E3DA` | Borders, dividers |
| Line strong | `#D8D3C8` / `#CFC9BC` | Inputs, secondary button border, card hover |
| Primary (teal) | `#0F766E`, hover `#0B5D57` | Primary buttons, links, active nav, slip rule |
| Teal tint | `#E8F3F1` | Doctor initials background |
| Emergency red | `#C62828` (text/button), `#8E1C1C` (label) | Emergency numbers and buttons only |
| Notice amber | bg `#FFF8E6`, border `#F1DFAE`, left `#C98A00`, text `#5C4200` | `card-notice-amber` warnings |
| Photo placeholder | `#EFEBE3` | `Photo` when an image is missing |

Tailwind also has `brand-*` (teal scale), `ink`, `paper`, `hospital.*` and `emergency.*` in `tailwind.config.js`. Most pages use the hex values directly in class names (`text-[#1C2321]`); follow the file you are editing.

### Fonts

Loaded from Google Fonts in `index.html`.

| Role | Font | Tailwind |
| --- | --- | --- |
| Headings | **Source Serif 4** (600) | `font-heading` (all `h1`–`h3` by default) |
| Body | **Inter** | `font-sans` (default) |
| Marathi | **Mukta**, then Noto Sans Devanagari | applied automatically in Marathi mode; `font-marathi` |

### Spacing and layout

- Page width: `max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8`.
- Section padding: `py-12 sm:py-16`.
- Corners: cards `rounded-lg` (10px), buttons `rounded-lg` (8px).
- Shadows: none, or `shadow-card` at most. Cards use borders, not lift.

## Components

| Component | File | Use |
| --- | --- | --- |
| `PageIntro` | `components/ui.tsx` | Top of every public page: `title`, `intro`, optional `image` + `imageAlt`, optional children (buttons). |
| `SectionTitle` | `components/ui.tsx` | `h2` with optional one-line `sub`. |
| `Photo` | `components/ui.tsx` | Lazy image with a plain placeholder if the file is missing. |
| `DoctorPhoto` | `components/ui.tsx` | Doctor photo; shows initials on a teal tint if the file is missing. |
| `DateCalendar` | `components/DateCalendar.tsx` | Month calendar for booking; disables past days and days with no OPD. |
| `OpdWeek` | `components/OpdWeek.tsx` | Weekly OPD table on doctor profiles, loaded from the API, with a text fallback. |
| `TokenSlip` | `components/TokenSlip.tsx` | A5 slip (559 × 794 px) captured into a PDF. Inline styles on purpose (html2canvas). |
| `Header` / `Footer` | `components/` | Read all hospital details from `config/hospital.ts`. |
| `FloatingLanguageSwitcher` | `components/` | Bottom bar on phones: call emergency + book (or directions on `/book`). |

### CSS classes (`src/index.css`)

| Class | What |
| --- | --- |
| `btn-primary` | Teal filled button, 44 px tall. One per area, for the main action. |
| `btn-secondary` | White button with border. Secondary actions, phone links. |
| `btn-emergency` | Red filled button. Only for calling emergency. |
| `card-clean` | White card with a thin border, firmer border on hover. |
| `card-notice-amber` | Amber notice with a left rule, for "please note" messages (offline booking, unpublished fee). |
| `eyebrow` | Small teal line above a hero title. Use sparingly (home hero only). |

## Rules

1. **No chips, badges, pills or tags.** Show information as plain text or a table row.
2. **No uppercase micro-labels** above headings (the footer column titles are the only exception).
3. **No gradients, glows, blurred blobs or animated counters.**
4. **No fake numbers or fake content.** No invented stats, reviews, awards or "trusted by 10,000+ patients". If a number is not confirmed by the hospital, leave it out.
5. **No buttons that do nothing.** If a form cannot be saved yet, say so; do not show a fake "Saved" message.
6. **Plain words.** "Book an appointment", "Call reception", "Ask at reception". Avoid jargon and English medical terms where a simple word exists. Short sentences.
7. **Bilingual always.** Every visible string has English and Marathi. Use `isMr ? '…' : '…'`, a `L(en, mr)` helper, or `locales/*.json`. Marathi uses Marathi digits where the rest of that sentence does.
8. **Hospital details come from `config/hospital.ts`.** Never type a phone number, email, address or the hospital's name into a page.
9. **Phone numbers are links** (`tel:`), big enough to tap, and the emergency number is always easy to find.
10. **Tap targets at least 44 px** (`min-h-[44px]`, buttons already are).
11. **Test at 390 px wide** (common phone) and on desktop (1280 px). No horizontal scrolling, no text cut off, Marathi text wraps cleanly.
12. **Real photos only**, with meaningful `alt` text in both languages.
13. **Accessible:** one `h1` per page, labelled form fields, `aria-label` on icon-only buttons, visible focus.
