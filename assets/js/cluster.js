// Prefix / flag lookup
let prefixData = null;
fetch('/assets/json/itu-prefix.json')
  .then(r => r.json())
  .then(d => { prefixData = d; });

function lookupCallsign(call) {
  if (!prefixData) return null;
  let best = null;
  for (const item of prefixData) {
    try {
      if (new RegExp(item.prefix, 'i').test(call)) {
        if (!best || item.prefix.length > best.prefix.length) best = item;
      }
    } catch(e) {}
  }
  return best;
}

let currentBand = 'all';
let knownIds = new Set();
let isFirstLoad = true;
let consecutiveErrors = 0;
let fetchGeneration = 0;

// Band picker
const bandBtn    = document.getElementById('bandBtn');
const bandPicker = document.getElementById('bandPicker');

function openPicker()  { bandPicker.hidden = false; bandBtn.classList.add('open'); bandBtn.setAttribute('aria-expanded', 'true'); }
function closePicker() { bandPicker.hidden = true;  bandBtn.classList.remove('open'); bandBtn.setAttribute('aria-expanded', 'false'); }

bandBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  bandPicker.hidden ? openPicker() : closePicker();
});

document.addEventListener('click', function(e) {
  if (!bandPicker.hidden && !bandPicker.contains(e.target)) closePicker();
});

bandPicker.addEventListener('click', function(e) {
  const chip = e.target.closest('.band-chip');
  if (!chip) return;
  bandPicker.querySelectorAll('.band-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  currentBand = chip.dataset.band;
  document.getElementById('bandLabel').textContent = chip.textContent.trim();
  closePicker();
  knownIds.clear();
  isFirstLoad = true;
  fetchGeneration++;
  fetchSpots();
});

function formatFreq(khz) {
  const mhz = khz / 1000;
  return mhz.toFixed(3).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function freqBandClass(khz) {
  if (khz < 30000)    return 'freq-hf';   // HF < 30 MHz
  if (khz < 300000)   return 'freq-vhf';  // VHF 30–300 MHz
  if (khz < 1200000)  return 'freq-uhf';  // UHF 300 MHz–1.2 GHz
  return 'freq-shf';                      // SHF >= 1.2 GHz
}

function extractMode(msg) {
  const modes = ['FT8','FT4','JT65','JT9','CW','SSB','AM','FM','RTTY','PSK31','PSK','WSPR','JS8','QO-100','WWFF'];
  for (const m of modes) {
    if (new RegExp('\\b' + m + '\\b', 'i').test(msg)) return m;
  }
  // FF detector (OKFF-XX)
  if (/FF/i.test(msg)) return 'WWFF';
  return null;
}

function formatTime(ts) {
  return ts.split(' ')[1].substring(0, 5);
}

function formatDate(ts) {
  const parts = ts.split(' ')[0].split('-'); 
  return parts[2] + '. ' + parts[1] + '.';
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function encodeCallsign(call) {
  return encodeURIComponent(call).replace(/%2F/g, '/');
}

function buildRow(spot, isNew) {
  const mode = extractMode(spot.message);
  const freqCls = freqBandClass(spot.freq);
  const modeHtml = mode
    ? `<span class="mode-badge mode-${mode.toLowerCase().replace(/[^a-z0-9]/g,'')}">${mode}</span>`
    : '';

  const country = lookupCallsign(spot.dx);
  const flagHtml = country
    ? `<img src="https://flagsapi.com/${country.flag.toUpperCase()}/flat/32.png" class="spot-flag" alt="${escHtml(country.name)}" title="${escHtml(country.name)}">`
    : '<span class="flag-unknown"></span>';

  return `<tr class="spot-row${isNew ? ' spot-new' : ''}" data-id="${spot.id}">
    <td class="col-date"><span class="spot-date">${formatDate(spot.timestamp)}</span></td>
    <td class="col-time"><span class="spot-time">${formatTime(spot.timestamp)}</span></td>
    <td class="col-spotter">
      <a href="https://www.qrz.com/db/${encodeCallsign(spot.spotter)}" target="_blank" rel="noopener" class="callsign spotter-call" title="${window.T.qrz} ${escHtml(spot.spotter)}">${escHtml(spot.spotter)}</a>
    </td>
    <td class="col-freq"><span class="freq-val ${freqCls}">${formatFreq(spot.freq)}</span></td>
    <td class="col-country">${flagHtml}</td>
    <td class="col-dx">
      <a href="https://www.qrz.com/db/${encodeCallsign(spot.dx)}" target="_blank" rel="noopener" class="callsign dx-call" title="${window.T.qrz} ${escHtml(spot.dx)}">${escHtml(spot.dx)}</a>
    </td>
    <td class="col-message"><span class="msg-text">${escHtml(spot.message)}</span></td>
    <td class="col-mode">${modeHtml}</td>
  </tr>`;
}

function fetchSpots() {
  const gen = fetchGeneration;
  fetch(`https://api.amaradio.eu/cluster?band=${encodeURIComponent(currentBand)}`)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(data => {
      if (gen !== fetchGeneration) return; 
      consecutiveErrors = 0;

      if (!data.success|| !Array.isArray(data.data)) {
        showState('empty');
        return;
      }

      const spots = data.data;

      document.getElementById('spotCount').textContent = data.count ?? spots.length;

      if (spots.length === 0) {
        showState('empty');
        return;
      }

      showState('table');

      const tbody = document.getElementById('clusterBody');
      const incomingIds = new Set(spots.map(s => s.id));

      if (isFirstLoad) {
        tbody.innerHTML = spots.map(s => buildRow(s, false)).join('');
        spots.forEach(s => knownIds.add(s.id));
        isFirstLoad = false;
      } else {
        const newSpots = spots.filter(s => !knownIds.has(s.id));

        newSpots.reverse().forEach(s => {
          const tr = document.createElement('tbody');
          tr.innerHTML = buildRow(s, true);
          const newRow = tr.firstElementChild;
          tbody.insertBefore(newRow, tbody.firstChild);
          knownIds.add(s.id);
          setTimeout(() => newRow.classList.remove('spot-new'), 1500);
        });

        tbody.querySelectorAll('.spot-row').forEach(row => {
          const id = parseInt(row.dataset.id);
          if (!incomingIds.has(id)) {
            row.remove();
            knownIds.delete(id);
          }
        });
      }

    })
    .catch(() => {
      if (gen !== fetchGeneration) return;
      consecutiveErrors++;
      if (consecutiveErrors >= 3 && isFirstLoad) showState('error');
    });
}

function showState(state) {
  document.getElementById('clusterLoading').style.display = state === 'loading' ? 'flex' : 'none';
  document.getElementById('clusterError').style.display   = state === 'error'   ? 'flex' : 'none';
  document.getElementById('clusterEmpty').style.display   = state === 'empty'   ? 'flex' : 'none';
  document.getElementById('clusterTable').style.display   = state === 'table'   ? 'table' : 'none';
}

showState('loading');
fetchSpots();

setInterval(fetchSpots, 1000);
