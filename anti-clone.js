(function () {
  'use strict';

  // Kosong = semua domain diizinkan. Isi untuk mengunci, mis. ['namamu.my.id'].
  var ALLOWED_HOSTS = [];

  // Tujuan setelah lolos (base64). Hasilkan dengan btoa('nama-folder/index.html').
  var TARGET_B64 = 'YnlwYXNzLXNmbC9pbmRleC5odG1s';

  var EXPECTED_TEXT = 'halaman ini dilindungi oleh anti-clone.js';

  function block(msg) {
    document.documentElement.innerHTML =
      '<body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;text-align:center;padding:16px">' +
      '<p>' + msg + '</p></body>';
  }

  function isBot() {
    var n = navigator, ua = n.userAgent || '', w = window, d = document;
    if (n.webdriver === true) return true;
    if (/HeadlessChrome|PhantomJS|Puppeteer|Playwright|Selenium|jsdom|HTTrack|WebCopier|Scrapy|python-requests|node-fetch|axios|curl\/|wget\/|Go-http-client|Java\//i.test(ua)) return true;
    if (!n.languages || n.languages.length === 0) return true;
    if (w.callPhantom || w._phantom || w.__nightmare || w.domAutomation || w.domAutomationController ||
        w.__playwright__binding__ || w.__pwInitScripts || w.__selenium_unwrapped || w.__webdriver_evaluate ||
        w.__driver_evaluate || w.__fxdriver_unwrapped) return true;
    try {
      for (var k in d) { if (/^\$?[a-z]dc_|^\$cdc_|webdriver/i.test(k)) return true; } // jejak chromedriver
    } catch (e) {}
    return false;
  }

  var root = document.getElementById('anti-clone-root');
  if (!root) return;

  if (location.protocol === 'file:') {
    return block('Buka lewat Preview Acode (http://localhost:...), bukan file://. Gunakan Preview di Acode atau web server lokal.');
  }
  if (ALLOWED_HOSTS.length && ALLOWED_HOSTS.indexOf(location.hostname) === -1) {
    return block('Domain tidak diizinkan oleh anti-clone.js.');
  }
  if (window.top !== window.self) {
    return block('Halaman ini tidak boleh dibuka di dalam frame.');
  }
  if (root.textContent.trim() !== EXPECTED_TEXT) {
    return block('index.html telah diubah. Verifikasi anti-clone gagal.');
  }
  if (isBot()) {
    return;
  }

  var target;
  try { target = atob(TARGET_B64); } catch (e) { return block('Konfigurasi anti-clone.js rusak.'); }
  location.replace(target);
})();
