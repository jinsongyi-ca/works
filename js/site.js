/* Sonny Jin · résumé site behaviour. All text lives in index.html; this file only adds behaviour. */
(() => {
  'use strict';
  const D = document, R = D.documentElement, $ = id => D.getElementById(id);
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const pinMQ = matchMedia('(min-width: 1200px) and (min-height: 600px)');
  const fineMQ = matchMedia('(hover: hover) and (pointer: fine)');
  let reduce = reduceMQ.matches, pin = false;

  const hl = $('highlights'), stage = $('stage'), bar = $('bar');
  const stories = [...D.querySelectorAll('.story')];
  const N = stories.length, ids = stories.map(s => s.id);
  const railBtns = [...$('rail').querySelectorAll('button')];
  const tags = [...$('abil').children];
  const countEl = $('count');
  const wallImgs = [...$('wall').querySelectorAll('img')];
  const PAPER = { fg: '#0B0C0E', mute: '#5E6268' };
  const theme = stories.map(s => {
    const g = k => s.style.getPropertyValue(k).trim();
    return { bg: g('--bg'), fg: g('--fg'), soft: g('--soft'), acc: g('--acc'), chip: g('--chipText'),
      ab: s.dataset.ab.split(',').map(Number) };
  });
  const pad = n => String(n).padStart(2, '0');
  const behavior = () => (reduce ? 'instant' : 'smooth');

  /* ---------- thumbnails: load only near the story ---------- */
  const loaded = new Set();
  function loadThumbs(i) {
    if (i < 0 || i >= N || loaded.has(i)) return;
    loaded.add(i);
    stories[i].querySelectorAll('img[data-src]').forEach(im => { im.src = im.dataset.src; im.removeAttribute('data-src'); });
    if (pin) { const w = wallImgs[i]; if (w && w.dataset.src) { w.src = w.dataset.src; w.removeAttribute('data-src'); } }
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !pin) loadThumbs(+e.target.dataset.i);
    }), { rootMargin: '600px 0px' });
    stories.forEach(s => io.observe(s));
  } else stories.forEach((_, i) => loadThumbs(i));

  /* ---------- numbers ---------- */
  const counted = new Set();
  const nums = stories.map(s => {
    const em = s.querySelector('.num em'), to = em.dataset.to;
    return { em, to: parseFloat(to), dec: (to.split('.')[1] || '').length, txt: to };
  });
  function resetNumbers() {
    nums.forEach((n, i) => {
      if (counted.has(i)) return;
      n.em.textContent = pin && !reduce ? (0).toFixed(n.dec) : n.txt;
    });
  }
  function countUp(i) {
    if (counted.has(i)) return;
    counted.add(i);
    const n = nums[i];
    if (reduce) { n.em.textContent = n.txt; return; }
    const t0 = performance.now(), d = 1200;
    const f = t => {
      const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3);
      n.em.textContent = k < 1 ? (n.to * e).toFixed(n.dec) : n.txt;
      if (k < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }

  /* ---------- hash helpers ---------- */
  const setHash = h => {
    const url = h ? '#' + h : location.pathname + location.search;
    if (('#' + h) !== location.hash || !h) history.replaceState(null, '', url);
  };

  /* ---------- pinned highlights ---------- */
  let cur = -1, wasInside = false;
  function applyTheme(i) {
    const t = theme[i], st = stage.style;
    st.setProperty('--bg', t.bg); st.setProperty('--fg', t.fg); st.setProperty('--soft', t.soft);
    st.setProperty('--acc', t.acc); st.setProperty('--chipText', t.chip);
  }
  function setCur(i) {
    cur = i;
    applyTheme(i);
    stories.forEach((s, k) => s.classList.toggle('on', k === i));
    railBtns.forEach((b, k) => {
      b.classList.toggle('on', k === i);
      if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    countEl.textContent = pad(i + 1) + ' / ' + pad(N);
    wallImgs.forEach((im, k) => im.classList.toggle('on', k === i));
  }
  /* Each highlight has three steps (GAP, MOVE, RESULT); one scroll step advances one beat. */
  const B = 3, STEPS = N * B;
  function hlState() {
    const r = hl.getBoundingClientRect(), span = hl.offsetHeight - innerHeight;
    const p = Math.min(0.9999, Math.max(0, -r.top / span)), k = Math.floor(p * STEPS);
    return { r, span, k, i: Math.floor(k / B), b: k % B, inside: r.top <= 1 && r.bottom >= innerHeight - 1 };
  }
  /* The current beat is open; earlier beats collapse to their chip (click to reopen); later beats wait. */
  let shown = '';
  function setBeat(i, b) {
    const key = i + ':' + b;
    if (key === shown) return;
    shown = key;
    const st = stories[i];
    st.querySelectorAll('.beat').forEach((el, j) => {
      el.classList.toggle('on', j <= b);
      el.classList.toggle('now', j === b);
      el.classList.toggle('done', j < b);
      const chip = el.querySelector('.chip');
      if (j < b) { chip.setAttribute('role', 'button'); chip.tabIndex = 0; chip.setAttribute('aria-label', 'Reopen ' + chip.textContent.trim().toLowerCase()); }
      else { chip.removeAttribute('role'); chip.removeAttribute('tabindex'); chip.removeAttribute('aria-label'); }
    });
    st.querySelector('.ev').classList.toggle('on', b >= 2);
    st.querySelector('.num').classList.toggle('on', b >= 2);
    if (b >= 2) countUp(i);
    tags.forEach((t, k) => t.classList.toggle('lit', b >= 1 && theme[i].ab.includes(k)));
  }
  function reopen(e) {
    const chip = e.target.closest('.beat.done .chip');
    if (!chip || !pin) return;
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    const beat = chip.closest('.beat'), st = chip.closest('.story');
    go(+st.dataset.i, [...st.querySelectorAll('.beat')].indexOf(beat));
  }
  $('stories').addEventListener('click', reopen);
  $('stories').addEventListener('keydown', reopen);
  function updateHighlights() {
    const s = hlState();
    if (s.i !== cur) setCur(s.i);
    if (s.r.top < innerHeight * 0.6 && s.r.bottom > -innerHeight) { loadThumbs(s.i); loadThumbs(s.i + 1); }
    const engaged = s.r.top <= innerHeight * 0.3 && s.r.bottom >= innerHeight * 0.7;
    if (engaged || s.r.top > innerHeight * 0.3) setBeat(s.i, s.b);
    viewSoon(engaged ? s.i : -1);
    if (!panelOpen) {
      if (s.inside) setHash(ids[s.i]);
      else if (wasInside && ids.includes(location.hash.slice(1))) setHash('');
    }
    wasInside = s.inside;
  }
  const stepTop = k => hl.offsetTop + (hl.offsetHeight - innerHeight) * k / STEPS + 2;
  function go(i, b = 0) {
    i = Math.max(0, Math.min(N - 1, i));
    if (pin) scrollTo({ top: stepTop(i * B + b), behavior: behavior() });
    else stories[i].scrollIntoView({ behavior: behavior(), block: 'start' });
  }
  const goStep = k => scrollTo({ top: stepTop(Math.max(0, Math.min(STEPS - 1, k))), behavior: behavior() });

  /* One scroll gesture moves exactly one highlight. Momentum from the same gesture is swallowed. */
  let stepAt = -1e9, lastInput = 0, lastMag = 0;
  function busy(now, quiet, mag, prevMag) {
    if (now - stepAt < 750) return true;           // the move itself
    if (quiet >= 180) return false;                 // a pause means a new gesture
    if (mag >= 15 && mag > prevMag * 1.6) return false; // a fresh flick during momentum
    return now - stepAt < 8000;                     // momentum tail of the same gesture
  }
  function stepHl(dir) {
    const s = hlState(), vh = innerHeight;
    if (s.inside) {
      if (dir > 0 && s.k === STEPS - 1) scrollTo({ top: $('summary').offsetTop, behavior: behavior() });
      else if (dir < 0 && s.k === 0) scrollTo({ top: 0, behavior: behavior() });
      else goStep(s.k + dir);
      return true;
    }
    if (dir > 0 && s.r.top > 1 && s.r.top < vh * 0.9) { goStep(0); return true; }
    if (dir < 0 && s.r.bottom < vh - 1 && s.r.bottom > vh * 0.1) { goStep(STEPS - 1); return true; }
    return false;
  }
  function onInput(e, dir, mag) {
    if (!pin || panelOpen || !lb.hidden) return;
    const now = performance.now(), quiet = now - lastInput, prevMag = lastMag;
    lastInput = now; lastMag = mag;
    if (busy(now, quiet, mag, prevMag)) { e.preventDefault(); return; }
    const s = hlState(), vh = innerHeight;
    if (!(s.r.top < vh * 0.9 && s.r.bottom > vh * 0.1)) return;
    if (stepHl(dir)) { e.preventDefault(); stepAt = now; }
  }
  addEventListener('wheel', e => {
    if (e.ctrlKey || Math.abs(e.deltaY) < 2 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    onInput(e, e.deltaY > 0 ? 1 : -1, Math.abs(e.deltaMode ? e.deltaY * 33 : e.deltaY));
  }, { passive: false });
  let touchY = null, touchDone = false;
  addEventListener('touchstart', e => { touchY = e.touches[0].clientY; touchDone = false; }, { passive: true });
  addEventListener('touchmove', e => {
    if (touchY === null || !pin || panelOpen || !lb.hidden) return;
    const s = hlState();
    if (!(s.r.top < innerHeight * 0.9 && s.r.bottom > innerHeight * 0.1)) return;
    const dy = touchY - e.touches[0].clientY;
    if (touchDone) { e.preventDefault(); return; }
    if (Math.abs(dy) < 40) { if (s.inside) e.preventDefault(); return; }
    touchDone = true;
    onInput(e, dy > 0 ? 1 : -1, 100);
  }, { passive: false });
  railBtns.forEach((b, i) => b.addEventListener('click', () => go(i)));

  /* ---------- top bar and cursor colour follow the background ---------- */
  function updateBar() {
    const y = bar.offsetHeight / 2;
    let fg = PAPER.fg, mute = PAPER.mute, bg = scrollY < 4 ? 'rgba(250,250,248,0)' : 'rgba(250,250,248,1)', cc = '#A88B5F';
    let t = null, onStage = false;
    if (pin) {
      const r = hl.getBoundingClientRect();
      if (r.top <= y && r.bottom > y && cur >= 0) { t = theme[cur]; onStage = true; }
    } else {
      for (let k = 0; k < N; k++) {
        const r = stories[k].getBoundingClientRect();
        if (r.top <= y && r.bottom > y) { t = theme[k]; break; }
      }
    }
    if (t) {
      fg = t.fg; mute = t.soft; bg = onStage ? 'rgba(0,0,0,0)' : t.bg;
      cc = t.fg.toUpperCase() === '#FFFFFF' ? t.acc : t.fg;
    }
    const s = R.style;
    s.setProperty('--bar-fg', fg); s.setProperty('--bar-mute', mute); s.setProperty('--bar-bg', bg);
    s.setProperty('--cc', panelOpen ? '#A88B5F' : cc);
  }

  /* ---------- timeline ---------- */
  const road = D.querySelector('.road'), trunk = $('trunk');
  function updateTrunk() {
    if (reduce) { trunk.style.transform = 'scaleY(1)'; return; }
    const r = road.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / r.height));
    trunk.style.transform = 'scaleY(' + p.toFixed(4) + ')';
  }
  /* ---------- summary ---------- */
  const summary = $('summary');
  if ('IntersectionObserver' in window && !reduce) {
    new IntersectionObserver((es, o) => {
      if (es[0].isIntersecting) { summary.classList.add('in'); setTimeout(() => summary.classList.add('done'), 1600); o.disconnect(); }
    }, { threshold: 0.35 }).observe(summary);
  } else summary.classList.add('in');

  /* summary grid hover: rows (label or squares) and company columns */
  const grid = summary.querySelector('.grid'), cells = [...grid.children], COLS = N + 1;
  cells.forEach((c, k) => { c.dataset.r = Math.floor(k / COLS); c.dataset.c = k % COLS; });
  const filled = (r, c) => !!cells[r * COLS + c].querySelector('.sq.f');
  function lightGrid(mode, n) {
    grid.classList.add('hov');
    cells.forEach(el => {
      const r = +el.dataset.r, c = +el.dataset.c;
      let on = false;
      if (mode === 'row') on = r === n ? (c === 0 || filled(r, c)) : (r === 0 && c > 0 && filled(n, c));
      else on = c === n ? (r === 0 || filled(r, c)) : (c === 0 && r > 0 && filled(r, n));
      el.classList.toggle('gl', on);
    });
  }
  grid.addEventListener('pointerover', e => {
    const el = e.target.closest('.grid > *');
    if (!el) return;
    const r = +el.dataset.r, c = +el.dataset.c;
    if (r === 0 && c > 0) lightGrid('col', c);
    else if (r > 0) lightGrid('row', r);
  });
  grid.addEventListener('pointerleave', () => { grid.classList.remove('hov'); cells.forEach(el => el.classList.remove('gl')); });

  /* timeline: education details start collapsed */
  D.querySelectorAll('.more').forEach(b => b.addEventListener('click', () => {
    const node = b.closest('.node'), open = !node.classList.contains('open');
    node.classList.toggle('open', open);
    b.setAttribute('aria-expanded', String(open));
  }));
  function openNode(id) {
    const node = $(id), b = node && node.querySelector('.more');
    if (b && !node.classList.contains('open')) b.click();
  }

  /* ---------- scroll loop ---------- */
  let ticking = false;
  function update() {
    ticking = false;
    if (pin) updateHighlights();
    updateBar();
    updateTrunk();
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  function setMode() {
    pin = pinMQ.matches;
    R.classList.toggle('pin', pin);
    if (!pin) {
      stories.forEach(s => { s.classList.remove('on'); s.querySelectorAll('.on,.now,.done').forEach(e => e.classList.remove('on', 'now', 'done')); });
      stage.removeAttribute('style');
      cur = -1; shown = '';
    }
    resetNumbers();
    update();
  }
  pinMQ.addEventListener('change', () => {
    const at = cur >= 0 ? cur : 0;
    setMode();
    if (hl.getBoundingClientRect().top < 0) go(at);
  });
  reduceMQ.addEventListener('change', () => { reduce = reduceMQ.matches; setCursor(); update(); });

  /* ---------- focus trap ---------- */
  const FOCUSABLE = 'a[href],button:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])';
  function trap(e, root) {
    const f = [...root.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null || el === D.activeElement);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (D.activeElement === first || !root.contains(D.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (D.activeElement === last || !root.contains(D.activeElement))) { e.preventDefault(); first.focus(); }
  }

  /* ---------- work panel ---------- */
  const panel = $('panel'), pb = $('pb'), pt = $('pt'), scrim = $('scrim');
  let panelOpen = false, panelFor = -1, panelReturn = null, gal = [], clearTimer = 0;
  function openPanel(i, opener) {
    const src = $('ev-' + ids[i]);
    if (!src) return;
    clearTimeout(clearTimer);
    panelReturn = opener || D.activeElement;
    panelFor = i;
    pt.textContent = src.dataset.name;
    pb.innerHTML = '';
    const c = src.cloneNode(true);
    c.removeAttribute('id'); c.hidden = false;
    c.querySelectorAll('[data-src]').forEach(el => { el.src = el.dataset.src; el.removeAttribute('data-src'); });
    pb.append(c);
    gal = [...pb.querySelectorAll('.shot')];
    gal.forEach((b, k) => b.addEventListener('click', () => openLb(k)));
    panel.inert = false;
    D.body.classList.add('open');
    R.classList.add('locked');
    panelOpen = true;
    panel.scrollTop = 0;
    $('px').focus({ preventScroll: true });
    setHash(ids[i] + '/evidence');
    updateBar();
  }
  function closePanel() {
    if (!panelOpen) return;
    panelOpen = false;
    D.body.classList.remove('open');
    R.classList.remove('locked');
    panel.inert = true;
    clearTimer = setTimeout(() => { if (!panelOpen) pb.innerHTML = ''; }, 500);
    const s = hlState();
    setHash(pin && s.inside ? ids[s.i] : '');
    if (panelReturn && panelReturn.focus) panelReturn.focus({ preventScroll: true });
    updateBar();
  }
  D.querySelectorAll('.ev').forEach(b => b.addEventListener('click', () => openPanel(+b.dataset.i, b)));
  $('px').addEventListener('click', closePanel);
  scrim.addEventListener('click', closePanel);

  /* ---------- lightbox ---------- */
  const lb = $('lb'), lbi = $('lbi'), lbc = $('lbc');
  let gi = 0, lbReturn = null;
  function showLb() {
    const b = gal[gi], im = b.querySelector('img');
    lbi.src = im.currentSrc || im.src;
    lbi.alt = im.alt;
    lbc.textContent = b.dataset.cap + ' · ' + (gi + 1) + ' / ' + gal.length;
  }
  function openLb(k) {
    gi = k; lbReturn = gal[k];
    showLb();
    lb.hidden = false;
    panel.inert = true;
    $('lbx').focus({ preventScroll: true });
  }
  function closeLb() {
    lb.hidden = true;
    panel.inert = false;
    if (lbReturn) lbReturn.focus({ preventScroll: true });
  }
  const step = d => { gi = (gi + d + gal.length) % gal.length; showLb(); };
  $('lbp').addEventListener('click', () => step(-1));
  $('lbn').addEventListener('click', () => step(1));
  $('lbx').addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

  /* ---------- keyboard ---------- */
  addEventListener('keydown', e => {
    if (!lb.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); closeLb(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'Tab') trap(e, lb);
      return;
    }
    if (panelOpen) {
      if (e.key === 'Escape') { e.preventDefault(); closePanel(); }
      else if (e.key === 'Tab') trap(e, panel);
      return;
    }
    if (!pin || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || ''))) return;
    const s = hlState();
    if (!s.inside) return;
    const k = e.key;
    const dir = (k === 'ArrowDown' || k === 'j' || k === 'J' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) ? 1
      : (k === 'ArrowUp' || k === 'k' || k === 'K' || k === 'PageUp' || (k === ' ' && e.shiftKey)) ? -1 : 0;
    if (!dir) return;
    if (/^(BUTTON|A)$/.test(e.target.tagName || '') && k === ' ') return;
    e.preventDefault();
    const now = performance.now();
    if (now - stepAt < 450) return;
    if (stepHl(dir)) stepAt = now;
  });

  /* ---------- in-page links and deep links ---------- */
  function route(hash, first) {
    const [id, sub] = hash.replace(/^#/, '').split('/');
    const i = ids.indexOf(id);
    if (i >= 0) {
      if (first || !pin || sub === 'evidence') {
        if (pin) {
          scrollTo({ top: stepTop(i * B + (sub === 'evidence' ? 2 : 0)), behavior: 'instant' });
          update();
        } else stories[i].scrollIntoView({ behavior: first || sub ? 'instant' : behavior(), block: 'start' });
      } else go(i);
      update();
      if (sub === 'evidence') requestAnimationFrame(() => requestAnimationFrame(() => openPanel(i, stories[i].querySelector('.ev'))));
      else if (panelOpen) closePanel();
      return true;
    }
    if (/^t-/.test(id) && $(id)) {
      openNode(id);
      $(id).scrollIntoView({ behavior: first ? 'instant' : behavior(), block: 'start' });
      return true;
    }
    return false;
  }
  D.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const h = a.getAttribute('href'), id = h.slice(1).split('/')[0];
    if (ids.includes(id)) { e.preventDefault(); route(h, false); setHash(h.slice(1)); }
  });
  addEventListener('hashchange', () => route(location.hash, false));

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
  const HOT = 'a,button,.b,[role="button"]';
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
  D.addEventListener('pointerover', e => { if (cursorOn) curEl.classList.toggle('big', !!e.target.closest(HOT)); });
  D.addEventListener('pointerleave', () => curEl.classList.remove('show'));
  D.documentElement.addEventListener('mouseleave', () => curEl.classList.remove('show'));
  addEventListener('blur', () => curEl.classList.remove('show'));
  /* The gold light follows the cursor. With no pointer movement for 3s, or on touch screens,
     it drifts on its own along a slow Lissajous path (about 12s per loop). Off under reduced motion. */
  function glow() {
    raf = 0;
    if (reduce || !heroVisible) return;
    const now = performance.now(), r = lit.getBoundingClientRect();
    const drifting = !cursorOn || now - lastMove > 3000;
    if (drifting) {
      const right = Math.min(r.right, innerWidth), cx = (r.left + right) / 2, cy = r.top + r.height * 0.52;
      const t = now / 12000 * 2 * Math.PI;
      tx = cx + (right - r.left) * 0.3 * Math.sin(t);
      ty = cy + r.height * 0.3 * Math.sin(2 * t + Math.PI / 3);
    }
    const k = drifting ? 0.05 : 0.12;
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

  /* ---------- analytics: one "view-<id>" event per highlight per visit ----------
     Counted once a highlight has stayed active for a second, so passing through does not count.
     Guarded: if GoatCounter is blocked or not loaded yet, nothing breaks. */
  const viewed = new Set(), pendingViews = [];
  let viewTimer = 0, viewFor = -1;
  function sendView(id) {
    const gc = window.goatcounter;
    if (gc && typeof gc.count === 'function') {
      try { gc.count({ path: 'view-' + id, title: 'Highlight viewed: ' + id, event: true }); } catch (e) { /* ignore */ }
    } else pendingViews.push(id);
  }
  function viewSoon(i) {
    if (i === viewFor) return;
    viewFor = i;
    clearTimeout(viewTimer);
    if (i < 0 || viewed.has(i)) return;
    viewTimer = setTimeout(() => { viewed.add(i); sendView(ids[i]); }, 1000);
  }
  addEventListener('load', () => {
    const flush = () => { if (window.goatcounter && typeof window.goatcounter.count === 'function') pendingViews.splice(0).forEach(sendView); };
    flush(); setTimeout(flush, 3000);
  });
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver(es => es.forEach(e => {
      if (pin) return;
      const i = +e.target.dataset.i;
      if (e.isIntersecting) viewSoon(i); else if (viewFor === i) viewSoon(-1);
    }), { threshold: 0.5 });
    stories.forEach(st => vio.observe(st));
  }

  /* ---------- small screens: the top bar hides on scroll down, returns on scroll up ---------- */
  const smallMQ = matchMedia('(max-width: 767px)');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (!smallMQ.matches || panelOpen) { bar.classList.remove('away'); lastY = y; return; }
    if (Math.abs(y - lastY) < 6) return;
    bar.classList.toggle('away', y > lastY && y > bar.offsetHeight && !bar.contains(D.activeElement));
    lastY = y;
  }, { passive: true });
  bar.addEventListener('focusin', () => bar.classList.remove('away'));

  /* ---------- start ---------- */
  setCursor();
  setMode();
  if (location.hash && location.hash !== '#') {
    requestAnimationFrame(() => route(location.hash, true));
  }
})();
