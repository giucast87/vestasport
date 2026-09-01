/* Vesta Sport — shared behaviour */
(function () {
  'use strict';

  /* year in footer */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

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
