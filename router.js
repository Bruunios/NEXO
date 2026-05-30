(function () {
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (href.indexOf('://') !== -1 || href.indexOf('mailto:') === 0) return;
    if (!href.endsWith('.html')) return;

    var cur = location.pathname.split('/').pop() || 'home.html';
    if (href === cur) return;

    e.preventDefault();
    var view = document.getElementById('nexo-view');
    if (view) {
      view.style.transition = 'opacity .12s';
      view.style.opacity = '0';
      setTimeout(function () { location.href = href; }, 130);
    } else {
      location.href = href;
    }
  });

  // Fade in on page load
  var view = document.getElementById('nexo-view');
  if (view) {
    view.style.opacity = '0';
    requestAnimationFrame(function () {
      view.style.transition = 'opacity .2s';
      view.style.opacity = '1';
    });
  }
})();
