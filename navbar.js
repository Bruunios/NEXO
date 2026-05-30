(function () {
  var hamburger = document.getElementById('nav-hamburger');
  var navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', function () {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
})();
