# SPEC: jinsongyi-ca.github.io/works

Build spec for Sonny Jin's résumé website. Everything here has been decided with Sonny; do not redesign. Where this file and a prototype disagree, this file wins. Where this file is silent, follow the prototypes, then `brand/BRAND.md`.

## 2026-11 redesign (overrides everything below where they differ)

Driven by a cold HR / hiring-manager review. Positioning, structure and copy were confirmed with Sonny; do not reopen them.

- **Positioning.** A strategist who turns data into proposals and strategy, for mainstream markets. Not "a multicultural marketer". Hero line: "I turn market data into strategies and proposals that win." Subline: "Marketing strategy, partnerships and product marketing across live entertainment, consumer brands and automotive. MBA, Schulich. Toronto." The old line "When the answer isn't there yet, I go find it." moves to the foot of Contact as an echo.
- **The site tells the same story as the résumé.** Titles, dates and number definitions match the résumé word for word. Every big number carries a footnote (period, source, or "projected"). Never imply cause (Live Nation: "Since then" states order, not cause). No negatives about past employers or colleagues. No dashes joining sentences.
- **Page:** Hero → Worked with (9 brands actually served; pitched-only brands appear as text inside the cases) → Highlights (card grid) → Bridge → Timeline → Contact. The pinned highlights, the ability summary grid ("Proven, six times") and number count-up are removed. Target: about 6 screens at 1440×900.
- **Highlights.** Six cards in a 12-column grid: Maple Diversity, Live Nation, NEO SOUL (380px, 4 columns each), then SparkLease, Complete Purchasing Services, CAOTAI Music (220px). Card: case photo under a dark veil, 3px accent bar, company, role and dates, the number and its label. Hover (0.25s): the image lifts to 1.03, the hook and "Open case →" rise in. Touch screens always show the hook. Two columns at 768–1023px, one under 768px.
- **Case panel.** A dialog (`role="dialog"`, `aria-modal`), centred, max 1120px; a full-screen sheet under 768px. Header (company, role, description, hook), THE GAP / THE MOVE / THE RESULT side by side (stacked on phones, all three readable at once), the number with its footnote, ability tags, "See the work →" (opens the Cover Flow viewer), Previous / Next case. Opening pushes `#case-<id>` to history; Esc, ×, a backdrop click and the browser Back button close it; focus moves in, Tab cycles inside, focus returns to the card. Ids: maple, live-nation, neo-soul, sparklease, cps, caotai. Old links `#maple`, `#aramark`, `#neo-soul/evidence` still work (`/evidence` or `/work` also opens the viewer).
- **Personal system everywhere.** Paper, gold, serif. Client colours appear only as the 3px card bar and the beat label markers. Gold for text is darkened for contrast: `--gold-text #9A7B4C` (large type, 3.8:1) and `--gold-small #7D6236` (small type, 5.5:1).
- **Timeline.** Adds "Independent ventures" (2024–2025) and fills "Next". "Told above ↑" became "Read the case: <name> →", which opens the panel. Toolkit gains "Languages · English and Mandarin (bilingual)".
- The copy itself lives in `index.html`; the case text there is the source of truth.

## 0. Read first

| File | What it is |
| --- | --- |
| `design/opening.html` | Approved prototype of the opening screen. Self-contained. Open it in a browser and move the mouse. |
| `design/highlights.html` | Approved prototype of the highlights section, summary screen and work panel. Uses `../img`, `../fonts`, `../seal.svg`. |
| `brand/BRAND.md` | The brand book: positioning, voice, colour layers, type, interaction, logo rules. |
| `brand/tokens.json` | Frame colours, type styles, spacing. |
| `brand/site-colours.json` | `gold-metal`, the six takeover palettes, client colours for the work panel. |
| `brand/logos/` | Seal, wordmark, the 金 glyph, brush stroke (SVG). |
| `img/<case>/*.webp` | Curated, already compressed work images. |
| `fonts/` | Caladea Regular and Bold (WOFF2); `LXGWWenKai-sub.woff2` covers only 金松毅草台回声. |

The current `index.html` is an old v1 that Sonny rejected. Replace it. `stroke.svg` is no longer used.

## 1. Goal and audience

A results-driven résumé site, not a designer portfolio. Recruiters and hiring managers in marketing, brand and business strategy roles. One message carries the whole site: **When the answer isn't there yet, I go find it.** Every screen proves it with a problem, what Sonny did, and the result.

Desktop first (1280 to 1920 wide). Mobile must not break (single column, no pinning, no custom cursor), but it is not designed yet; keep it simple and readable.

## 2. Tech

- Plain static site for GitHub Pages: `index.html`, `css/site.css`, `js/site.js`. No framework, no build step, no external CDNs.
- All text must be in the HTML, so it reads without JavaScript and is indexable. JavaScript only adds behaviour.
- Fonts self-hosted from `fonts/`. Caladea lacks arrow glyphs: set → ↗ ↑ ↓ in a fallback (`Arial, Helvetica, sans-serif`), as the prototype does with `.ar`.
- Images lazy-loaded with width and height set. Keep total first load under 1 MB (fonts and opening only).
- Respect `prefers-reduced-motion` everywhere: no entrance sequence or 金 write-in, no marquee motion (the brand names sit still and wrap), no idle light drift or cursor light, no count-up, no rise-in, instant colour changes, native cursor. Beat stepping still works, with instant changes.
- Hide the custom cursor on touch (`hover: none`).
- Accessibility: real buttons and links, visible focus states, the work panel and lightbox trap focus and close on Esc, `aria-label`s as in the prototype, alt text on images.
- Meta: title "Sonny Jin · Marketing, Brand & Business Strategy", description from the positioning line, favicon `favicon.svg`, a new `og.png` (1200×630) in the new design: paper background, SONNY JIN in champagne, positioning line, seal.
- URLs: the repo is `jinsongyi-ca/works` (lowercase). Every absolute URL (og:url, og:image, canonical) uses `https://jinsongyi-ca.github.io/works/`. `<link rel="canonical" href="https://jinsongyi-ca.github.io/works/">` is in the head.

## 3. Page structure

1. **Opening** (one screen)
2. **Highlights** (pinned section, six stories) and **summary**
3. **Bridge line**, then the **timeline** ("the whole road")
4. **Close** (contact, résumé)

Sticky top bar on every part: seal + SONNY JIN (left), HOME · HIGHLIGHTS · TIMELINE · CONTACT · RÉSUMÉ ↓ (right, caps; HOME jumps back to the opening). On the opening it shows only the seal and RÉSUMÉ ↓; once the visitor scrolls past about 40% of the opening, SONNY JIN and the other links fade in (0.4s), and scrolling back to the top hides them again. RÉSUMÉ ↓ downloads `files/sonny-jin-resume.pdf` as "Sonny-Jin-Resume.pdf". Its colours follow the current background. Under 768px wide the bar hides on scroll down and returns on scroll up (and whenever it holds focus), so it never covers content; under 480px only the seal shows on the left.

## 4. Opening

Based on `design/opening.html`, lightened.

- Background `paper` `#FAFAF8`. No eyebrow line, no abilities row (they live in the highlights and the summary).
- Name: SONNY JIN, Caladea, very large, solid `champagne` `#C3A986`. It does not react to the cursor.
- (Song-yi): about 1/8 of the name size, `champagne-deep`, floating above SONNY with its right edge aligned to SONNY's right edge (`right:0; left:auto` inside the relative `.w1` span, top unchanged; outside the text flow, so the name's spacing is unaffected). Very faint grey (#DEDCD6) by default; turns `champagne-deep` (0.3s) while the pointer is over the name. On touch devices and under reduced motion it shows permanently.
- 金 松 毅: vertical, LXGW WenKai, ink, to the right of the name; the first and last characters align with the top and the baseline of the name. No seal under it.
- Positioning, two lines: "When the answer isn't there yet," in `ink-muted`; "I go find it." bold, solid `champagne`.
- Self-intro, one line on desktop (Caladea 17px, `ink-muted`): "Four years in live entertainment, marketing and automotive."
- Logo marquee at the foot. One fixed label at the left end of the row, "WORKED WITH" over "PITCHED TO" on two lines, in small caps, with the logos vertically centred on it (`ink-muted`); it never moves. Only the logos scroll, in a track to its right: the track starts about 40px after the label, fades in over its first 48px (so logos slide out from behind the label) and fades out at the right edge. Inside the track, in `img/logos/manifest.json` order: the 9 "worked" logos, a separator, the 12 "pitched" logos, and another separator at the loop seam. The separator is a 4px dot in the `line` colour with the normal logo gap on each side; no text in the track. Each logo is an `<img>` of its SVG with `alt` set to its display name and width and height from the manifest; the manifest height is the CSS height (width auto). About 56px between items, vertically centred on one line, about 70s per loop, seamless (two identical halves; the second is `aria-hidden`), paused while the row is hovered. Default `filter: grayscale(1) opacity(.6)`; a hovered logo goes to full colour and scales 1.08 (0.25s). Logo files are never recoloured, cropped, stretched or rotated. Under 768px: the label sits on its own line above the track, logos at 80% height. Under reduced motion it does not scroll: the label, then all logos wrapped on a few lines in manifest order with one dot between the two groups (and the opening chevrons are hidden).
- Scroll cue: only the two small bouncing V chevrons, centred above the marquee (126px from the bottom). No SCROLL word.
- Background 金 (`brand/logos/sj-jin-glyph.svg` path): very large, almost invisible (`#F4F4F0`), pushed right so it bleeds off the edge. Around the cursor (radius ~250px, lerped) it shows `gold-metal`, a still gradient. No sparkles, no moving glint.
- Idle light: with no pointer movement for 3s, or on touch devices, the gold light drifts over the 金 on its own along a slow Lissajous path, like a slow searchlight: about 30s per loop, amplitude about 0.18 of the glyph's width and height, follow factor 0.03. Any pointer movement hands control back to the cursor.
- Cursor: 10px `champagne-deep` dot; becomes a 44px ring over links and buttons.

### Entrance (once per visit)
Flagged in `sessionStorage` from the head (class `enter` on `<html>`), so it plays once per visit; skipped for deep links and under reduced motion.
- 0.0s: the background 金 is written stroke by stroke in correct stroke order, slowly and deliberately (about 2.9s of writing): left falling and right falling of the roof, upper horizontal, middle horizontal, centre vertical, left dot, right dot, bottom horizontal. Built as an SVG mask over the glyph path: one thick round-capped centreline per stroke (`pathLength=1`), `stroke-dashoffset` animated with cubic-bezier(.45,.05,.35,1). Durations follow stroke length: roof strokes, vertical and bottom horizontal 0.55s; upper and middle horizontals 0.4s; the dots 0.25s. Each stroke starts when the previous one is about 80% done (starts 0, 0.44, 0.88, 1.2, 1.52, 1.96, 2.16, 2.36s). The finished glyph shows in `gold-metal`, holds 0.6s, then fades to the ghost tone over 1.2s (3.51 to 4.71s) and the cursor light takes over.
- In parallel: SONNY JIN rises 24px and fades in at 0.6s; 金松毅 drops in 12px at 0.9s, like a stamp; "When the answer isn't there yet," fades in at 1.4s; "I go find it." at 1.8s; the self-intro, the marquee and the chevrons at 2.3s.

## 5. Highlights

Build as `design/highlights.html`. Copy and colours below are final.

### Behaviour
- One section, pinned (`position: sticky`) at 100vh. One beat at a time: each highlight has three steps (GAP, MOVE, RESULT), one screen of scroll each (18 steps → section height 1900vh). One scroll gesture (wheel, trackpad fling, swipe, ↓ / J / Page Down / Space) moves exactly one step: GAP, then MOVE, then RESULT, then the next highlight's GAP. Momentum from the same gesture is ignored. Scrolling down from the last RESULT goes to the summary; scrolling up from the first GAP goes back to the opening; scrolling up from the summary lands on CAOTAI's RESULT.
- The current beat is open, full size and opacity; it rises 24px and fades in (0.6s, cubic-bezier(.2,.8,.2,1)). Earlier beats collapse to their label chip only, at 50% opacity, stacked above it; clicking (or Enter on) a collapsed chip reopens that beat. Later beats wait, hidden. The number (with its count-up) and the work card appear with RESULT; the ability tags light up from MOVE.
- Rail clicks and `#<id>` deep links land on that highlight's GAP; `#<id>/evidence` lands on its RESULT and opens the work panel.
- Image panel: in the right column, full stage height. Photo panels (`img/hero/<id>.webp`: neo-soul, maple, sparklease, caotai): object-fit cover, object-position center top, shown fully and sharply. Left edge only: the field colour (opaque) fading to transparent over the first 22% of the panel width. Behind the headline number and label (which sit over the lower part): the field colour from about 90% at the bottom to transparent over the lower 40%, eased so it stays dense where the number sits. Dark photo fields: full opacity under a 25% field-colour veil. SparkLease (light field): no veil, plus a 1px hairline in the `line` colour at the panel's left edge. Gentle continuous drift on photos while the highlight is active (scale 1.03 to 1.07 with a slight pan, 16s, alternating). Logo panels (Live Nation, Aramark): the panel is filled with the field colour and shows the white logo (`img/hero/live-nation-logo.svg`, `img/hero/aramark-logo.svg`) centred horizontally at 72% of the panel width, its vertical centre at about 38% of the panel height, never cropped, no drift; the number gradient stays. Crossfade 0.6s. Only where pinning applies (never under 768px).
- The whole image panel is clickable and opens the work. On hover the image scales to 1.03 over 0.4s and the custom cursor becomes a 112px ring labelled VIEW THE WORK (small caps, 10px). Keyboard: W opens the work for the current highlight.
- Over a highlight the top bar carries a band of the field colour that fades out downward, so its links read over the photo.
- Background and text colours crossfade 0.6s between highlights.
- Left rail: employer names in their own case: NEO SOUL, Maple Diversity, Live Nation, SparkLease, Aramark, CAOTAI Music. The work panel header and the summary grid use the same short names; only the timeline uses full names. Active 32px bold at full opacity; others 17px at about 42%. Thin vertical hairline at the left. Click jumps to that highlight. No years.
- Counter: 01 / 06, small caps in `soft`, at the top of the left rail (112px from the top).
- Bottom right on every highlight: a SKIP TO TIMELINE ↓ link in `soft` (replaces KEEP SCROLLING), so keyboard and mouse users can leave the highlights from any of them.
- Two lines above each hook. Line 1, role line: small caps, `soft`, one row: ROLE · YEARS · QUALIFIER (if any). Line 2, company line: sentence case, 13px, `soft` at 70% opacity, one line at 1440 wide (wraps on narrower screens): company name · description.
- Hook: Caladea, about 50px, line-height 1.08.
- Beat body text: Caladea 22px, line-height 1.5, max width 32em (and never wider than the text column); 20px under 1400px wide; 18px under 768px.
- Beat label (THE GAP / THE MOVE / THE RESULT): caps on an **accent chip** (accent fill, `chipText` text, 2px radius).
- Number: very large (clamp 72 to 116px), counts up once (1.2s ease-out cubic) when THE RESULT appears. A currency prefix is set small and raised. An **accent marker band** runs across the lower third (62% to 92% of the line box); the part of the digits over the band switches to `chipText` (two-stop text gradient with background-clip: text; see prototype). Label under it in small caps, `soft`.
- Only the headline number sits in the number column. No supporting figures; THE RESULT text carries the other figures.
- Abilities row at the foot: the tags this story proves get full opacity and an accent underline when THE MOVE appears; the rest at about 42%.
- Work card: at the top of the story column, above the title block (role line, company line, hook); the title and the beats sit below it. Visible from the first beat. Three slightly rotated, overlapping 54px thumbnails, an accent chip "SEE THE WORK →" and a count line. It breathes gently to invite a click (scale 1 to 1.025 with a soft accent glow, 3.2s loop); on hover or keyboard focus it scales to 1.05 and stops breathing, the thumbnails fan out, the arrow moves 5px, the border takes the accent. Opens the work. Off under reduced motion (no breathing).
- Pinning needs a window at least 1200px wide and 600px tall; below that the stories stack in plain scroll. Under 1400px wide the rail narrows and the number column keeps 270 to 300px. Under 940px, 880px and 760px tall the hook and spacing tighten (beat body text keeps its size) so the work card always clears the abilities row (checked at 1200×750, 1280×720, 1280×800, 1366×768, 1440×900, 1536×864, 1600×900, 1920×1080).
- Keyboard while the section is pinned: ↓ / J next beat, ↑ / K previous beat.
- Deep links: `#neo-soul`, `#maple`, `#live-nation`, `#sparklease`, `#aramark`, `#caotai`; the hash updates as you scroll (replaceState). `#<id>/evidence` opens that highlight's work panel on load.

### Colours (`brand/site-colours.json`)

| Highlight | Field | Text | Accent | chipText |
| --- | --- | --- | --- | --- |
| NEO SOUL | #0A0A0A | #FFFFFF | #D4AF37 | #0A0A0A |
| Maple Diversity | #09090B | #FFFFFF | #FF6B2C | #09090B |
| Live Nation | #E21836 | #FFFFFF | #000000 | #FFFFFF |
| SparkLease | #FAFAFA | #1F1F1F | #FABB00 | #1F1F1F |
| Aramark | #2F3A41 | #FFFFFF | #E7212E | #FFFFFF |
| CAOTAI Music | #000000 | #FFFFFF | #C3A986 | #14161A |

The accent is always a fill (chips, marker band, underline), never a text colour. Body text never takes the accent.

### Copy

**NEO SOUL** · role: CO-FOUNDER · 2016–2020
- Company line: NEO SOUL Entertainment · A pioneer in bringing East Asian live music to North America. Los Angeles.
- Hook: The most volatile industry. The fiercest competition. I started a company there anyway.
- THE GAP: Chinese students in the US had little to go out for. Chinese indie music was booming back home. Nobody connected the two.
- THE MOVE: We brought the artists to US stages. With no market data, I built forecasting and pricing models to pick venues, size cities and price tickets.
- THE RESULT: 19 concerts, forecasts within 5%. US$600K revenue, US$250K raised across two rounds, and a US$6.3M valuation in two years.
- Number: US$ 6.3 M · VALUATION IN TWO YEARS
- Abilities: Problem solving, Analysis, Execution

**Maple Diversity** · role: STRATEGIC PARTNERSHIPS MANAGER · 2023–2024
- Company line: Maple Diversity Communications · Canada's leading multicultural marketing agency.
- Hook: Nearly one in four Canadians was born abroad. Most brands still spoke to one Canada.
- THE GAP: Brands knew multicultural Canada mattered, but few had the data or cultural know-how to reach it. Maple had to prove the case.
- THE MOVE: I turned NielsenIQ, Vividata and Statistics Canada data into a case for each brand, pitched 11 brands, and automated prospecting to focus on proposals.
- THE RESULT: Signed IKEA and Tissot myself; won new projects from Aveeno, Listerine, Audi and Panasonic. Revenue up 14% year over year, localization costs down 25%.
- Number: +14% · REVENUE, YEAR OVER YEAR
- Abilities: Analysis, Strategy, Execution

**Live Nation** · role: TEAM LEAD, STRATEGY CONSULTANT · 2022–2023 · MBA CONSULTING ENGAGEMENT
- Company line: Live Nation Entertainment · The world's largest live entertainment company. Fortune 500.
- Hook: Seven of us. Seven reports. One roadmap the client kept.
- THE GAP: Live Nation wanted growth in markets it hadn't entered. Nobody had mapped what stood in the way.
- THE MOVE: I brought Live Nation on as a client and led seven people through the diagnosis: industry, business model, organization, execution.
- THE RESULT: A seven-year, multi-scenario roadmap projecting 36.8% CAGR in untapped markets. The client adopted it.
- Number: 36.8% · CAGR PROJECTED, UNTAPPED MARKETS
- Abilities: Problem solving, Analysis, Strategy

**SparkLease** · role: PRODUCT MARKETING MANAGER · 2026 · CONTRACT
- Company line: SparkLease · Canada's go-to Chinese-language car leasing platform, with 100,000+ annual active users.
- Hook: Carmakers didn't need another website. They needed shelf space.
- THE GAP: 100,000+ active users a year, and nothing packaged for the carmakers who wanted to reach them.
- THE MOVE: I grew organic leads with SEO and AI search, then turned the site's screen space into a tiered product for OEMs and dealers.
- THE RESULT: Leads up 19% a month, top five on Google. Seven cold pitches to BMW's agency, Mercedes‑Benz and GM brands; three shortlisted.
- Number: +19% · ORGANIC LEADS, MONTH OVER MONTH
- Abilities: Problem solving, Strategy, Execution

**Aramark** · role: PROGRAM MARKETING MANAGER · 2025
- Company line: Complete Purchasing Services, an Aramark company · Group purchasing for senior living, healthcare and education across Canada, for 50 years.
- Hook: Same events, every month. Planned from memory, every time.
- THE GAP: Our events repeated every month for 500+ client accounts, but there was no SOP. Every step lived in someone's memory.
- THE MOVE: I built an automated system in Smartsheet: enter the event date, and every action item appears with its own due date.
- THE RESULT: Project management time cut by more than half. I also helped run our 50th anniversary: clients, partner brands and a trade show in one room.
- Number: 50%+ · LESS PROJECT MANAGEMENT TIME
- Abilities: Problem solving, Execution
- Naming rule: the rail says Aramark; the company line and the timeline name the legal employer. Never a dash between the two names.

**CAOTAI Music** · role: ARTIST OPERATIONS MANAGER · 2021
- Company line: CAOTAI Music · An independent label and youth culture company in Beijing since 2006, with its own SXSW showcase.
- Hook: From a Beijing label to SXSW and The New York Times.
- THE GAP: 2021. Stages were closed, and a small Beijing label needed its artists heard outside China.
- THE MOVE: I ran content across platforms, plus festivals, distribution and brand partnerships.
- THE RESULT: One artist grew to 45,000 fans in five months. Top 5% on NetEase's indie chart, SXSW 2021, and a story in The New York Times.
- Number: 45K · FANS IN FIVE MONTHS
- Abilities: Strategy, Execution

### Summary screen (paper)
- Small caps: HIGHLIGHTS, IN SUM. Title: "Proven, six times." Sub: "Every ability on this page is backed by at least three of the stories above."
- Grid: 4 abilities (rows) × 6 highlights (columns, names in their own case, CAOTAI Music in English). Filled champagne square where proven, hollow `champagne-deep` outline where not. Squares pop in with a stagger when the screen enters. Hovering an ability row (its label or squares) lights that row's filled squares and the company names above them; hovering a company name lights that company's squares and the abilities they prove. Everything else dims.
- The same centred SCROLL cue as the opening (word plus two bouncing V chevrons) at the bottom of this screen.

## 6. The work: Cover Flow viewer

A full-screen viewer in the spirit of early iTunes Cover Flow. Opened by the work card, a click on the image panel, the W key or `#<id>/evidence`; each opening sends the GoatCounter event `work-<id>`.
- Opening: the page fades to near black (rgba(8,8,10,.94), 0.35s) with a slight blur behind. Header at the top left: employer name (caps) and THE WORK; × at the top right. Esc, × or a click on empty background closes it; focus returns to the work card. Focus stays inside the viewer while it is open.
- Layout: one work group at a time. Each group is a horizontal row a little shorter than the viewer (89% of its height), so the next row's title and the tops of its pieces peek in below, scaled to 0.92 at about a third of full opacity, as a prompt to scroll. The client chip (as before), group label and note are centred at the top of the row, in normal flow above the pieces, so a long or wrapped description is never covered or cut. One vertical wheel or trackpad gesture (or ↑ ↓) glides smoothly to the next or previous row, which scales up from 0.8 and fades in to fill the screen (0.7s, cubic-bezier(.2,.8,.2,1)) while the old one recedes; momentum from the same gesture is ignored. Rows snap one at a time.
- In a row the active item faces front, centred, at about 72% of the row height. Items to its left and right turn 55deg toward the centre (rotateY), sit back (translateZ -160px), overlap each other by about 70% of their width and are dimmed to 55% brightness. No frames or borders. Each item has a soft reflection below it (`-webkit-box-reflect`, 18% fading out over 30% of its height). Items are never wider than 86% of the row.
- Every row opens folded: its pieces fanned in one overlapping stack (each turned -28deg and set back, about 30% of each showing; flat, about 45%, under reduced motion and on phones), centred and never wider than the row, slightly dimmed. Hovering a piece lifts it 14px to full brightness. Clicking a piece (or Enter, or ← →) unfolds the row into Cover Flow with that piece in front.
- Interaction: hovering an inactive item lifts it 10px and brightens it to 80% (0.2s). Clicking an inactive item glides the row so it becomes the front item (0.45s, cubic-bezier(.2,.8,.2,1)). Clicking the front item expands it: contained, filling most of the screen, everything else fades; ← → move through that row; Esc or a click outside returns to the rows. Horizontal wheel, trackpad swipe, ← → keys and dragging move the current row; ↑ ↓ change rows. Keyboard focus rings show only for keyboard use.
- Spotify releases: the repo has no cover art matched to the five releases, so each release is a typographic tile (RELEASE, title, SPOTIFY ↗); expanded, the Spotify embed shows under it. The three local covers stay as image items. Press (NYT): a typographic tile (outlet in Caladea, year, READ ↗); expanded, it links out in a new tab.
- Expanded caption: "Group · n / total" (e.g. "Posters · 5 / 6").
- Reduced motion: no rotation or glide; rows are flat horizontal strips with instant switching. Under 768px: one row per screen, flat, swipe left and right.

Content:
- **NEO SOUL**, in this order: Posters: `poster-hyukoh`, `poster-dmob`, `poster-hhh`, `poster-madi`, `poster-sdy`, `poster-sunset`. Times Square · #NextNeoSoulArtist ("Our billboard poll on who to bring over next"): `timessquare-1`, `timessquare-2`. Venues ("19 concerts across the US"): `royale`, `wilbur`, `regency`, `chicago`, `mayan`, `wilbur-stage`. Releases: Spotify embeds `album/0hivH5g3UEx0sGSFIekNgn` (Wonder World), `album/3KJUv82FN4NRtWYbzW1eCf` (C.A.B Cypher), `track/2iHypimlBjipsM87Ssa2Mj` (Slurpee 思乐冰), `album/6rgJm6sg7XhwKISDlQdduT` (Zel, Vol. 1), `album/1wDFR8JIFUnkwrC5q0w2j6` (Papa!). Work card thumbnails `poster-hyukoh`, `timessquare-1`, `royale`; count line "19 pieces · Posters, Times Square, Venues, Releases".
- **Maple Diversity**, in this order: Aveeno chip (#4A3328 / white, "Lunar New Year campaign, Year of the Dragon"): `aveeno-1`, `aveeno-2`, `aveeno-3`. Neutrogena chip (#000000 / white, "Lunar New Year campaign, Chinese-language creative"): `neutrogena-1`. Listerine chip (#00857C / white, "New project from an existing client. Chinese and English versions"): `listerine` (Chinese version), `listerine-1`, `listerine-2`. Tissot chip (#E1251B / white, "Signed by Sonny"): `tissot-1`, `tissot-2`. IKEA chip (#0058A3 / #FFDB00, "Signed by Sonny · Online ordering for complete room sets, plus the promotion plan"): `ikea`. Work card thumbnails `aveeno-1`, `listerine`, `tissot-1`; count line "10 pieces · Aveeno, Neutrogena, Listerine, Tissot, IKEA". The hero panel image `img/hero/maple.webp` is the Aveeno Lunar New Year crop (795×1420).
- **Live Nation**: first, Final report ("Strategy Field Study, Schulich School of Business, for Live Nation Canada. Seven-year growth roadmap, adopted by the client"): `livenation/final-report.webp`, a transparent book mockup shown on the dark background with no box. Then The engagement ("Covers only; the full reports stay with the client"), text: "Seven reports across industry trends, business model, organizational structure and execution capability, ending in a seven-year growth roadmap with multiple scenarios." Images `team-1`, `team-2`. Work card: 3 pieces, thumbnails `final-report`, `team-1`, `team-2`.
- **SparkLease**: Search growth: `seo-traffic`, `seo-rankings`. The product ("Screen space, packaged and tiered"): `listing-insert`, `boost`. OEM pitches: `polestar`, `alfa-romeo`, `lotus`, `fiat`, `ford-cn`.
- **Aramark**: 50th anniversary · Vancouver ("At River Rock Casino Resort: our clients, the brands we represented and a trade show in one room"): `aramark/anniversary-50`. The count line uses "1 piece" (singular). More photos may be added later to `img/aramark/`.
- **CAOTAI Music**: SXSW 2021: `sxsw-lineup`, `sxsw-session`, `sxsw-stage`, then a press card: The New York Times, 2021, https://www.nytimes.com/2021/03/22/arts/music/sxsw-music-festival.html. Releases: covers `cover-horse`, `cover-milkyway`, `cover-sea`. Virtual concerts: `virtual-1`, `virtual-2`, `virtual-3`. Festivals and tour: `festival-stage`, `festival-set`, `hainan-fw`, `shanghai-fw`, `shanghai-fw-2`, `tour`, `radio`. Work card count line "17 pieces · SXSW 2021, Releases, Virtual concerts, Festivals and tour" (the Spotify embeds moved to NEO SOUL).

## 7. Bridge and timeline

Bridge (paper, generous space): "That's the highlights." in muted on one line, "Here's the whole road." on the next. Caladea ~40px.

Timeline ("the whole road"), not prototyped; build to this description in the same visual language:
- Paper background, ink text. One vertical trunk (1px, `line` colour, drawn progressively as you scroll; this is the 松, the pine trunk). Each node branches right of the trunk. Years sit left of the trunk in caps; organisation and role to the right with a one-line summary.
- Oldest to newest. Education nodes (Pacific, Schulich) start collapsed: the one-line summary stays visible, and DETAILS ↓ expands the list inline (0.4s height ease; several may be open; deep links like `#t-schulich` open it). Without JavaScript the details show.
- Highlight nodes are condensed: a small filled champagne square on the trunk, the one-line summary, and "TOLD ABOVE ↑", which scrolls back to that highlight. Education nodes: hollow dot, collapsible details.
- Just before the last node, a quiet TOOLKIT row: the small caps label TOOLKIT in the year column, no marker, and in `ink-muted`: SQL · Excel · Google Analytics · Tableau · Power BI · HubSpot · Smartsheet · NielsenIQ · Vividata · Claude Code.
- Last node: "2026 · Next", which scrolls to the close.
- Deep links `#t-pacific`, `#t-neo-soul`, `#t-caotai`, `#t-schulich`, `#t-live-nation`, `#t-maple`, `#t-aramark`, `#t-sparklease`.
- No gap year node.

Nodes:
1. 2015–2019 · University of the Pacific · B.Sc. Summary: Started building before graduating. Details: PIES (Pacific Innovation and Entrepreneurship Summit) Award winner; two-time Dean's Honor Roll; co-founded NEO SOUL in 2016.
2. 2016–2020 · NEO SOUL Entertainment · Co-founder. Highlight (condensed). Summary: Brought Chinese indie artists to US stages; 19 concerts, raised 2 rounds, US$6.3M valuation.
3. 2021 · CAOTAI Music · Artist Operations Manager. Highlight. Summary: From a Beijing label to SXSW and The New York Times.
4. 2021–2023 · Schulich School of Business, York University · MBA. Summary: Ranked No. 1 in Canada and 21st in the world by The Economist (2021). Graduated with distinction (GPA A-). Details: Joyce Zemans Award of Achievement; IMASCO Awards in Art and Administration; Dean's Honour List; Graduate Diploma in Media Management, earned concurrently.
5. 2022–2023 · Live Nation Entertainment · Team Lead, Strategy Consultant (MBA consulting engagement). Highlight. Summary: A seven-year roadmap the client adopted.
6. 2023–2024 · Maple Diversity Communications · Strategic Partnerships Manager. Highlight. Summary: Signed IKEA and Tissot; revenue up 14%.
7. 2025 · Complete Purchasing Services (Aramark) · Program Marketing Manager. Highlight. Summary: An automated playbook that halved project management time.
8. 2026 · SparkLease · Product Marketing Manager. Highlight. Summary: Turned screen space into a product for carmakers.
9. 2026 · Next.

## 8. Close

- Paper. The background 金 returns, now fully revealed in `gold-metal`, static (the answer, found).
- Small caps: CONTACT. Line (Caladea, large): "Got a problem with no answer yet?"
- Email, large, `jinsongyi.ca@gmail.com`: click copies to the clipboard and shows "Copied" for 2s; also a `mailto:` fallback.
- LINKEDIN ↗ → https://www.linkedin.com/in/songyijin
- DOWNLOAD RÉSUMÉ ↓ → a plain link to `files/sonny-jin-resume.pdf` (phone-free version, already in the repo) with the `download` attribute, filename "Sonny-Jin-Resume.pdf". No form or gate for now. No phone number anywhere on the site.
- Footer: seal, © 2026 Sonny Jin · Toronto.

## 8a. Analytics (GoatCounter)

- `<script data-goatcounter="https://sonnyjin.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>` before `</body>`. No cookies, no consent banner.
- Click events (`data-goatcounter-click` plus a readable `data-goatcounter-title`): `resume-download` on both résumé links (top bar and close), `work-<highlight id>` on each SEE THE WORK card (e.g. `work-maple`), `email-copy` on the email, `linkedin` on the LinkedIn link.
- View events: `view-<highlight id>`, sent with `window.goatcounter.count({path: 'view-' + id, event: true})` once per highlight per visit, after it has stayed active for one second (so passing through on a rail jump does not count). Guarded: if the script is blocked or not loaded yet nothing breaks; events from before it loads are sent once it does.

## 9. Voice and text rules (from the brand book)

- No dashes as punctuation in any visible copy (hyphens inside words and year ranges like 2015–2019 are fine).
- Capitals only for: the name, navigation, the abilities, beat labels, small labels and buttons. Brand and employer names keep their own case.
- Chinese only in the 金松毅 inscription and inside the work itself.

## 10. Deploy

- GitHub Pages from `main`, folder `/ (root)`. `.nojekyll` stays.
- Every push to `main` redeploys. Check https://jinsongyi-ca.github.io/works/ after each push.
- Before the first push: test in Chrome and Safari at 1440×900 and 1920×1080, reduced motion on and off, keyboard only, and one narrow width (390px) to confirm nothing breaks.

## 11. Open items (not blockers)

- Optional later: a name and company gate before the résumé download (needs a form service such as Formspree). Parked.
- More Aramark photos, if any → `img/aramark/` (WebP, longest side 1600px).
- Mobile design pass, later.
