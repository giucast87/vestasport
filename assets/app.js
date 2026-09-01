/* Vesta Sport — shared behaviour */
(function () {
  'use strict';

  /* year in footer */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* speed-veil page transition: the veil starts closed (covering the
     page), opens shortly after load, and closes again before any
     same-site navigation to give a fast "wipe" transition. */
  var veil = document.querySelector('.speed-veil');
  if (veil) {
    var openVeil = function () { document.body.classList.add('veil-open'); };

    requestAnimationFrame(function () { requestAnimationFrame(openVeil); });
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) openVeil();
    });

    document.addEventListener('click', function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a');
      if (!a || !a.getAttribute('href')) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      var href = a.getAttribute('href');
      if (href.indexOf('#') === 0 || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;

      var url;
      try { url = new URL(a.href, window.location.href); } catch (err) { return; }
      if (url.origin !== window.location.origin || url.href === window.location.href) return;

      e.preventDefault();
      document.body.classList.remove('veil-open');
      var spans = veil.querySelectorAll('span');
      var last = spans[spans.length - 1];
      var go = function () {
        if (go.done) return;
        go.done = true;
        window.location.href = url.href;
      };
      last.addEventListener('transitionend', go, { once: true });
      setTimeout(go, 650); /* safety net in case the transition never fires */
    });
  }

  /* drawer */
  var btn = document.getElementById('drawerBtn');
  var drawer = document.getElementById('drawer');
  var scrim = document.getElementById('scrim');

  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (btn) {
    btn.addEventListener('click', function () {
      setDrawer(!drawer.classList.contains('open'));
    });
    scrim.addEventListener('click', function () { setDrawer(false); });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setDrawer(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setDrawer(false);
    });

    /* show the burger once the top bar has scrolled away (desktop only) */
    var onScroll = function () {
      if (window.innerWidth <= 1000) return;      /* always visible on mobile via CSS */
      btn.classList.toggle('show', window.scrollY > 90);
      if (window.scrollY <= 90) setDrawer(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* contact/apply dropdown */
  var ctaDropdown = document.getElementById('ctaDropdown');
  if (ctaDropdown) {
    var ctaBtn = document.getElementById('ctaBtn');
    var ctaMenu = document.getElementById('ctaMenu');
    var setCta = function (open) {
      ctaDropdown.classList.toggle('open', open);
      ctaBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    ctaBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setCta(!ctaDropdown.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
      if (!ctaDropdown.contains(e.target)) setCta(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setCta(false);
    });
    ctaMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setCta(false); });
    });
  }

  /* animated nav indicator: a glider pill slides between links on
     hover and rests under the current page when the pointer leaves. */
  var mainnav = document.querySelector('.mainnav');
  if (mainnav) {
    var glider = document.createElement('span');
    glider.className = 'nav-glider';
    glider.setAttribute('aria-hidden', 'true');
    mainnav.appendChild(glider);
    var navLinks = mainnav.querySelectorAll('a');
    var current = mainnav.querySelector('a[aria-current="page"]');
    var moveGlider = function (el) {
      if (!el) { glider.classList.remove('on'); return; }
      var r = el.getBoundingClientRect();
      var nr = mainnav.getBoundingClientRect();
      glider.style.width = r.width + 'px';
      glider.style.transform = 'translateX(' + (r.left - nr.left) + 'px)';
      glider.classList.add('on');
    };
    navLinks.forEach(function (a) {
      a.addEventListener('mouseenter', function () { moveGlider(a); });
      a.addEventListener('focus', function () { moveGlider(a); });
    });
    mainnav.addEventListener('mouseleave', function () { moveGlider(current); });
    window.addEventListener('resize', function () { moveGlider(current); });
    moveGlider(current);
  }

  /* reveal on scroll + counters */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(function (el) {
        if (el.dataset.done) return;
        el.dataset.done = '1';
        var target = parseInt(el.dataset.count, 10) || 0;
        var start = performance.now(), dur = 1100;
        (function step(now) {
          var p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* forms are static: no back end is wired up yet */
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('This form is not connected to a back end yet.\nHook it up to your form service (Formspree, Netlify Forms, WP Forms...) or send an email to info@vestasport.it.');
    });
  });
})();
