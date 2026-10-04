/* anti-clone.js — verifikasi untuk index.html. Lolos => diarahkan ke website utama. */
(() => {
  const CFG = {
    allowedHosts: ['web2apk-nyr-free-sevenday.vercel.app'], // host persis; awalan titik = semua subdomain (mis. '.vercel.app', TIDAK disarankan)
    target: './web2apk-site/index.html',
    allowLocal: true,            // localhost / 127.0.0.1
    allowFile: false             // true = boleh dibuka dobel-klik (file://), hanya untuk tes
  };
  const fail = m => { const e = document.getElementById('ac-status'); if (e) e.textContent = 'Verifikasi gagal: ' + m; };
  const h = location.hostname, p = location.protocol;
  if (top !== self) { let same = false; try { same = top.location.hostname === h; } catch (e) {} if (!same) return fail('halaman tidak boleh di-embed'); }
  if (p === 'file:') { if (!CFG.allowFile) return fail('dibuka dari file lokal'); }
  else if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(h)) { if (!CFG.allowLocal) return fail('localhost tidak diizinkan'); }
  else {
    if (!/^https?:$/.test(p)) return fail('protokol tidak valid');
    if (CFG.allowedHosts.length && !CFG.allowedHosts.some(a => a[0] === '.' ? h.endsWith(a) : h === a)) return fail('domain tidak terdaftar');
    if (!CFG.allowedHosts.length) console.warn('[anti-clone] allowedHosts kosong, isi domainmu agar proteksi aktif');
  }
  location.replace(CFG.target);
})();
