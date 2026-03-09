  function loadScripts(e) {
    setTimeout(function () {
      if (window._lazyCSS) {
        _lazyCSS.forEach(function(href) {
          loadCSS(href);
        });
      }

      if (window._lazyJS) {
        _lazyJS.forEach(function(src) {
          loadScript(src);
        });
      }
    }, 10);

    // Remove event listeners after first trigger
    document.removeEventListener('click', loadScripts);
    document.removeEventListener('mouseover', loadScripts);
    document.removeEventListener('scroll', loadScripts);
  }

  if (window.scrollY >= 400) {
    loadScripts();
  } else {
    document.addEventListener('mouseover', loadScripts);
    document.addEventListener('click', loadScripts);
    document.addEventListener('scroll', loadScripts);
  }

  function loadScript(src) {
    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  }

  function loadScriptWithCallBack(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = callback || function () {};
    document.head.appendChild(script);
  }

  function loadCSS(href) {
    var link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
  }
