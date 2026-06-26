// Cool Stuff Sticker Sheet : render logic (vanilla, no framework).
// index.html sets data-mode="grid", all.html sets data-mode="reel".

(function () {
  var PHONE_W = 390, PHONE_H = 844;
  var DESK_W = 1280, DESK_H = 720;
  var stickers = window.STICKERS || [];

  function pad2(n) { return String(n).padStart(2, '0'); }
  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }

  // Builds the animation frame (browser / phone / soon) scaled to displayW.
  // Returns { node, fit } where fit(displayW) rescales it (used by the reel on resize).
  function buildFrame(s, displayW, interactive) {
    if (s.status === 'soon') {
      var slot = el('div', 'soon-slot');
      slot.style.width = displayW + 'px';
      slot.style.height = Math.round(displayW * 0.62) + 'px';
      var dots = el('div', 'soon-dots');
      dots.innerHTML = '<span></span><span></span><span></span>';
      var p = el('p'); p.textContent = 'Coming soon';
      slot.appendChild(dots); slot.appendChild(p);
      return { node: slot, fit: function () {} };
    }

    var iframe = el('iframe');
    iframe.title = s.title;
    iframe.src = s.src;
    iframe.setAttribute('scrolling', 'no');
    if (!interactive) { iframe.tabIndex = -1; iframe.style.pointerEvents = 'none'; }

    if (s.frame === 'mobile') {
      var bezel = el('div', 'phone-bezel');
      var screen = el('div', 'phone-screen');
      iframe.style.width = PHONE_W + 'px';
      iframe.style.height = PHONE_H + 'px';
      screen.appendChild(iframe);
      bezel.appendChild(screen);
      var fitMobile = function (w) {
        var scale = w / PHONE_W;
        bezel.style.width = w + 'px';
        screen.style.height = (PHONE_H * scale) + 'px';
        iframe.style.transform = 'scale(' + scale + ')';
      };
      fitMobile(displayW);
      return { node: bezel, fit: fitMobile };
    }

    var frame = el('div', 'browser-frame');
    var bar = el('div', 'browser-bar');
    bar.innerHTML = '<span></span><span></span><span></span>';
    var bodyEl = el('div', 'browser-body');
    iframe.style.width = DESK_W + 'px';
    iframe.style.height = DESK_H + 'px';
    bodyEl.appendChild(iframe);
    frame.appendChild(bar);
    frame.appendChild(bodyEl);
    var fitDesk = function (w) {
      var scale = w / DESK_W;
      frame.style.width = w + 'px';
      bodyEl.style.width = w + 'px';
      bodyEl.style.height = (DESK_H * scale) + 'px';
      iframe.style.transform = 'scale(' + scale + ')';
    };
    fitDesk(displayW);
    return { node: frame, fit: fitDesk };
  }

  // ---- Lightbox (grid) ----
  function makeLightbox() {
    var scrim = el('div', 'lb-scrim');
    scrim.innerHTML =
      '<div class="lb-panel">' +
        '<div class="lb-head">' +
          '<div><p class="lb-kicker">Preview</p><h3></h3></div>' +
          '<div class="lb-actions">' +
            '<a class="lb-tab" target="_blank" rel="noreferrer">Open in new tab ↗</a>' +
            '<button class="lb-close" aria-label="Close preview">✕</button>' +
          '</div>' +
        '</div>' +
        '<div class="lb-stage"></div>' +
      '</div>';
    document.body.appendChild(scrim);
    var panel = scrim.querySelector('.lb-panel');
    var title = scrim.querySelector('h3');
    var tab = scrim.querySelector('.lb-tab');
    var stage = scrim.querySelector('.lb-stage');

    function close() { scrim.classList.remove('open'); stage.innerHTML = ''; document.body.style.overflow = ''; }
    scrim.addEventListener('click', close);
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    scrim.querySelector('.lb-close').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    return function open(s) {
      title.textContent = s.title;
      tab.href = s.src;
      stage.innerHTML = '';
      if (s.frame === 'mobile') {
        stage.classList.add('lb-stage-mobile');
        var phone = el('div', 'lb-phone');
        var f = el('iframe'); f.title = s.title; f.src = s.src;
        f.style.width = PHONE_W + 'px'; f.style.height = PHONE_H + 'px';
        phone.appendChild(f); stage.appendChild(phone);
      } else {
        stage.classList.remove('lb-stage-mobile');
        var fr = el('iframe', 'lb-frame'); fr.title = s.title; fr.src = s.src;
        stage.appendChild(fr);
      }
      scrim.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
  }

  // ---- Grid ----
  function renderGrid() {
    var grid = document.getElementById('grid');
    var openLightbox = makeLightbox();

    stickers.forEach(function (s, i) {
      var live = s.status === 'live';
      var card = el('article', 'card ' + (live ? 'card-live' : 'card-soon'));

      var num = el('span', 'num'); num.textContent = pad2(i + 1);
      card.appendChild(num);

      var wrap = el('button', 'preview-wrap');
      wrap.type = 'button';
      if (!live) wrap.disabled = true;
      var displayW = s.frame === 'mobile' ? 188 : 408;
      wrap.appendChild(buildFrame(s, displayW, false).node);
      if (live) {
        var hint = el('span', 'expand-hint'); hint.textContent = 'Click to expand';
        wrap.appendChild(hint);
        wrap.addEventListener('click', function () { openLightbox(s); });
      }
      card.appendChild(wrap);

      var meta = el('div', 'card-meta');
      var h2 = el('h2'); h2.textContent = s.title;
      var blurb = el('p', 'blurb'); blurb.textContent = s.blurb;
      var foot = el('div', 'card-foot');
      var tag = el('span', 'tag'); tag.textContent = s.tag;
      foot.appendChild(tag);
      if (live) {
        var btn = el('button', 'open-btn'); btn.type = 'button'; btn.textContent = 'Preview';
        btn.addEventListener('click', function () { openLightbox(s); });
        foot.appendChild(btn);
      }
      meta.appendChild(h2); meta.appendChild(blurb); meta.appendChild(foot);
      card.appendChild(meta);

      grid.appendChild(card);
    });

    var live = stickers.filter(function (s) { return s.status === 'live'; }).length;
    var soon = stickers.filter(function (s) { return s.status === 'soon'; }).length;
    var count = document.querySelector('.count');
    if (count) count.textContent = live + ' live · ' + soon + ' in progress';
  }

  // ---- Reel ----
  function renderReel() {
    var reel = document.getElementById('reel');
    var fits = [];

    stickers.forEach(function (s, i) {
      var live = s.status === 'live';
      var item = el('section', 'reel-item' + (live ? '' : ' reel-soon'));

      var head = el('div', 'reel-head');
      var num = el('span', 'reel-num'); num.textContent = pad2(i + 1);
      var titleWrap = el('div');
      var h2 = el('h2'); h2.textContent = s.title;
      var tag = el('p', 'reel-tag'); tag.textContent = s.tag;
      titleWrap.appendChild(h2); titleWrap.appendChild(tag);
      head.appendChild(num); head.appendChild(titleWrap);
      if (live) {
        var tab = el('a', 'reel-tab'); tab.href = s.src; tab.target = '_blank';
        tab.rel = 'noreferrer'; tab.textContent = 'Open in new tab ↗';
        head.appendChild(tab);
      }
      item.appendChild(head);

      var blurb = el('p', 'reel-blurb'); blurb.textContent = s.blurb;
      item.appendChild(blurb);

      var wrap = el('div', 'reel-frame-wrap');
      var cap = s.frame === 'mobile' ? 380 : 1000;
      var built = buildFrame(s, cap, true);
      wrap.appendChild(built.node);
      item.appendChild(wrap);
      reel.appendChild(item);

      fits.push({ wrap: wrap, fit: built.fit, cap: cap });
    });

    function resize() {
      fits.forEach(function (f) {
        var avail = f.wrap.clientWidth - 56; // reel-frame-wrap padding
        f.fit(Math.max(160, Math.min(f.cap, avail)));
      });
    }
    window.addEventListener('resize', resize);
    resize();
  }

  var mode = document.body.getAttribute('data-mode');
  if (mode === 'reel') renderReel();
  else renderGrid();
})();
