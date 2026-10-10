(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var animate = root.classList.contains('anim');

  /* back to top (works with or without motion) */
  var btn = document.createElement('button');
  btn.className = 'totop'; btn.type = 'button'; btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14l6-6 6 6"/></svg>';
  btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: animate ? 'smooth' : 'auto' }); });
  document.body.appendChild(btn);
  var top = document.querySelector('.top');
  var hero = document.querySelector('.hero');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    btn.classList.toggle('show', y > 900);
    if (top) top.classList.toggle('sh', y > 20);
    if (animate && hero && y < hero.offsetHeight + 200) hero.style.setProperty('--py', (y * -0.12).toFixed(1) + 'px');
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  if (hero) { var c = document.createElement('i'); c.className = 'cue'; c.setAttribute('aria-hidden', 'true'); hero.appendChild(c); }
  if (!animate || !('IntersectionObserver' in window)) return;

  /* tag elements for reveal, with stagger by position among siblings */
  var groups = [
    ['.sec-head', ''], ['.facts', ''], ['.g3 > .card, .g2 > .card', ''], ['.dd > div', ''], ['.tablewrap', ''],
    ['.sticky > div', 'pop'], ['.callout', ''], ['.persona', ''], ['.hmw li', ''], ['.journey', ''],
    ['.tree > div', ''], ['.fig, .wf-note', ''], ['.prio .quad', ''], ['.shots .shot', ''], ['.swatches .sw', 'pop'],
    ['.cmp > div', ''], ['.timeline > div', ''], ['.road .card', ''], ['.issue', 'left'], ['.takeaways li', 'left'],
    ['.ba figure', ''], ['.chartcard', ''], ['.matrix', ''], ['.steps button', 'right'], ['.card.flat', ''], ['.refs p', '']
  ];
  var seen = [];
  groups.forEach(function (g) {
    $$(g[0]).forEach(function (el) {
      if (seen.indexOf(el) > -1 || el.closest('.phone')) return;
      seen.push(el);
      el.classList.add('rv');
      if (g[1]) el.classList.add(g[1]);
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(idx, 7));
    });
  });
  /* personas slide in from alternating sides */
  $$('.persona').forEach(function (p, i) { p.classList.add(i % 2 ? 'right' : 'left'); });
  $$('.matrix circle').forEach(function (c, i) { c.style.setProperty('--d', i); });

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.rv, .emo').forEach(function (el) { io.observe(el); });

  /* count-up for headline stats */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target, end = parseFloat(el.dataset.count), t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1400, 1), v = end * (1 - Math.pow(1 - p, 3));
        el.textContent = v.toFixed(1) + '%';
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(function (el) { el.textContent = '0.0%'; cio.observe(el); });

  /* safety: anything still hidden after load + 4s on a short page is revealed on next scroll end */
  window.addEventListener('load', function () {
    setTimeout(function () {
      $$('.rv:not(.in)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('in');
      });
    }, 400);
  });
})();
