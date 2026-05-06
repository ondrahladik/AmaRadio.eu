Chart.defaults.color = '#666';
Chart.defaults.borderColor = '#1a1a1a';

let fluxChart = null;

// Solar Flux & Sunspots chart 
async function loadFluxChart() {
  const el = document.getElementById('flux-loading');
  try {
    const res  = await fetch('https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json');
    const data = await res.json();

    const recent = data.filter(d => d['ssn'] !== null && parseFloat(d['ssn']) >= 0).slice(-24);

    const labels = recent.map(d => d['time-tag']);
    const flux   = recent.map(d => {
      const v = parseFloat(d['f10.7obs'] ?? d['f10.7']);
      return isNaN(v) ? null : v;
    });
    const ssn    = recent.map(d => {
      const v = parseFloat(d['ssn']);
      return isNaN(v) ? null : v;
    });

    const ctx = document.getElementById('flux-chart');
    if (!ctx) return;

    fluxChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'F10.7 (SFU)',
            data: flux,
            borderColor: '#00ffe0',
            backgroundColor: 'rgba(0,255,224,0.06)',
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
            yAxisID: 'y',
          },
          {
            label: 'SSN',
            data: ssn,
            borderColor: '#ff9800',
            backgroundColor: 'rgba(255,152,0,0.06)',
            fill: false,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
            yAxisID: 'y2',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: { color: '#666', boxWidth: 12, font: { size: 11 } },
          },
          tooltip: {
            backgroundColor: '#1a1a1a',
            borderColor: '#00ffe030',
            borderWidth: 1,
            titleColor: '#00ffe0',
            bodyColor: '#aaa',
          },
        },
        scales: {
          x: {
            ticks: { color: '#555', font: { size: 9 }, maxTicksLimit: 12, maxRotation: 45 },
            grid: { color: '#141414' },
          },
          y: {
            type: 'linear',
            position: 'left',
            ticks: { color: '#00ffe066', font: { size: 10 } },
            grid: { color: '#141414' },
            title: { display: true, text: 'F10.7 SFU', color: '#00ffe044', font: { size: 10 } },
          },
          y2: {
            type: 'linear',
            position: 'right',
            ticks: { color: '#ff980066', font: { size: 10 } },
            grid: { display: false },
            title: { display: true, text: 'SSN', color: '#ff980044', font: { size: 10 } },
          },
        },
      },
    });

    if (el) el.style.display = 'none';

    // Find the responsive grid container that actually changes size
    let gridContainer = null;
    let parent = ctx.parentElement;
    while (parent) {
      if (parent.classList.contains('solar-charts-grid')) {
        gridContainer = parent;
        break;
      }
      parent = parent.parentElement;
    }

    // Attach ResizeObserver to the grid (which changes width on breakpoints)
    if (gridContainer) {
      new ResizeObserver(() => { if (fluxChart) fluxChart.resize(); }).observe(gridContainer);
    }

    // Debounced window resize listener as fallback
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => { if (fluxChart) fluxChart.resize(); }, 100);
    });
  } catch (e) {
    if (el) el.innerHTML = `<span style="color:#ff5722;font-size:12px">${solarTranslations.fluxError}</span>`;
  }
}

// Auto-refresh countdown
function startCountdown() {
  let secs = 600;
  const el = document.getElementById('refresh-countdown');
  if (!el) return;

  const tick = () => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    el.textContent = `${m}:${String(s).padStart(2, '0')}`;
    if (secs <= 0) {
      location.reload();
    } else {
      secs--;
      setTimeout(tick, 1000);
    }
  };
  tick();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadFluxChart();
  startCountdown();
});
