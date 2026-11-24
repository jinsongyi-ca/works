# SPEC: jinsongyi-ca.github.io/works

Build spec for Sonny Jin's résumé website. Everything here has been decided with Sonny; do not redesign. Where this file and a prototype disagree, this file wins. Where this file is silent, follow the prototypes, then `brand/BRAND.md`.

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
- Respect `prefers-reduced-motion`: no count-up, no rise-in, no cursor effects, instant colour changes, native cursor.
- Hide the custom cursor on touch (`hover: none`).
- Accessibility: real buttons and links, visible focus states, the work panel and lightbox trap focus and close on Esc, `aria-label`s as in the prototype, alt text on images.
- Meta: title "Sonny Jin · Marketing, Brand & Business Strategy", description from the positioning line, favicon `favicon.svg`, a new `og.png` (1200×630) in the new design: paper background, SONNY JIN in champagne, positioning line, seal.
- URLs: the repo is `jinsongyi-ca/works` (lowercase). Every absolute URL (og:url, og:image, canonical) uses `https://jinsongyi-ca.github.io/works/`. `<link rel="canonical" href="https://jinsongyi-ca.github.io/works/">` is in the head.

## 3. Page structure

1. **Opening** (one screen)
2. **Highlights** (pinned section, six stories) and **summary**
3. **Bridge line**, then the **timeline** ("the whole road")
4. **Close** (contact, résumé)

Sticky top bar on every part: seal + SONNY JIN (left), HIGHLIGHTS · TIMELINE · CONTACT · RÉSUMÉ ↓ (right, caps). RÉSUMÉ ↓ downloads `files/sonny-jin-resume.pdf` as "Sonny-Jin-Resume.pdf". Its colours follow the current background. Under 768px wide the bar hides on scroll down and returns on scroll up (and whenever it holds focus), so it never covers content; under 480px only the seal shows on the left.

## 4. Opening

Build exactly as `design/opening.html`.

- Background `paper` `#FAFAF8`.
- Eyebrow, caps: MARKETING, BRAND & BUSINESS STRATEGY · TORONTO.
- Name: SONNY JIN, Caladea, very large, solid `champagne` `#C3A986`. It does not react to the cursor.
- (Song-yi): about 1/8 of the name size, `champagne-deep`, floating off the top right corner of SONNY (absolutely positioned, outside the text flow). SONNY and JIN keep a normal word space; (Song-yi) must not widen the gap. See design/opening.html.
- 金 松 毅: vertical, LXGW WenKai, ink, to the right of the name; the first and last characters align with the top and the baseline of the name. No seal under it.
- Positioning, two lines: "When the answer isn't there yet," in `ink-muted`; "I go find it." bold, solid `champagne`.
- Who and what, one line under the positioning and above the abilities (Caladea about 19px, `ink-muted`, max width 620px): "Four years across live entertainment, multicultural marketing and automotive. Open to brand, marketing strategy and live entertainment roles in Toronto."
- Abilities, caps, separated by thin vertical rules: PROBLEM SOLVING | ANALYSIS | STRATEGY | EXECUTION.
- Foot row: WORKED WITH · PITCHED TO, then IKEA, Tissot, Listerine, Live Nation, Audi, Panasonic, Mercedes‑Benz, GM in their own case. On hover each scales 1.14 and turns its brand colour (IKEA #0058A3, Tissot #E1251B, Listerine #00857C, Live Nation #E21836, Audi #BB0A30, Panasonic #0041C0, Mercedes‑Benz #5F6368, GM #0170CE).
- Background 金 (`brand/logos/sj-jin-glyph.svg` path): very large, almost invisible (`#F4F4F0`), pushed right so it bleeds off the edge. Around the cursor (radius ~250px, lerped) it shows `gold-metal`, a still gradient. No sparkles, no moving glint.
- Cursor: 10px `champagne-deep` dot; becomes a 44px ring over links and buttons.
- SCROLL cue, centred above the WORKED WITH · PITCHED TO row: caps word with two V chevrons under it that bounce (still under reduced motion).

## 5. Highlights

Build as `design/highlights.html`. Copy and colours below are final.

### Behaviour
- One section, pinned (`position: sticky`) at 100vh. Each highlight gets one screen of scroll (6 highlights → section height 700vh). One scroll gesture (wheel, trackpad fling, swipe, ↓ / J / Page Down / Space) moves exactly one highlight; momentum from the same gesture is ignored. Scrolling down from the last highlight goes to the summary; scrolling up from the first goes back to the opening.
- Within a highlight the beats play on their own, no extra scrolling: the hook and THE GAP on entry, THE MOVE about 0.4s later, THE RESULT, the number and the work card about 0.4s after that. Beats fade in and rise 24px (0.6s, cubic-bezier(.2,.8,.2,1)). Earlier beats stay. A highlight already seen, or opened from a deep link, shows all beats at once.
- Background and text colours crossfade 0.6s between highlights.
- Left rail: employer names in their own case: NEO SOUL, Maple Diversity, Live Nation, SparkLease, Aramark, CAOTAI Music. The work panel header and the summary grid use the same short names; only the timeline uses full names. Active 32px bold at full opacity; others 17px at about 42%. Thin vertical hairline at the left. Click jumps to that highlight. No years.
- Top right counter: 01 / 06, 140px from the top so it sits below the company lines.
- Bottom right on every highlight: a SKIP TO TIMELINE ↓ link in `soft` (replaces KEEP SCROLLING), so keyboard and mouse users can leave the highlights from any of them.
- Two lines above each hook. Line 1, role line: small caps, `soft`, one row: ROLE · YEARS · QUALIFIER (if any). Line 2, company line: sentence case, 15px, `soft`, one line at 1440 wide (wraps on narrower screens): company name · description.
- Hook: Caladea, about 50px, line-height 1.08.
- Beat label (THE GAP / THE MOVE / THE RESULT): caps on an **accent chip** (accent fill, `chipText` text, 2px radius).
- Number: very large (clamp 72 to 116px), counts up once (1.2s ease-out cubic) when THE RESULT appears. A currency prefix is set small and raised. An **accent marker band** runs across the lower third (62% to 92% of the line box); the part of the digits over the band switches to `chipText` (two-stop text gradient with background-clip: text; see prototype). Label under it in small caps, `soft`.
- Only the headline number sits in the number column. No supporting figures; THE RESULT text carries the other figures.
- Abilities row at the foot: the tags this story proves get full opacity and an accent underline when THE MOVE appears; the rest at about 42%.
- Work card (after THE RESULT): three slightly rotated, overlapping 54px thumbnails of real work, an accent chip "SEE THE WORK →", and a count line ("14 pieces · Times Square, Posters, Venues"). On hover the thumbnails fan out, the arrow moves 5px, the border takes the accent. Opens the work panel.
- Pinning needs a window at least 1200px wide and 600px tall; below that the stories stack in plain scroll. Under 1400px wide the rail narrows and the number column keeps 270 to 300px. Under 880px and 760px tall the hook, body text and spacing tighten so the work card always clears the abilities row (checked at 1200×750, 1280×720, 1280×800, 1366×768, 1440×900, 1536×864, 1600×900, 1920×1080).
- Keyboard while the section is pinned: ↓ / J next, ↑ / K previous.
- Deep links: `#neo-soul`, `#maple`, `#live-nation`, `#sparklease`, `#aramark`, `#caotai`; the hash updates as you scroll (replaceState). `#<id>/evidence` opens that highlight's work panel on load.

### Colours (`brand/site-colours.json`)

| Highlight | Field | Text | Accent | chipText |
| --- | --- | --- | --- | --- |
| NEO SOUL | #0A0A0A | #FFFFFF | #D4AF37 | #0A0A0A |
| Maple Diversity | #09090B | #FFFFFF | #FF6B2C | #09090B |
| Live Nation | #E21836 | #FFFFFF | #000000 | #FFFFFF |
| SparkLease | #FAFAFA | #1F1F1F | #FABB00 | #1F1F1F |
| Aramark | #EB002A | #FFFFFF | #FFFFFF | #EB002A |
| CAOTAI Music | #000000 | #FFFFFF | #C3A986 | #14161A |

The accent is always a fill (chips, marker band, underline), never a text colour. Body text never takes the accent.

### Copy

**NEO SOUL** · role: CO-FOUNDER · 2016–2020
- Company line: NEO SOUL Entertainment · A pioneer in bringing East Asian live music to North America. Los Angeles.
- Hook: The music was in China. Its audience was already in America.
- THE GAP: Chinese students across the US had almost nothing to go out for, while Chinese indie music was having its moment back home. Nobody was bringing the two together.
- THE MOVE: We brought the artists to American stages and built each tour city by city. There was no market data, so I built forecasting and pricing models from streaming, social and box office benchmarks to pick venues, size cities and price tickets.
- THE RESULT: 19 concerts, forecasts within 5%. US$600K in revenue, US$250K raised, and a US$6.3M valuation in two years.
- Number: US$ 6.3 M · VALUATION IN TWO YEARS
- Abilities: Problem solving, Analysis, Execution

**Maple Diversity** · role: STRATEGIC PARTNERSHIPS MANAGER · 2023–2024
- Company line: Maple Diversity Communications · Canada's leading multicultural marketing agency.
- Hook: Nearly one in four Canadians was born abroad. Most brands still spoke to one Canada.
- THE GAP: Brands knew multicultural Canada mattered, but few had the data or the cultural know-how to reach it. Maple had to prove the case to win new clients.
- THE MOVE: I turned NielsenIQ, Vividata and Statistics Canada data into the case for each brand: who the audience was, where to reach them and what to say. I pitched 11 brands across CPG, automotive, tech and the public sector, and automated prospecting so my time went into proposals.
- THE RESULT: I signed IKEA and Tissot myself, and won new projects from Aveeno, Listerine, Audi and Panasonic. Revenue grew 14% year over year, and a rebuilt vendor pipeline cut localization costs by 25%.
- Number: +14% · REVENUE, YEAR OVER YEAR
- Abilities: Analysis, Strategy, Execution

**Live Nation** · role: TEAM LEAD, STRATEGY CONSULTANT · 2022–2023 · MBA CONSULTING ENGAGEMENT
- Company line: Live Nation Entertainment · The world's largest live entertainment company. Fortune 500.
- Hook: Seven of us. Seven reports. One roadmap the client kept.
- THE GAP: Live Nation wanted growth in markets it hadn't entered yet. What stood in the way had not been mapped.
- THE MOVE: I brought Live Nation on as a client and led a team of seven through the diagnosis: industry, business model, organization, execution.
- THE RESULT: A seven-year, multi-scenario roadmap projecting 36.8% CAGR in untapped markets. The client adopted it.
- Number: 36.8% · CAGR PROJECTED, UNTAPPED MARKETS
- Abilities: Problem solving, Analysis, Strategy

**SparkLease** · role: PRODUCT MARKETING MANAGER · 2026 · CONTRACT
- Company line: SparkLease · Canada's go-to Chinese-language car leasing platform, with 100,000+ annual active users.
- Hook: Carmakers didn't need another website. They needed shelf space.
- THE GAP: SparkLease reached 100,000+ active users a year, with nothing packaged for the carmakers who wanted to reach them.
- THE MOVE: I grew organic leads with SEO and AI search optimization, then turned the site's screen space into a tiered product for OEMs and their dealers.
- THE RESULT: Leads up 19% a month on average, top five on Google across 5 keyword groups. Seven cold pitches to BMW's agency, Mercedes‑Benz and GM brands; three made the shortlist.
- Number: +19% · ORGANIC LEADS, MONTH OVER MONTH
- Abilities: Problem solving, Strategy, Execution

**Aramark** · role: PROGRAM MARKETING MANAGER · 2025
- Company line: Complete Purchasing Services, an Aramark company · Group purchasing for senior living, healthcare and education across Canada, for 50 years.
- Hook: Same events, every month. Planned from memory, every time.
- THE GAP: We ran online and in-person events for 2 B2B programs serving 500+ client accounts. The events repeated, but there was no SOP. Every step lived in someone's memory.
- THE MOVE: The events were cookie cutter, so I made them repeatable. I built an automated project management system in Smartsheet: enter the event date, and every action item appears with its own due date.
- THE RESULT: Project management time fell by more than half, and every new event started from the same plan. For our 50th anniversary, I helped put clients and the brands we represented in one room, with a trade show to make business happen.
- Number: 50%+ · LESS PROJECT MANAGEMENT TIME
- Abilities: Problem solving, Execution
- Naming rule: the rail says Aramark; the company line and the timeline name the legal employer. Never a dash between the two names.

**CAOTAI Music** · role: ARTIST OPERATIONS MANAGER · 2021
- Company line: CAOTAI Music · An independent label and youth culture company in Beijing since 2006, with its own SXSW showcase.
- Hook: From a Beijing label to SXSW and The New York Times.
- THE GAP: 2021. Stages were closed, and a small Beijing label needed its artists heard outside China.
- THE MOVE: I ran content across platforms, plus festivals, distribution and brand partnerships.
- THE RESULT: One artist grew to 45,000 fans in five months. Our artists reached the top 5% of NetEase's indie chart, played SXSW 2021, and got their own story in The New York Times.
- Number: 45K · FANS IN FIVE MONTHS
- Abilities: Strategy, Execution

### Summary screen (paper)
- Small caps: HIGHLIGHTS, IN SUM. Title: "Proven, six times." Sub: "Every ability on this page is backed by at least three of the stories above."
- Grid: 4 abilities (rows) × 6 highlights (columns, names in their own case, CAOTAI Music in English). Filled champagne square where proven, hollow `champagne-deep` outline where not. Squares pop in with a stagger when the screen enters.
- The same centred SCROLL cue as the opening (word plus two bouncing V chevrons) at the bottom of this screen.

## 6. Work panel

- Slides in from the right, 62vw, 0.45s; 40% black scrim behind; the highlight stays visible. Close with ×, Esc or a click on the scrim. URL `#<id>/evidence`.
- Sticky header: employer name (caps) + EVIDENCE (muted) + ×.
- Neutral paper body. Items, in order, each with a label and an optional note. Client items get a chip in the client's colours (IKEA #0058A3 on #FFDB00 text, Tissot #E1251B, Listerine #00857C, white text); the employer's own work uses a plain caps label.
- Images: a horizontal filmstrip, 230px high. Click opens a full-screen lightbox (dark, image contained, ← → keys and buttons, caption "Item · n / total", Esc closes).
- Spotify: official embeds, 152px high, two per row, lazy.
- Press: a bordered card: outlet (large), "YEAR · READ ↗", opens in a new tab.

Content:
- **NEO SOUL**: Times Square · #NextNeoSoulArtist ("Our billboard poll on who to bring over next"): `timessquare-1`, `timessquare-2`. Posters: `poster-hyukoh`, `poster-dmob`, `poster-hhh`, `poster-madi`, `poster-sdy`, `poster-sunset`. Venues ("19 concerts across the US"): `mayan`, `wilbur`, `wilbur-stage`, `regency`, `royale`, `chicago`.
- **Maple Diversity**: IKEA chip ("Signed by Sonny · Online ordering for complete room sets, plus the promotion plan"): `ikea`. Tissot chip ("Signed by Sonny"): `tissot-1`, `tissot-2`. Listerine chip ("New project from an existing client"): `listerine`.
- **Live Nation**: The engagement ("Covers only; the full reports stay with the client"), text: "Seven reports across industry trends, business model, organizational structure and execution capability, ending in a seven-year growth roadmap with multiple scenarios." Images `team-1`, `team-2`.
- **SparkLease**: Search growth: `seo-traffic`, `seo-rankings`. The product ("Screen space, packaged and tiered"): `listing-insert`, `boost`. OEM pitches: `polestar`, `alfa-romeo`, `lotus`, `fiat`, `ford-cn`.
- **Aramark**: 50th anniversary · Vancouver ("At River Rock Casino Resort: our clients, the brands we represented and a trade show in one room"): `aramark/anniversary-50`. The count line uses "1 piece" (singular). More photos may be added later to `img/aramark/`.
- **CAOTAI Music**: SXSW 2021: `sxsw-lineup`, `sxsw-session`, `sxsw-stage`, then a press card: The New York Times, 2021, https://www.nytimes.com/2021/03/22/arts/music/sxsw-music-festival.html. Releases: Spotify `album/0hivH5g3UEx0sGSFIekNgn` (Wonder World), `album/3KJUv82FN4NRtWYbzW1eCf` (C.A.B Cypher), `track/2iHypimlBjipsM87Ssa2Mj` (Slurpee 思乐冰), `album/6rgJm6sg7XhwKISDlQdduT` (Zel, Vol. 1), `album/1wDFR8JIFUnkwrC5q0w2j6` (Papa!), then covers `cover-horse`, `cover-milkyway`, `cover-sea`. Virtual concerts: `virtual-1`, `virtual-2`, `virtual-3`. Festivals and tour: `festival-stage`, `festival-set`, `hainan-fw`, `shanghai-fw`, `shanghai-fw-2`, `tour`, `radio`.

## 7. Bridge and timeline

Bridge (paper, generous space): "That's the highlights." in muted on one line, "Here's the whole road." on the next. Caladea ~40px.

Timeline ("the whole road"), not prototyped; build to this description in the same visual language:
- Paper background, ink text. One vertical trunk (1px, `line` colour, drawn progressively as you scroll; this is the 松, the pine trunk). Each node branches right of the trunk. Years sit left of the trunk in caps; organisation and role to the right with a one-line summary.
- Oldest to newest. No expand interaction: education nodes show their details as an open list under the summary.
- Highlight nodes are condensed: a small filled champagne square on the trunk, the one-line summary, and "TOLD ABOVE ↑", which scrolls back to that highlight. Education nodes: hollow dot, details always shown.
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
