(function () {
  // Capture this script's URL while it is executing so we can resolve sibling
  // assets (like `map/courts.csv`) reliably no matter how deep the current
  // page is, and regardless of whether the site is served from the domain
  // root locally or from a project subpath on GitHub Pages
  // (e.g. `/toronto-tennis/...`).
  const SCRIPT_URL = (function () {
    if (document.currentScript && document.currentScript.src) {
      return document.currentScript.src;
    }
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      const s = scripts[i];
      if (s.src && /\/assets\/site\.js(\?|#|$)/.test(s.src)) return s.src;
    }
    return null;
  })();

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;
    function pushCell() { row.push(cell); cell = ''; }
    function pushRow() { if (row.length) rows.push(row); row = []; }
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const nx = text[i + 1];
      if (ch === '"') {
        if (inQuotes && nx === '"') { cell += '"'; i++; } else { inQuotes = !inQuotes; }
        continue;
      }
      if (!inQuotes && ch === ',') { pushCell(); continue; }
      if (!inQuotes && (ch === '\n' || ch === '\r')) {
        if (ch === '\r' && nx === '\n') i++;
        pushCell(); pushRow(); continue;
      }
      cell += ch;
    }
    if (cell.length || row.length) { pushCell(); pushRow(); }
    if (!rows.length) return [];
    const headers = rows.shift().map((h) => h.trim());
    return rows.filter((r) => r.some((c) => c.trim() !== '')).map((values) => {
      const obj = {};
      for (let i = 0; i < headers.length; i++) obj[headers[i]] = (values[i] ?? '').trim();
      return obj;
    });
  }

  function sumNumber(value) {
    const n = parseInt(String(value || '').replace(/[^0-9]/g, ''), 10);
    return Number.isFinite(n) ? n : 0;
  }

  function bucketAccess(value) {
    const v = String(value || '').toLowerCase();
    if (!v) return 'private';
    if (v.includes('private') && v.includes('public')) return 'public_club';
    if (v.includes('club') && v.includes('public')) return 'public_club';
    if (!v.includes('private') && (v.includes('school') || v.includes('tdsb') || v.includes('tcdsb'))) return 'school';
    if (v.includes('public')) return 'public';
    if (v.includes('commercial') || v.includes('membership')) return 'commercial';
    return 'private';
  }

  function isIndoor(io) {
    const v = String(io || '').toLowerCase();
    return v.includes('indoor') || v.includes('both');
  }

  function findCsvUrl() {
    const explicit = document.documentElement.getAttribute('data-csv-url');
    if (explicit) return explicit;
    // `site.js` always lives at `<site-root>/assets/site.js`, so resolving
    // `../map/courts.csv` against it gives us `<site-root>/map/courts.csv`.
    // This works both locally (served from `/`) and on GitHub Pages
    // (served from `/toronto-tennis/`).
    if (SCRIPT_URL) {
      return new URL('../map/courts.csv', SCRIPT_URL).toString();
    }
    // Fallback: best-effort relative path from the current page.
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length && parts[parts.length - 1].includes('.')) parts.pop();
    const depth = parts.length;
    const prefix = depth === 0 ? '' : '../'.repeat(depth);
    return `${prefix}map/courts.csv`;
  }

  let rowsPromise = null;
  function fetchRows() {
    if (rowsPromise) return rowsPromise;
    const url = findCsvUrl();
    rowsPromise = fetch(url, { cache: 'no-store' })
      .then((resp) => {
        if (!resp.ok) throw new Error(`Failed to load ${url}`);
        return resp.text();
      })
      .then(parseCSV)
      .catch((err) => {
        rowsPromise = null;
        throw err;
      });
    return rowsPromise;
  }

  function fillCounts(rows) {
    // Counts by access bucket.
    const accessCourtCounts = { public: 0, public_club: 0, school: 0, commercial: 0, private: 0 };
    const accessLocCounts = { public: 0, public_club: 0, school: 0, commercial: 0, private: 0 };
    const surfaceCourtCounts = {};
    const surfaceLocCounts = {};
    const indoorCourts = { indoor: 0, outdoor: 0, both: 0 };
    rows.forEach((r) => {
      const key = bucketAccess(r['Public/Private']);
      const courts = sumNumber(r['Number of Courts']);
      accessCourtCounts[key] += courts;
      accessLocCounts[key] += 1;
      const surface = (r['Primary Surface'] || '').trim() || 'Unknown';
      surfaceCourtCounts[surface] = (surfaceCourtCounts[surface] || 0) + courts;
      surfaceLocCounts[surface] = (surfaceLocCounts[surface] || 0) + 1;
      const io = (r['Indoor/Outdoor'] || '').toLowerCase();
      if (io === 'indoor') indoorCourts.indoor += courts;
      else if (io === 'both') indoorCourts.both += courts;
      else indoorCourts.outdoor += courts;
    });

    document.querySelectorAll('[data-access-count]').forEach((el) => {
      const key = el.getAttribute('data-access-count');
      const courts = accessCourtCounts[key] ?? 0;
      const locs = accessLocCounts[key] ?? 0;
      el.textContent = `${locs} locations · ${courts} courts`;
    });

    document.querySelectorAll('[data-surface-count]').forEach((el) => {
      const key = el.getAttribute('data-surface-count');
      const courts = surfaceCourtCounts[key] ?? 0;
      const locs = surfaceLocCounts[key] ?? 0;
      el.textContent = `${locs} locations · ${courts} courts`;
    });

    return { rows, accessCourtCounts, accessLocCounts, surfaceCourtCounts, surfaceLocCounts, indoorCourts };
  }

  function setupNavToggle() {
    const btn = document.getElementById('nav-toggle');
    const nav = document.getElementById('site-nav');
    if (!btn || !nav) return;
    const apply = () => {
      if (window.matchMedia('(max-width: 880px)').matches) {
        nav.hidden = btn.getAttribute('aria-expanded') !== 'true';
      } else {
        nav.hidden = false;
      }
    };
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      apply();
    });
    window.addEventListener('resize', apply);
    apply();
  }

  window.TTS = {
    parseCSV,
    sumNumber,
    bucketAccess,
    isIndoor,
    fetchRows,
    fillCounts,
  };

  document.addEventListener('DOMContentLoaded', () => {
    setupNavToggle();
    if (document.querySelector('[data-access-count], [data-surface-count]')) {
      fetchRows().then(fillCounts).catch((err) => console.error('Stats load failed:', err));
    }
  });
})();
