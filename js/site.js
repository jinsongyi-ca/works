/* Sonny Jin · résumé site behaviour. All text lives in index.html; this file only adds behaviour. */
(() => {
  'use strict';
  const D = document, R = D.documentElement, $ = id => D.getElementById(id);
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const fineMQ = matchMedia('(hover: hover) and (pointer: fine)');
  let reduce = reduceMQ.matches;
  const bar = $('bar');
  const behavior = () => (reduce ? 'instant' : 'smooth');

  /* ---------- the six cases ---------- */
  const cases = [...D.querySelectorAll('.case')];
  const N = cases.length, ids = cases.map(c => c.id.replace(/^case-/, ''));
  const cards = [...D.querySelectorAll('.cd')];
  /* old links (#maple, #neo-soul/evidence, #aramark) still land on the right case */
  const LEGACY = { aramark: 'cps' };
  const caseIndex = id => ids.indexOf(LEGACY[id] || id);
  const setHash = h => history.replaceState(history.state, '', h ? '#' + h : location.pathname + location.search);
  const gcEvent = (path, title) => {
    const gc = window.goatcounter;
    if (gc && typeof gc.count === 'function') { try { gc.count({ path, title: title || path, event: true }); } catch (e) { /* ignore */ } }
  };

  /* ---------- the case panel ----------
     Opening pushes #case-<id> onto history so the browser's Back closes it; Esc, ×, and a click on the backdrop close it too.
     Focus moves into the panel, Tab cycles inside it, and returns to the card on close. */
  const cs = $('cs'), csp = $('csp');
  let caseOpen = -1, caseReturn = null, pushed = false, caseTimer = 0;
  function showCase(i) {
    cases.forEach((c, k) => c.classList.toggle('on', k === i));
    cs.setAttribute('aria-labelledby', cases[i].id + '-h');
    cs.removeAttribute('aria-label');
    csp.scrollTop = 0;
    caseOpen = i;
  }
  function openCase(i, opts = {}) {
    if (i < 0 || i >= N) return;
    clearTimeout(caseTimer);
    const wasOpen = caseOpen >= 0;
    if (!wasOpen) caseReturn = opts.opener || cards[i];
    showCase(i);
    const h = '#case-' + ids[i];
    if (opts.fromHash) { pushed = false; }
    else if (!wasOpen) { history.pushState({ sjCase: 1 }, '', h); pushed = true; }
    else history.replaceState(history.state, '', h);
    if (!wasOpen) {
      cs.classList.add('open');
      R.classList.add('locked');
      requestAnimationFrame(() => requestAnimationFrame(() => cs.classList.add('in')));
    }
    csp.focus({ preventScroll: true });
    gcEvent('view-' + ids[i], 'Case opened: ' + ids[i]);
  }
  function hideCase() {
    if (caseOpen < 0) return;
    if (panelOpen) closePanel();
    const i = caseOpen;
    caseOpen = -1;
    cs.classList.remove('in');
    R.classList.remove('locked');
    caseTimer = setTimeout(() => { if (caseOpen < 0) { cs.classList.remove('open'); cases.forEach(c => c.classList.remove('on')); } }, reduce ? 0 : 260);
    const back = caseReturn || cards[i];
    if (back && back.focus) back.focus({ preventScroll: true });
  }
  /* closing from the page: step back through history if we added the entry, otherwise just clear the hash */
  function closeCase() {
    if (caseOpen < 0) return;
    if (pushed) { pushed = false; history.back(); return; }   // popstate hides it
    setHash('');
    hideCase();
  }
  cards.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); openCase(i, { opener: a }); }));
  $('csx').addEventListener('click', closeCase);
  $('csbg').addEventListener('click', closeCase);
  cs.addEventListener('click', e => { if (e.target === cs) closeCase(); });
  $('csprev').addEventListener('click', () => openCase((caseOpen - 1 + N) % N));
  $('csnext').addEventListener('click', () => openCase((caseOpen + 1) % N));
  D.querySelectorAll('.see').forEach(b => b.addEventListener('click', () => openPanel(+b.dataset.i, b)));

  /* ---------- timeline ---------- */
  const road = D.querySelector('.road'), trunk = $('trunk');
  function updateTrunk() {
    if (reduce) { trunk.style.transform = 'scaleY(1)'; return; }
    const r = road.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / r.height));
    trunk.style.transform = 'scaleY(' + p.toFixed(4) + ')';
  }
  D.querySelectorAll('.more').forEach(b => b.addEventListener('click', () => {
    const node = b.closest('.node'), open = !node.classList.contains('open');
    node.classList.toggle('open', open);
    b.setAttribute('aria-expanded', String(open));
  }));
  function openNode(id) {
    const node = $(id), b = node && node.querySelector('.more');
    if (b && !node.classList.contains('open')) b.click();
  }

  /* ---------- top bar: solid once the page has scrolled ---------- */
  function updateBar() {
    R.style.setProperty('--bar-bg', scrollY < 4 ? 'rgba(250,250,248,0)' : 'rgba(250,250,248,.96)');
  }
  let ticking = false;
  function update() { ticking = false; updateBar(); updateTrunk(); }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  reduceMQ.addEventListener('change', () => { reduce = reduceMQ.matches; setCursor(); update(); });

  /* ---------- focus trap ---------- */
  /* ---------- focus trap ---------- */
  const FOCUSABLE = 'a[href],button:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])';
  function trap(e, root) {
    const f = [...root.querySelectorAll(FOCUSABLE)].filter(el => el.tabIndex >= 0 && (el.offsetParent !== null || el === D.activeElement));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (D.activeElement === first || !root.contains(D.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (D.activeElement === last || !root.contains(D.activeElement))) { e.preventDefault(); first.focus(); }
  }

  /* ---------- the work: a full-screen Cover Flow viewer ----------
     Rows are built from the hidden .evd blocks in the HTML (one row per work group). The active item faces front;
     neighbours turn 55deg toward it and sit back. Click a side item to bring it front; click the front item to expand it. */
  const cf = $('cf'), cfb = $('cfb'), cft = $('cft'), cfz = $('cfz'), cfzi = $('cfzi'), cfzc = $('cfzc');
  const flatMQ = matchMedia('(max-width: 767px)');
  let panelOpen = false, zoomOpen = false, panelFor = -1, panelReturn = null, rows = [], curRow = 0, zoom = null, cfTimer = 0;
  const flat = () => reduce || flatMQ.matches;
  function readGroup(item) {
    const chip = item.querySelector('.band .chip'), lbl = item.querySelector('.band .lbl'), note = item.querySelector('.band .note'), summ = item.querySelector('.summ');
    const label = (chip || lbl).textContent.trim();
    const entries = [];
    item.querySelectorAll('.spot iframe').forEach(f => {
      const title = f.title.replace(/^Spotify:\s*/, '');
      entries.push({ type: 'spot', src: f.dataset.src || f.src, title, ratio: 1 });
    });
    item.querySelectorAll('.shot img').forEach(im => entries.push({ type: 'img', src: im.dataset.src || im.getAttribute('src'), alt: im.alt, spot: im.dataset.spotify || '', title: im.dataset.title || '', ratio: (+im.getAttribute('width') || 4) / (+im.getAttribute('height') || 3) }));
    const press = item.querySelector('a.press');
    if (press) entries.push({ type: 'press', href: press.href, outlet: press.querySelector('b').textContent, year: (press.querySelector('span').textContent.match(/\d{4}/) || [''])[0], ratio: 0.8 });
    return { chip, label, note: [note && note.textContent.trim(), summ && summ.textContent.trim()].filter(Boolean).join('. '), entries };
  }
  function tileHTML(e, big) {
    if (e.type === 'spot') return `<span class="tile spot"><span class="caps">Release</span><b>${e.title}</b><span class="caps">Spotify <span class="ar">↗</span></span></span>`;
    if (e.type === 'press') return big
      ? `<a class="tile press" href="${e.href}" target="_blank" rel="noopener"><b>${e.outlet}</b><span class="caps">${e.year} · Read <span class="ar">↗</span></span></a>`
      : `<span class="tile press"><b>${e.outlet}</b><span class="caps">${e.year} · Read <span class="ar">↗</span></span></span>`;
    return `<img src="${e.src}" alt="${e.alt.replace(/"/g, '&quot;')}" draggable="false">`;
  }
  function buildRows(i) {
    const src = $('ev-' + ids[i]);
    cfb.innerHTML = '';
    rows = [...src.querySelectorAll(':scope > .item')].map((item, r) => {
      const g = readGroup(item);
      const el = D.createElement('section');
      el.className = 'cfr';
      el.setAttribute('aria-label', g.label);
      el.innerHTML = `<div class="cfl"></div><div class="cfs"><div class="cft"></div></div>`;
      const head = el.querySelector('.cfl');
      if (g.chip) head.append(g.chip.cloneNode(true)); else head.insertAdjacentHTML('beforeend', `<span class="caps cflt">${g.label}</span>`);
      if (g.note) head.insertAdjacentHTML('beforeend', `<span class="cfln">${g.note}</span>`);
      const track = el.querySelector('.cft');
      const items = g.entries.map((e, k) => {
        const b = D.createElement('button');
        b.type = 'button'; b.className = 'cfi';
        b.setAttribute('aria-label', `${g.label}, ${k + 1} of ${g.entries.length}`);
        b.innerHTML = `<span class="cfm">${tileHTML(e, false)}</span>`;
        b.addEventListener('click', ev => {
          if (dragMoved) { ev.preventDefault(); return; }
          curRow = r;
          if (k === rows[r].a) openZoom(r, k); else setActive(r, k);
        });
        track.append(b);
        return b;
      });
      cfb.append(el);
      return { el, track, head, items, g, a: 0 };
    });
    rows.forEach(x => { x.a = -1; });
  }
  /* A row opens folded: its pieces fanned in an overlapping stack so a strip of each shows (a = -1).
     Clicking a piece unfolds the row into Cover Flow with that piece in front. */
  function layoutRow(row) {
    const st = row.el.querySelector('.cfs'), H = Math.round(st.clientHeight * 0.74), W = st.clientWidth;
    const w = row.g.entries.map(e => Math.round(Math.min(H * Math.min(Math.max(e.ratio, 0.55), 1.9), W * 0.86)));
    const a = row.a, isFlat = flat(), folded = a < 0, n = w.length;
    const x = new Array(n).fill(0);
    if (folded) {
      // fan: each piece shows about 30% (3D) or 45% (flat) of itself; the whole stack is centred and never wider than the row
      const share = isFlat ? 0.45 : 0.3;
      for (let k = 1; k < n; k++) x[k] = x[k - 1] + Math.max(w[k - 1], w[k]) * share;
      const span = x[n - 1] - x[0] + w[n - 1] / 2 + w[0] / 2, room = W * 0.9;
      const squeeze = span > room ? (room - w[0] / 2 - w[n - 1] / 2) / Math.max(1, x[n - 1]) : 1;
      for (let k = 0; k < n; k++) x[k] *= Math.min(1, squeeze);
      const mid = (x[0] - w[0] / 2 + x[n - 1] + w[n - 1] / 2) / 2;
      for (let k = 0; k < n; k++) x[k] -= mid;
    } else if (isFlat) {
      for (let k = a + 1; k < n; k++) x[k] = x[k - 1] + w[k - 1] / 2 + 16 + w[k] / 2;
      for (let k = a - 1; k >= 0; k--) x[k] = x[k + 1] - w[k + 1] / 2 - 16 - w[k] / 2;
    } else {
      for (let k = a + 1; k < n; k++) x[k] = k === a + 1 ? w[a] / 2 + w[k] * 0.3 : x[k - 1] + w[k] * 0.24;
      for (let k = a - 1; k >= 0; k--) x[k] = k === a - 1 ? -(w[a] / 2 + w[k] * 0.3) : x[k + 1] - w[k] * 0.24;
    }
    row.el.classList.toggle('folded', folded);
    row.items.forEach((b, k) => {
      const d = k - a, ad = Math.abs(d);
      b.style.width = w[k] + 'px'; b.style.height = H + 'px'; b.style.marginLeft = -w[k] / 2 + 'px';
      if (folded) {
        b.style.transform = isFlat ? `translateX(${x[k]}px)` : `translateX(${x[k]}px) translateZ(-80px) rotateY(-28deg)`;
        b.style.zIndex = k + 1;
      } else {
        b.style.transform = isFlat || d === 0 ? `translateX(${x[k]}px)` : `translateX(${x[k]}px) translateZ(-160px) rotateY(${d < 0 ? 55 : -55}deg)`;
        b.style.zIndex = 100 - ad;
      }
      b.classList.toggle('act', !folded && d === 0);
      b.classList.toggle('far', !folded && !isFlat && ad > 7);
      b.tabIndex = (folded ? k === 0 : d === 0) ? 0 : -1;
    });
    // centre the pieces in their area, leaving room below for the reflection
    row.track.style.top = Math.max(0, Math.round((st.clientHeight - H * 1.22) / 2)) + 'px';
  }
  function layoutAll() { rows.forEach(layoutRow); }
  function setActive(r, k, focus) {
    const row = rows[r];
    if (!row) return;
    row.a = Math.max(0, Math.min(row.items.length - 1, k));
    layoutRow(row);
    if (focus) row.items[row.a].focus({ preventScroll: true });
  }
  function rowStep(r, d) { if (rows[r]) setActive(r, rows[r].a < 0 ? 0 : rows[r].a + d, true); }
  function markRow() { rows.forEach((x, r) => x.el.classList.toggle('here', r === curRow)); }
  function goRow(d) {
    curRow = Math.max(0, Math.min(rows.length - 1, curRow + d));
    markRow();
    cfb.scrollTo({ top: rows[curRow].el.offsetTop, behavior: behavior() });
    rows[curRow].items[Math.max(0, rows[curRow].a)].focus({ preventScroll: true });
  }
  function openPanel(i, opener) {
    if (!$('ev-' + ids[i])) return;
    clearTimeout(cfTimer);
    panelReturn = opener || D.activeElement;
    panelFor = i; curRow = 0;
    cft.textContent = $('ev-' + ids[i]).dataset.name;
    buildRows(i);
    cf.hidden = false;
    R.classList.add('locked');
    panelOpen = true;
    markRow();
    requestAnimationFrame(() => { layoutAll(); cf.classList.add('in'); });
    cfb.scrollTop = 0;
    setTimeout(() => { const r = rows[0]; if (r) r.items[Math.max(0, r.a)].focus({ preventScroll: true }); }, 30);
    gcEvent('work-' + ids[i]);
  }
  function closePanel() {
    if (!panelOpen) return;
    if (zoomOpen) closeZoom(true);
    panelOpen = false;
    cf.classList.remove('in');
    if (caseOpen < 0) R.classList.remove('locked');
    cfTimer = setTimeout(() => { if (!panelOpen) { cf.hidden = true; cfb.innerHTML = ''; rows = []; } }, reduce ? 0 : 360);
    if (panelReturn && panelReturn.focus) panelReturn.focus({ preventScroll: true });
  }
  function showZoom() {
    const row = rows[zoom.r], e = row.g.entries[zoom.k];
    const player = e.type === 'spot' ? e.src : e.spot;
    cfzi.innerHTML = tileHTML(e, true) + (player
      ? `<iframe src="${player}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Spotify: ${e.title}"></iframe>` : '');
    cfzi.className = 'cfzi ' + e.type + (e.type === 'img' && player ? ' withspot' : '');
    cfzc.textContent = `${row.g.label} · ${zoom.k + 1} / ${row.items.length}`;
  }
  function openZoom(r, k) {
    zoom = { r, k }; zoomOpen = true;
    showZoom();
    cfz.hidden = false;
    requestAnimationFrame(() => cf.classList.add('zoomed'));
    $('cfzx').focus({ preventScroll: true });
  }
  function closeZoom(silent) {
    if (!zoomOpen) return;
    zoomOpen = false;
    cf.classList.remove('zoomed');
    cfz.hidden = true; cfzi.innerHTML = '';
    setActive(zoom.r, zoom.k, !silent);
  }
  function zoomStep(d) {
    const n = rows[zoom.r].items.length;
    zoom.k = (zoom.k + d + n) % n;
    showZoom();
  }
  $('cfx').addEventListener('click', closePanel);
  $('cfzx').addEventListener('click', () => closeZoom());
  $('cfzp').addEventListener('click', () => zoomStep(-1));
  $('cfzn').addEventListener('click', () => zoomStep(1));
  cfz.addEventListener('click', e => { if (e.target === cfz) closeZoom(); });
  cfb.addEventListener('click', e => { if (!dragMoved && !e.target.closest('.cfi,.cfl')) closePanel(); });
  // horizontal wheel or trackpad swipe moves the row under the pointer
  let wheelAcc = 0, wheelAt = 0;
  // vertical wheel: one gesture glides to the next or previous row; momentum from the same gesture is ignored
  let vAt = -1e9, vLast = 0, vMag = 0;
  cfb.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      if (zoomOpen || Math.abs(e.deltaY) < 2) return;
      const now = performance.now(), quiet = now - vLast, mag = Math.abs(e.deltaMode ? e.deltaY * 33 : e.deltaY), prev = vMag;
      vLast = now; vMag = mag;
      const sameGesture = now - vAt < 750 || (quiet < 260 && !(mag >= 15 && mag > prev * 1.6) && now - vAt < 8000);
      if (sameGesture) return;
      vAt = now;
      goRow(e.deltaY > 0 ? 1 : -1);
      return;
    }
    e.preventDefault();
    const rowEl = e.target.closest('.cfr'), r = rows.findIndex(x => x.el === rowEl);
    if (r < 0) return;
    const now = performance.now();
    if (now - wheelAt > 300) wheelAcc = 0;
    wheelAt = now; wheelAcc += e.deltaX;
    if (Math.abs(wheelAcc) > 70) { curRow = r; rowStep(r, wheelAcc > 0 ? 1 : -1); wheelAcc = 0; }
  }, { passive: false });
  // dragging (mouse or touch) moves a row
  let dragX = null, dragRow = -1, dragMoved = false;
  cfb.addEventListener('pointerdown', e => {
    const rowEl = e.target.closest('.cfr');
    dragRow = rows.findIndex(x => x.el === rowEl); dragX = e.clientX; dragMoved = false;
  });
  addEventListener('pointermove', e => {
    if (dragX === null || dragRow < 0 || !panelOpen) return;
    const dx = e.clientX - dragX;
    if (Math.abs(dx) > 60) { dragMoved = true; curRow = dragRow; rowStep(dragRow, dx < 0 ? 1 : -1); dragX = e.clientX; }
  });
  addEventListener('pointerup', () => { dragX = null; setTimeout(() => { dragMoved = false; }, 0); });
  cfb.addEventListener('scroll', () => {
    const mid = cfb.getBoundingClientRect().top + cfb.clientHeight / 2;
    let best = 0, bd = 1e9;
    rows.forEach((x, r) => { const b = x.el.getBoundingClientRect(), d = Math.abs(b.top + b.height / 2 - mid); if (d < bd) { bd = d; best = r; } });
    if (best !== curRow && performance.now() - vAt > 900) { curRow = best; markRow(); }
  }, { passive: true });
  addEventListener('resize', () => { if (panelOpen) layoutAll(); });


  /* focus rings in the viewer only for keyboard users */
  addEventListener('keydown', e => { if (/^(Tab|Arrow|Enter| )/.test(e.key)) R.classList.add('kbd'); }, true);
  addEventListener('pointerdown', () => R.classList.remove('kbd'), true);

  /* ---------- keyboard ---------- */
  addEventListener('keydown', e => {
    if (zoomOpen) {
      if (e.key === 'Escape') { e.preventDefault(); closeZoom(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); zoomStep(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); zoomStep(-1); }
      else if (e.key === 'Tab') trap(e, cfz);
      return;
    }
    if (panelOpen) {
      if (e.key === 'Escape') { e.preventDefault(); closePanel(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); rowStep(curRow, e.key === 'ArrowRight' ? 1 : -1); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); goRow(e.key === 'ArrowDown' ? 1 : -1); }
      else if (e.key === 'Tab') trap(e, cf);
      return;
    }
    if (caseOpen >= 0) {
      if (e.key === 'Escape') { e.preventDefault(); closeCase(); }
      else if (e.key === 'Tab') trap(e, csp);
    }
  });

  /* ---------- in-page links, deep links and the Back button ---------- */
  function route(hash, first) {
    const [raw, sub] = hash.replace(/^#/, '').split('/');
    const id = raw.replace(/^case-/, ''), i = caseIndex(id);
    if (i >= 0) {
      if (first) $('highlights').scrollIntoView({ behavior: 'instant', block: 'start' });
      openCase(i, { fromHash: true });
      if (sub === 'evidence' || sub === 'work') requestAnimationFrame(() => openPanel(i, cases[i].querySelector('.see')));
      return true;
    }
    if (caseOpen >= 0) hideCase();
    if (/^t-/.test(raw) && $(raw)) {
      openNode(raw);
      $(raw).scrollIntoView({ behavior: first ? 'instant' : behavior(), block: 'start' });
      return true;
    }
    return false;
  }
  addEventListener('popstate', () => {
    pushed = false;
    if (!route(location.hash, false) && caseOpen >= 0) hideCase();
  });
  /* links such as "Read the case" in the timeline open the panel without scrolling */
  D.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('cd')) return;
    const h = a.getAttribute('href').slice(1), id = h.replace(/^case-/, '').split('/')[0];
    if (/^case-/.test(h) || (caseIndex(id) >= 0 && h === id)) {
      e.preventDefault();
      openCase(caseIndex(id), { opener: a });
    }
  });

  /* ---------- email: copy on click, mailto as fallback ---------- */
  const mail = $('mail'), copied = $('copied');
  let copyTimer = 0;
  mail.addEventListener('click', e => {
    if (!navigator.clipboard || !window.isSecureContext) return;
    e.preventDefault();
    const addr = mail.textContent.trim();
    navigator.clipboard.writeText(addr).then(() => {
      copied.textContent = 'Copied';
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { copied.textContent = ''; }, 2000);
    }, () => { location.href = mail.href; });
  });

  /* ---------- cursor and the hidden 金 ---------- */
  const curEl = $('cur'), lit = $('lit'), hero = $('top');
  const HOT = 'a,button,.lg,[role="button"]';
  let tx = innerWidth * 0.72, ty = innerHeight * 0.45, gx = tx, gy = ty, heroVisible = true, raf = 0, cursorOn = false;
  let lastMove = performance.now(), idleTimer = 0;
  function setCursor() {
    cursorOn = fineMQ.matches && !reduce;
    R.classList.toggle('cc', cursorOn);
    startGlow();
  }
  addEventListener('pointermove', e => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    tx = e.clientX; ty = e.clientY;
    lastMove = performance.now();
    if (!cursorOn) return;
    curEl.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    curEl.classList.add('show');
    startGlow();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startGlow, 3050);
  }, { passive: true });
  D.addEventListener('pointerover', e => {
    if (!cursorOn) return;
    curEl.classList.toggle('big', !!e.target.closest(HOT));
  });
  D.addEventListener('pointerleave', () => curEl.classList.remove('show'));
  D.documentElement.addEventListener('mouseleave', () => curEl.classList.remove('show'));
  addEventListener('blur', () => curEl.classList.remove('show'));
  /* The gold light follows the cursor. With no pointer movement for 3s, or on touch screens,
     it drifts on its own along a slow Lissajous path (about 30s per loop): a slow searchlight. Off under reduced motion. */
  function glow() {
    raf = 0;
    if (reduce || !heroVisible) return;
    const now = performance.now(), r = lit.getBoundingClientRect();
    const drifting = !cursorOn || now - lastMove > 3000;
    if (drifting) {
      const right = Math.min(r.right, innerWidth), cx = (r.left + right) / 2, cy = r.top + r.height * 0.52;
      const t = now / 30000 * 2 * Math.PI;
      tx = cx + (right - r.left) * 0.18 * Math.sin(t);
      ty = cy + r.height * 0.18 * Math.sin(2 * t + Math.PI / 3);
    }
    const k = drifting ? 0.03 : 0.12;
    gx += (tx - gx) * k; gy += (ty - gy) * k;
    lit.style.setProperty('--gx', (gx - r.left).toFixed(1) + 'px');
    lit.style.setProperty('--gy', (gy - r.top).toFixed(1) + 'px');
    const moving = Math.abs(tx - gx) > 0.3 || Math.abs(ty - gy) > 0.3;
    if (drifting || moving || !glow.settled) { glow.settled = !moving; raf = requestAnimationFrame(glow); }
  }
  function startGlow() { glow.settled = false; if (!raf) raf = requestAnimationFrame(glow); }
  setTimeout(startGlow, 3050);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; if (heroVisible) startGlow(); }).observe(hero);
  }
  addEventListener('scroll', () => { if (heroVisible) startGlow(); }, { passive: true });

  /* ---------- top bar on the opening: seal and RÉSUMÉ only until 40% of the opening is scrolled ---------- */
  function updateBarMin() { bar.classList.toggle('min', scrollY < hero.offsetHeight * 0.4); }
  addEventListener('scroll', updateBarMin, { passive: true });
  addEventListener('resize', updateBarMin);
  updateBarMin();
  fineMQ.addEventListener('change', setCursor);

  /* ---------- small screens: the top bar hides on scroll down, returns on scroll up ---------- */
  const smallMQ = matchMedia('(max-width: 767px)');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (!smallMQ.matches || panelOpen || caseOpen >= 0) { bar.classList.remove('away'); lastY = y; return; }
    if (Math.abs(y - lastY) < 6) return;
    bar.classList.toggle('away', y > lastY && y > bar.offsetHeight && !bar.contains(D.activeElement));
    lastY = y;
  }, { passive: true });
  bar.addEventListener('focusin', () => bar.classList.remove('away'));

  /* ---------- start ---------- */
  setCursor();
  update();
  if (location.hash && location.hash !== '#') requestAnimationFrame(() => route(location.hash, true));
})();
