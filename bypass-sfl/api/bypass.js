const UPSTREAM = process.env.SFL_API_URL || 'https://api.ikyyxd.my.id/tools/skiplink/sfl';
const TIMEOUT_MS = 20000;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { status: false, message: 'Method tidak diizinkan' });
  }

  const raw = (req.query && req.query.url) || '';
  const link = Array.isArray(raw) ? raw[0] : raw;

  let parsed;
  try { parsed = new URL(link); } catch (_) { parsed = null; }
  if (!parsed || !/^https?:$/.test(parsed.protocol) || link.length > 2048) {
    return send(res, 400, { status: false, message: 'Link tidak valid' });
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const up = await fetch(UPSTREAM + '?url=' + encodeURIComponent(link), {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (compatible; NyrBypassSFL/1.0)' },
      signal: ctrl.signal,
    });
    const text = await up.text();
    let data;
    try { data = JSON.parse(text); } catch (_) { data = null; }

    if (!up.ok || !data) {
      return send(res, 502, { status: false, message: `API sumber merespon error (${up.status})` });
    }
    return send(res, 200, data);
  } catch (e) {
    const timeout = e && e.name === 'AbortError';
    return send(res, timeout ? 504 : 502, {
      status: false,
      message: timeout ? 'API sumber terlalu lama merespon' : 'Gagal menghubungi API sumber',
    });
  } finally {
    clearTimeout(timer);
  }
};
