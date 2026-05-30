(function () {
  var loadedExternal = new Set();

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
    navigate(href);
  });

  function navigate(href) {
    var view = document.getElementById('nexo-view');
    if (!view) { location.href = href; return; }

    view.style.transition = 'opacity .15s';
    view.style.opacity = '0.25';

    fetch(href)
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');

        // Load any new head CSS (e.g. Leaflet)
        doc.querySelectorAll('head link[rel="stylesheet"]').forEach(function (link) {
          var h = link.getAttribute('href');
          if (h && !document.querySelector('link[href="' + h + '"]')) {
            var el = document.createElement('link');
            el.rel = 'stylesheet';
            el.href = h;
            document.head.appendChild(el);
          }
        });

        // Swap inline <style> blocks from the new page
        var newStyles = Array.from(doc.querySelectorAll('head style'));
        var curStyles = Array.from(document.querySelectorAll('head style'));
        newStyles.forEach(function (style, i) {
          if (curStyles[i]) {
            curStyles[i].textContent = style.textContent;
          } else {
            var el = document.createElement('style');
            el.textContent = style.textContent;
            document.head.appendChild(el);
          }
        });

        // Swap view content
        var newView = doc.getElementById('nexo-view');
        if (newView) view.innerHTML = newView.innerHTML;

        // URL + title
        history.pushState({ href: href }, doc.title, href);
        document.title = doc.title;

        // Active nav link
        document.querySelectorAll('a.nav-link').forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === href);
        });

        window.scrollTo(0, 0);
        view.style.opacity = '1';

        return runScripts(view);
      })
      .catch(function (err) {
        console.error('[router]', err);
        location.href = href;
      });
  }

  function runScripts(container) {
    var scripts = Array.from(container.querySelectorAll('script'));
    return scripts.reduce(function (chain, old) {
      return chain.then(function () {
        var src = old.getAttribute('src') || '';

        // Skip navbar.js and router.js — already running
        if (/navbar\.js|router\.js/.test(src)) {
          old.remove();
          return;
        }

        var s = document.createElement('script');
        Array.from(old.attributes).forEach(function (attr) {
          s.setAttribute(attr.name, attr.value);
        });
        s.textContent = old.textContent;

        if (src) {
          if (loadedExternal.has(src)) {
            old.remove();
            return;
          }
          return new Promise(function (resolve) {
            s.onload = s.onerror = resolve;
            loadedExternal.add(src);
            old.replaceWith(s);
          });
        } else {
          old.replaceWith(s);
        }
      });
    }, Promise.resolve());
  }

  window.addEventListener('popstate', function (e) {
    var href = (e.state && e.state.href) || location.pathname.split('/').pop() || 'home.html';
    navigate(href);
  });

  history.replaceState(
    { href: location.pathname.split('/').pop() || 'home.html' },
    document.title,
    location.href
  );
})();
