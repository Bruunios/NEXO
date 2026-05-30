(function () {
  if (window.SFX) return;

  var _ctx = null;
  function ac() {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }

  function tone(freq, type, t, dur, vol) {
    var c = ac(), o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.01);
  }

  function sweep(f0, f1, type, t, dur, vol) {
    var c = ac(), o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.01);
  }

  var sounds = {
    // Soft two-note ascending — page navigation
    navigate: function () {
      var c = ac(), t = c.currentTime;
      tone(440, 'sine', t, 0.09, 0.1);
      tone(554, 'sine', t + 0.06, 0.09, 0.09);
    },
    // Quick sweep — hamburger menu toggle
    hamburger: function () {
      var c = ac(), t = c.currentTime;
      sweep(450, 680, 'sine', t, 0.07, 0.1);
    },
    // Three-note ascending arpeggio — copy PIX success
    copySuccess: function () {
      var c = ac(), t = c.currentTime;
      tone(523, 'sine', t,        0.11, 0.15);
      tone(659, 'sine', t + 0.09, 0.11, 0.15);
      tone(784, 'sine', t + 0.18, 0.18, 0.15);
    },
    // Pitch drop pop — open event detail
    eventOpen: function () {
      var c = ac(), t = c.currentTime;
      sweep(620, 370, 'sine', t, 0.1, 0.14);
    },
    // Single click — calendar prev/next/hoje
    calendarNav: function () {
      var c = ac(), t = c.currentTime;
      tone(660, 'sine', t, 0.06, 0.1);
    },
    // Celebratory three-note — "Quero participar"
    participate: function () {
      var c = ac(), t = c.currentTime;
      tone(659,  'sine', t,       0.12, 0.16);
      tone(784,  'sine', t + 0.1, 0.12, 0.16);
      tone(1047, 'sine', t + 0.2, 0.22, 0.16);
    },
    // Rising sawtooth sweep + ping — search trigger
    search: function () {
      var c = ac(), t = c.currentTime;
      sweep(180, 860, 'sawtooth', t,        0.18, 0.05);
      tone(880,       'sine',     t + 0.15, 0.12, 0.1);
    },
    // Double-ping — use my location
    location: function () {
      var c = ac(), t = c.currentTime;
      tone(523, 'sine', t,        0.1, 0.14);
      tone(784, 'sine', t + 0.13, 0.1, 0.14);
    },
    // Tiny tick — filter/distance chip toggle
    filterToggle: function () {
      var c = ac(), t = c.currentTime;
      tone(780, 'sine', t, 0.04, 0.09);
    },
    // Descending two-note — nova busca / reset
    novaBusca: function () {
      var c = ac(), t = c.currentTime;
      tone(784, 'sine', t,        0.08, 0.12);
      tone(523, 'sine', t + 0.07, 0.1,  0.12);
    },
    // Pitch drop — select result card / map pin
    mapPin: function () {
      var c = ac(), t = c.currentTime;
      sweep(800, 480, 'sine', t, 0.1, 0.16);
    }
  };

  window.SFX = {
    play: function (name) {
      try { if (sounds[name]) sounds[name](); } catch (_) {}
    }
  };

  // Navigation links and hamburger — global delegation (capture phase)
  document.addEventListener('click', function (e) {
    if (e.target.closest('a.nav-link')) {
      SFX.play('navigate');
    } else if (e.target.closest('#nav-hamburger')) {
      SFX.play('hamburger');
    }
  }, true);

})();
