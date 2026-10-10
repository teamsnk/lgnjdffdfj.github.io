(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var icon = function (n, cls) { return '<svg class="' + (cls || 'ic') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };

  /* ---------- scroll progress + nav spy ---------- */
  var prog = $('#progress');
  var links = $$('#nav a');
  var secs = links.map(function (a) { return $(a.getAttribute('href')); });
  function onScroll() {
    var h = document.documentElement;
    prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    var y = h.scrollTop + 120, cur = -1;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) {
      var on = i === cur;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    var active = links[cur];
    if (active && active.scrollIntoView && window.innerWidth < 820) {
      var nav = $('#nav'); nav.scrollLeft = active.offsetLeft - 40;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- animate bars ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .4 });
    $$('.bar').forEach(function (b) { io.observe(b); });
  } else { $$('.bar').forEach(function (b) { b.classList.add('in'); }); }

  /* ---------- digital wireframes ---------- */
  var wfData = [
    ['Add', ['bar', 'row3', 'row3', 'row3'], 'Choose how to add: scan, upload or manual'],
    ['Scan', ['cam', 'dots', 'btnc'], 'Camera frame, light tip, shutter, fallbacks'],
    ['Result', ['img', 'title', 'rows', 'btn', 'btn2'], 'Match, confidence, care, add or retake'],
    ['Tasks', ['bar', 'prog', 'card', 'card', 'card', 'banner'], 'Tasks by day with progress']
  ];
  var wfs = $('#wfs');
  if (wfs) {
    wfData.forEach(function (d, i) {
      var f = document.createElement('figure'); f.className = 'shot';
      var body = d[1].map(function (b) { return '<i class="wb ' + b + '"></i>'; }).join('');
      f.innerHTML = '<div class="wf" role="img" aria-label="Wireframe: ' + d[0] + '">' + body + '<span class="wtab"></span></div><figcaption><b>' + (i + 1) + ' · ' + d[0] + '</b>' + d[2] + '</figcaption>';
      wfs.appendChild(f);
    });
  }

  /* ---------- design-system task demo ---------- */
  var td = $('#taskdemo');
  if (td) {
    td.innerHTML = '<div style="display:grid;gap:10px;width:100%">' + [['Water Monstera', 'Monstera · 8:00 AM'], ['Mist ZZ Plant', 'ZZ Plant · 8:00 AM']].map(function (t, i) {
      return '<div class="task' + (i ? ' done' : '') + '" style="margin:0"><div class="tx"><b>' + t[0] + '</b><span>' + t[1] + '</span></div><button class="chk" type="button" aria-pressed="' + (i ? 'true' : 'false') + '" aria-label="Mark ' + t[0] + ' done">' + icon('check') + '</button></div>';
    }).join('') + '</div>';
    $$('.chk', td).forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.closest('.task'); var d = t.classList.toggle('done'); b.setAttribute('aria-pressed', d);
      });
    });
  }

  /* ---------- phone screens ---------- */
  var IMG = 'assets/src/';
  var state = { screen: 'add', mode: 'high', alt: 0, loc: 'Indoor', done: [true, false, false], toast: null };
  var order = ['add', 'perm', 'camera', 'scanning', 'result', 'details', 'added', 'tasks'];
  var steps = [
    { id: 'add', t: 'Choose a way to add', d: 'Scan is the lead option; upload and manual are always visible.' },
    { id: 'camera', t: 'Scan the plant', d: 'Permission explained first. A frame and a light tip help beginners get a good photo.' },
    { id: 'scanning', t: 'Identifying', d: 'Visible progress with cancel, announced to screen readers.' },
    { id: 'result', t: 'Result you can correct', d: 'Confidence, plain care fields, alternatives, Retake. Never a dead end.' },
    { id: 'details', t: 'Where does it live?', d: 'One short step so Plants can filter by Indoor, Balcony or Rooftop.' },
    { id: 'added', t: 'Added, and what happens next', d: 'Names the watering task it just created and links to Today.' },
    { id: 'tasks', t: 'Today', d: 'Short cards, labelled check, Undo, progress and encouragement.' }
  ];
  var stepOf = { add: 0, perm: 1, camera: 1, scanning: 2, result: 3, details: 4, added: 5, tasks: 6 };

  function status() { return '<div class="sbar"><span>9:41</span><span aria-hidden="true">●●● ▮</span></div>'; }
  function tabbar(active) {
    var t = [['home', 'home', 'Home'], ['plants', 'plant', 'Plants'], ['add', 'plus', 'Add'], ['tasks', 'today', 'Today'], ['profile', 'user', 'Profile']];
    return '<nav class="tabbar" aria-label="Main">' + t.map(function (x) {
      return '<button type="button" class="tab' + (x[0] === 'add' ? ' add' : '') + (x[0] === active ? ' on' : '') + '" data-tab="' + x[0] + '"' + (x[0] === active ? ' aria-current="page"' : '') + '>' + icon(x[1]) + x[2] + '</button>';
    }).join('') + '</nav>';
  }
  function appbar(title, back) {
    return '<div class="appbar"><button type="button" class="ibtn" data-go="' + back + '" aria-label="Back">' + icon('back') + '</button><h5>' + title + '</h5><span style="width:44px"></span></div>';
  }
  function care(rows) {
    return rows.map(function (r) { return '<div class="cf">' + icon(r[0]) + '<b>' + r[1] + '</b><span>' + r[2] + '</span></div>'; }).join('');
  }
  var alts = [['Pothos', 'Epipremnum aureum'], ['Heartleaf philodendron', 'Philodendron hederaceum'], ['Devil’s ivy', 'Scindapsus pictus']];

  var S = {
    add: function () {
      return status() + '<div class="sc-body">' + appbar('Add a plant', 'tasks').replace('data-go="tasks"', 'data-go="add"') +
        '<p class="pad muted" style="margin:0 0 14px;color:var(--ink-2)">Choose how you’d like to add your plant.</p>' +
        '<button class="mopt main" data-go="perm" type="button"><span class="ico">' + icon('scan') + '</span><span><b>Scan plant</b><span class="s">Use your camera to identify it</span></span></button>' +
        '<button class="mopt" data-go="result" data-note="gallery" type="button"><span class="ico">' + icon('img') + '</span><span><b>Upload a photo</b><span class="s">Choose from your gallery</span></span></button>' +
        '<button class="mopt" data-go="details" data-note="manual" type="button"><span class="ico">' + icon('pen') + '</span><span><b>Add manually</b><span class="s">Type the plant’s name yourself</span></span></button>' +
        '</div>' + tabbar('add');
    },
    perm: function () {
      return status() + '<div class="sc-body">' + appbar('Scan plant', 'add') +
        '<div class="pad" style="text-align:center;padding-top:36px"><div class="ico" style="width:92px;height:92px;border-radius:28px;background:var(--leaf-tint);display:grid;place-items:center;margin:0 auto 22px;color:var(--green-deep)">' + icon('cam', 'ic" style="width:44px;height:44px') + '</div>' +
        '<h6 style="font-size:22px;margin:0 0 10px;color:var(--green-deep)">Let Little Garden use your camera</h6>' +
        '<p style="color:var(--ink-2);font-size:15px">We only use it to look at your plant. Photos stay on your phone until you choose to add the plant.</p></div>' +
        '<button class="btnf p" data-go="camera" type="button" style="margin-top:20px">Allow camera</button>' +
        '<button class="btnf s" data-go="result" data-note="gallery" type="button">Upload a photo instead</button>' +
        '<button class="btnf t" data-go="details" data-note="manual" type="button">Add manually</button></div>' + tabbar('add');
    },
    camera: function () {
      return status() + '<div class="sc-body"><div class="cam"><figure class="view"><img src="' + IMG + 'scan-photo.jpg" alt="Camera view of a pothos in a pot">' +
        '<div class="frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
        '<div class="hint">' + icon('bulb') + '<span>Place the plant in the frame. Natural light gives a better result.</span></div></figure>' +
        '<div class="camctl"><button class="ibtn" data-go="result" data-note="gallery" type="button" aria-label="Upload from gallery">' + icon('img') + '</button>' +
        '<button class="shutter" data-go="scanning" type="button" aria-label="Take photo"><i></i></button>' +
        '<button class="ibtn" data-go="add" type="button" aria-label="Close camera">' + icon('back') + '</button></div></div></div>';
    },
    scanning: function () {
      return status() + '<div class="sc-body"><div class="cam"><figure class="view"><img src="' + IMG + 'scan-photo.jpg" alt="">' +
        '<div class="scanline" aria-hidden="true"></div>' +
        '<div class="scanning" role="status"><div class="ring" aria-hidden="true"></div><b style="font-size:18px">Identifying your plant…</b><span style="font-size:14px;color:#D6E5DA">This usually takes a few seconds</span>' +
        '<button class="btnf s" data-go="camera" type="button" style="width:200px;margin:8px 0 0">Cancel</button></div></figure></div></div>';
    },
    result: function () {
      var low = state.mode === 'low';
      var a = alts[state.alt];
      var conf = low ? '<span class="conf low">' + icon('alert', 'ic" style="width:16px;height:16px') + 'Not sure · 54% match</span>' : '<span class="conf">' + icon('check', 'ic" style="width:16px;height:16px;stroke-width:3') + (state.alt ? 'You chose this' : '95% match') + '</span>';
      var head = low ? '<h6>We couldn’t tell for sure</h6><div class="lat">These are the closest matches</div>' : '<h6>' + a[0] + '</h6><div class="lat">' + a[1] + '</div>';
      var alt = (low || state.showAlt)
        ? '<div class="alts" role="group" aria-label="Other possible matches">' + alts.map(function (x, i) { return '<button type="button" data-alt="' + i + '" class="' + (!low && i === state.alt ? 'on' : '') + '" aria-pressed="' + (!low && i === state.alt) + '">' + x[0] + '</button>'; }).join('') + '</div>'
        : '<div class="alts"><button type="button" id="notRight">Not right? See other matches</button></div>';
      var body = low
        ? '<p style="font-size:14.5px;color:var(--ink-2);margin:12px 0 0">Try a clearer photo of the leaves in natural light, or pick the closest match above.</p>'
        : care([['drop', 'Water', 'When top soil feels dry'], ['sun', 'Sunlight', 'Bright, indirect light'], ['therm', 'Temperature', '18–30°C'], ['hum', 'Humidity', 'Medium to high']]);
      var btns = low
        ? '<button class="btnf p" data-go="camera" type="button">Retake photo</button><button class="btnf s" data-go="details" data-note="manual" type="button">Add manually</button>'
        : '<button class="btnf p" data-go="details" type="button">Add to my plants</button><button class="btnf t" data-go="camera" type="button">Retake photo</button>';
      return status() + '<div class="sc-body"><div class="resimg"><img src="' + IMG + 'pothos-large.jpg" alt="Your photo of a pothos plant">' +
        '<button type="button" class="ibtn" data-go="camera" aria-label="Back" style="position:absolute;left:14px;top:6px;background:#fff">' + icon('back') + '</button></div>' +
        '<div class="sheet">' + conf + head + alt + body + '<div class="acts">' + btns + '</div></div></div>';
    },
    details: function () {
      return status() + '<div class="sc-body">' + appbar('Almost there', 'result') +
        '<div style="display:flex;gap:12px;align-items:center;padding:0 18px 14px"><img src="' + IMG + 'pothos.jpg" alt="" style="width:64px;height:64px;border-radius:14px;object-fit:cover"><div><b style="font-size:17px;color:var(--green-deep)">' + (state.mode === 'low' ? 'Your plant' : alts[state.alt][0]) + '</b><div style="font-size:13px;color:var(--ink-2)">Care plan ready</div></div></div>' +
        '<span class="lbl" id="lblLoc">Where does it live?</span>' +
        '<div class="seg" role="group" aria-labelledby="lblLoc">' + ['Indoor', 'Balcony', 'Rooftop'].map(function (l) { return '<button type="button" data-loc="' + l + '" class="' + (state.loc === l ? 'on' : '') + '" aria-pressed="' + (state.loc === l) + '">' + l + '</button>'; }).join('') + '</div>' +
        '<span class="lbl">Give it a nickname (optional)</span><div style="margin:0 18px 16px;border:1.5px solid var(--control);border-radius:14px;min-height:52px;padding:12px 14px;color:var(--ink-2);font-size:15px">e.g. Pothos by the window</div>' +
        '<button class="btnf p" data-go="added" type="button">Save plant</button></div>' + tabbar('add');
    },
    added: function () {
      return status() + '<div class="sc-body"><div class="pad" style="text-align:center;padding-top:60px"><div style="width:84px;height:84px;border-radius:50%;background:var(--green);color:#fff;display:grid;place-items:center;margin:0 auto 22px">' + icon('check', 'ic" style="width:42px;height:42px;stroke-width:3') + '</div>' +
        '<h6 style="font-size:24px;margin:0 0 10px;color:var(--green-deep)" role="status">' + (state.mode === 'low' ? 'Plant' : alts[state.alt][0]) + ' added</h6>' +
        '<p style="color:var(--ink-2);font-size:15.5px">It’s in your ' + state.loc.toLowerCase() + ' plants. We made a watering task so you won’t have to remember.</p></div>' +
        '<div class="task" style="margin-top:14px"><img src="' + IMG + 'pothos.jpg" alt=""><div class="tx"><b>Check soil</b><span>' + icon('clock', 'ic" style="width:14px;height:14px') + ' Thursday · 8:00 AM</span></div></div>' +
        '<button class="btnf p" data-go="tasks" type="button" style="margin-top:12px">See today’s tasks</button>' +
        '<button class="btnf t" data-go="add" type="button">Add another plant</button></div>' + tabbar('add');
    },
    tasks: function () { return tasksHTML(true); }
  };

  function tasksHTML(live) {
    var items = [['Water Monstera', 'Monstera', 'monstera'], ['Repot Snake plant', 'Snake plant', 'snake'], ['Mist ZZ Plant', 'ZZ plant', 'zz']];
    var n = state.done.filter(Boolean).length;
    var cards = items.map(function (t, i) {
      var d = state.done[i];
      return '<div class="task' + (d ? ' done' : '') + '"><img src="' + IMG + t[2] + '.jpg" alt=""><div class="tx"><b>' + t[0] + '</b><span>' + icon('clock', 'ic" style="width:14px;height:14px') + ' 8:00 AM</span></div>' +
        '<button class="chk" type="button" data-chk="' + i + '" aria-pressed="' + d + '" aria-label="' + (d ? 'Undo ' : 'Mark ') + t[0] + (d ? '' : ' done') + '">' + icon('check') + '</button></div>';
    }).join('');
    var toast = state.toast ? '<div class="toast" role="status">' + icon('check') + '<span>' + state.toast + '</span><button type="button" data-undo="1">Undo</button></div>' : '';
    return status() + '<div class="sc-body">' + appbar('Today', 'home').replace('data-go="home"', 'data-go="added"') +
      '<div class="sec-t"><span>Friday, 4 September</span><small>' + n + ' of 3 done</small></div><div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="3" aria-valuenow="' + n + '"><i style="width:' + (n / 3 * 100) + '%"></i></div>' +
      cards +
      '<div class="sec-t" style="padding-top:2px"><span>Coming up</span></div>' +
      '<div class="task hl"><img src="' + IMG + 'pothos.jpg" alt=""><div class="tx"><b>Check soil · Pothos</b><span>New · Thursday</span></div><span class="pchip ok">' + icon('leaf', 'ic" style="width:12px;height:12px') + 'New</span></div>' +
      '<div class="banner" style="margin-top:2px"><b>You’re doing great</b>Consistency is the secret to a happy garden.</div>' + toast + '</div>' + tabbar('tasks');
  }

  var screenEl = $('#screen');
  var stepsEl = $('#steps');
  function renderSteps() {
    if (!stepsEl) return;
    stepsEl.innerHTML = steps.map(function (s, i) {
      return '<button type="button" role="tab" data-step="' + s.id + '" class="' + (stepOf[state.screen] === i ? 'on' : '') + '" aria-selected="' + (stepOf[state.screen] === i) + '"><b>' + (i + 1) + '</b><span><strong>' + s.t + '</strong>' + s.d + '</span></button>';
    }).join('');
  }
  function render() {
    if (!screenEl) return;
    screenEl.innerHTML = S[state.screen]();
    renderSteps();
    if (state.screen === 'scanning') {
      clearTimeout(render.t);
      render.t = setTimeout(function () { if (state.screen === 'scanning') go('result'); }, 2400);
    }
  }
  function go(id, note) {
    if (id === 'result' && note !== 'keep') { state.alt = 0; state.showAlt = false; }
    state.screen = id; state.toast = null; render();
  }
  if (screenEl) {
    screenEl.addEventListener('click', function (e) {
      var el = e.target.closest('[data-go],[data-alt],[data-loc],[data-chk],[data-undo],#notRight,[data-tab]');
      if (!el) return;
      if (el.dataset.go) { go(el.dataset.go); return; }
      if (el.dataset.tab) { var m = { home: 'tasks', plants: 'tasks', add: 'add', tasks: 'tasks', profile: 'add' }; go(m[el.dataset.tab]); return; }
      if (el.id === 'notRight') { state.showAlt = true; render(); return; }
      if (el.dataset.alt !== undefined) { state.alt = +el.dataset.alt; if (state.mode === 'low') { state.mode = 'high'; } render(); return; }
      if (el.dataset.loc) { state.loc = el.dataset.loc; render(); return; }
      if (el.dataset.chk !== undefined) {
        var i = +el.dataset.chk; state.done[i] = !state.done[i];
        state.toast = state.done[i] ? 'Marked as done. Nice work.' : null; render(); return;
      }
      if (el.dataset.undo) {
        var last = state.done.lastIndexOf(true); if (last > -1) state.done[last] = false; state.toast = null; render();
      }
    });
  }
  if (stepsEl) stepsEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-step]'); if (!b) return; go(b.dataset.step);
  });
  var lowBtn = $('#lowBtn'), resetBtn = $('#resetBtn');
  if (lowBtn) lowBtn.addEventListener('click', function () { state.mode = 'low'; state.alt = 0; state.done = [true, false, false]; go('camera'); });
  if (resetBtn) resetBtn.addEventListener('click', function () { state.mode = 'high'; state.alt = 0; state.loc = 'Indoor'; state.done = [true, false, false]; go('add'); });

  /* size phone to container */
  function fit() {
    var w = $('#phoneWrap'); if (!w) return;
    var s = Math.min(.85, (window.innerWidth - 56) / 375); w.style.setProperty('--s', s);
  }
  window.addEventListener('resize', fit); fit();

  /* static "after" phone */
  var ap = $('#afterPhone');
  if (ap) {
    var saved = { mode: state.mode, alt: state.alt, showAlt: state.showAlt };
    state.mode = 'high'; state.alt = 0; state.showAlt = true;
    ap.innerHTML = '<div class="phone-wrap" style="--s:.72"><div class="phone"><div class="screen" inert>' + S.result() + '</div></div></div>';
    state.mode = saved.mode; state.alt = saved.alt; state.showAlt = saved.showAlt;
  }

  render();
})();
