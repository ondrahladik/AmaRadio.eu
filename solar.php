<?php
error_reporting(0);
ini_set('display_errors', 0);
include 'assets/lang/lang.php';
$currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Fetch & cache HAMQSL solar XML 
$cacheFile = sys_get_temp_dir() . '/amaradio_solar.json';
$cacheTTL  = 600; // 10 minutes

$solar = null;
if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTTL) {
    $solar = json_decode(file_get_contents($cacheFile), true);
}

if (!$solar) {
    $ctx = stream_context_create(['http' => ['timeout' => 8, 'ignore_errors' => true]]);
    $raw = @file_get_contents('https://www.hamqsl.com/solarxml.php', false, $ctx);
    if ($raw) {
        $p = @simplexml_load_string($raw);
        if ($p && isset($p->solardata)) {
            $sd    = $p->solardata;
            $bands = [];
            foreach ($sd->calculatedconditions->band as $b) {
                $bands[(string)$b['name']][(string)$b['time']] = trim((string)$b);
            }
            $vhf = [];
            foreach ($sd->calculatedvhfconditions->phenomenon as $ph) {
                $vhf[] = [
                    'name'      => (string)$ph['name'],
                    'location'  => (string)$ph['location'],
                    'condition' => trim((string)$ph),
                ];
            }
            $solar = [
                'updated'      => trim((string)$sd->updated),
                'solarflux'    => trim((string)$sd->solarflux),
                'aindex'       => trim((string)$sd->aindex),
                'kindex'       => trim((string)$sd->kindex),
                'xray'         => trim((string)$sd->xray),
                'sunspots'     => trim((string)$sd->sunspots),
                'heliumline'   => trim((string)$sd->heliumline),
                'protonflux'   => trim((string)$sd->protonflux),
                'electronflux' => trim((string)$sd->electonflux),
                'aurora'       => trim((string)$sd->aurora),
                'solarwind'    => trim((string)$sd->solarwind),
                'magneticfield'=> trim((string)$sd->magneticfield),
                'geomagfield'  => trim((string)$sd->geomagfield),
                'signalnoise'  => trim((string)$sd->signalnoise),
                'muf'          => trim((string)$sd->muf),
                'bands'        => $bands,
                'vhf'          => $vhf,
                'fetchtime'    => time(),
            ];
            @file_put_contents($cacheFile, json_encode($solar));
        }
    }
}

// Helper functions
function condClass(string $c): string {
    $c = strtolower(trim($c));
    if (str_contains($c, 'good'))     return 'cond-good';
    if (str_contains($c, 'fair'))     return 'cond-fair';
    if (str_contains($c, 'poor'))     return 'cond-poor';
    if (str_contains($c, 'closed'))   return 'cond-closed';
    if (str_contains($c, 'aurora'))   return 'cond-aurora';
    if (str_contains($c, 'enhanced')) return 'cond-good';
    return 'cond-unknown';
}

function kClass(int $k): string {
    if ($k <= 1) return 'k-quiet';
    if ($k <= 3) return 'k-unsettled';
    if ($k == 4) return 'k-active';
    if ($k == 5) return 'k-storm1';
    if ($k == 6) return 'k-storm2';
    return 'k-storm3';
}

function aClass(int $a): string {
    if ($a <= 7)  return 'k-quiet';
    if ($a <= 15) return 'k-unsettled';
    if ($a <= 29) return 'k-active';
    if ($a <= 49) return 'k-storm1';
    return 'k-storm2';
}

function sfiClass(int $s): string {
    if ($s < 70)  return 'sfi-low';
    if ($s < 90)  return 'sfi-ok';
    if ($s < 120) return 'sfi-good';
    return 'sfi-high';
}

function xrayClass(string $x): string {
    return match (strtoupper(substr(trim($x), 0, 1))) {
        'X'     => 'xray-x',
        'M'     => 'xray-m',
        'C'     => 'xray-c',
        'B'     => 'xray-b',
        default => 'xray-a',
    };
}

function translateCond(string $cond, array $t): string {
    return match (strtolower(trim($cond))) {
        'good'        => $t['solar-cond-good'],
        'fair'        => $t['solar-cond-fair'],
        'poor'        => $t['solar-cond-poor'],
        'band closed' => $t['solar-cond-closed'],
        'aurora'      => $t['solar-cond-aurora'],
        'enhanced'    => $t['solar-cond-enhanced'],
        default       => $cond,
    };
}

function translateLoc(string $loc, array $t): string {
    return match (strtolower(trim($loc))) {
        'northern_hemi' => $t['solar-loc-northern-hemi'],
        'europe'        => $t['solar-loc-europe'],
        'north_america' => $t['solar-loc-north-america'],
        'europe_6m'     => $t['solar-loc-europe-6m'],
        'europe_4m'     => $t['solar-loc-europe-4m'],
        default         => $loc,
    };
}

function translatePhenom(string $name, array $t): string {
    return match (strtolower(trim($name))) {
        'vhf-aurora' => $t['solar-ph-vhf-aurora'],
        'e-skip'     => $t['solar-ph-eskip'],
        default      => $name,
    };
}

function kLabel(int $k, array $t): string {
    if ($k <= 1) return $t['solar-k-quiet'];
    if ($k <= 3) return $t['solar-k-unsettled'];
    if ($k == 4) return $t['solar-k-active'];
    if ($k == 5) return $t['solar-k-storm-minor'];
    if ($k == 6) return $t['solar-k-storm-moderate'];
    return $t['solar-k-storm-severe'];
}

function aLabel(int $a, array $t): string {
    if ($a <= 7)  return $t['solar-k-quiet'];
    if ($a <= 15) return $t['solar-k-unsettled'];
    if ($a <= 29) return $t['solar-k-active'];
    if ($a <= 49) return $t['solar-k-storm-minor'];
    return $t['solar-k-storm-moderate'];
}

function sfiLabel(int $s, array $t): string {
    if ($s < 70)  return $t['solar-sfi-low'];
    if ($s < 90)  return $t['solar-sfi-moderate'];
    if ($s < 120) return $t['solar-sfi-good'];
    return $t['solar-sfi-high'];
}

function xrayLabel(string $x, array $t): string {
    return match (strtoupper(substr(trim($x), 0, 1))) {
        'X'     => $t['solar-xray-desc-x'],
        'M'     => $t['solar-xray-desc-m'],
        'C'     => $t['solar-xray-desc-c'],
        'B'     => $t['solar-xray-desc-b'],
        default => $t['solar-xray-desc-a'],
    };
}

$bandOrder = ['80m-40m', '30m-20m', '17m-15m', '12m-10m'];
?>
<!DOCTYPE html>
<html lang="<?= $text['lang'] ?>">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= $text['solar-page-title'] ?></title>
  <meta name="description" content="<?= $text['solar-title'] ?>">
  <meta property="og:title" content="<?= $text['solar-page-title'] ?> – AMARADIO.eu">
  <meta property="og:description" content="<?= $text['solar-title'] ?>">
  <?php include 'assets/inc/head.php' ?>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="stylesheet" href="assets/css/solar.css" />
</head>
<body>
  <?php include 'assets/inc/menu.php'; ?>
  <?php include 'assets/inc/help-modal.php'; ?>

  <div class="solar-wrap">

    <?php if (!$solar): ?>
    <!-- Error state -->
    <div class="solar-error">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p><?= $text['solar-data-error'] ?></p>
      <button onclick="location.reload()" class="solar-btn">
        <i class="fa-solid fa-rotate-right"></i> <?= $text['solar-refresh'] ?>
      </button>
    </div>

    <?php else: ?>

    <!-- Page header -->
    <div class="solar-header">
      <div class="solar-header-left">
        <h1 class="solar-title">
          <?= $text['solar-page-title'] ?>
        </h1>
      </div>
      <div class="solar-header-right">
        <div class="solar-split-btn">
          <span class="split-btn-time">
            <i class="fa-regular fa-clock"></i>
            <span id="refresh-countdown">10:00</span>
          </span>
          <button onclick="location.reload()" class="split-btn-action" title="<?= $text['solar-refresh'] ?>">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Main metrics cards -->
    <div class="solar-metrics">

      <div class="metric-card <?= sfiClass((int)$solar['solarflux']) ?>">
        <div class="metric-header">
          <div class="metric-label"><?= $text['solar-sfi'] ?></div>
          <div class="metric-icon"><i class="fa-solid fa-sun"></i></div>
        </div>
        <div class="metric-value"><?= htmlspecialchars($solar['solarflux']) ?></div>
        <div class="metric-footer">
          <span class="metric-unit"><?= $text['solar-units-sfu'] ?></span>
          <span class="metric-badge"><?= sfiLabel((int)$solar['solarflux'], $text) ?></span>
        </div>
      </div>

      <div class="metric-card sunspot-card">
        <div class="metric-header">
          <div class="metric-label"><?= $text['solar-sunspots'] ?></div>
          <div class="metric-icon"><i class="fa-solid fa-circle-dot"></i></div>
        </div>
        <div class="metric-value"><?= htmlspecialchars($solar['sunspots']) ?></div>
        <div class="metric-footer">
          <span class="metric-unit">SSN</span>
          <span class="metric-badge"><?= $text['solar-sunspots-desc'] ?></span>
        </div>
      </div>

      <div class="metric-card <?= kClass((int)$solar['kindex']) ?>">
        <div class="metric-header">
          <div class="metric-label"><?= $text['solar-kindex'] ?></div>
          <div class="metric-icon"><i class="fa-solid fa-magnet"></i></div>
        </div>
        <div class="metric-value"><?= htmlspecialchars($solar['kindex']) ?></div>
        <div class="metric-footer">
          <span class="metric-unit">Kp</span>
          <span class="metric-badge"><?= kLabel((int)$solar['kindex'], $text) ?></span>
        </div>
      </div>

      <div class="metric-card <?= aClass((int)$solar['aindex']) ?>">
        <div class="metric-header">
          <div class="metric-label"><?= $text['solar-aindex'] ?></div>
          <div class="metric-icon"><i class="fa-solid fa-gauge-high"></i></div>
        </div>
        <div class="metric-value"><?= htmlspecialchars($solar['aindex']) ?></div>
        <div class="metric-footer">
          <span class="metric-unit">Ap</span>
          <span class="metric-badge"><?= aLabel((int)$solar['aindex'], $text) ?></span>
        </div>
      </div>

      <div class="metric-card <?= xrayClass($solar['xray']) ?>">
        <div class="metric-header">
          <div class="metric-label"><?= $text['solar-xray'] ?></div>
          <div class="metric-icon"><i class="fa-solid fa-radiation"></i></div>
        </div>
        <div class="metric-value xray-val"><?= htmlspecialchars($solar['xray']) ?></div>
        <div class="metric-footer">
          <span class="metric-unit"></span>
          <span class="metric-badge"><?= xrayLabel($solar['xray'], $text) ?></span>
        </div>
      </div>

      <div class="metric-card wind-card">
        <div class="metric-header">
          <div class="metric-label"><?= $text['solar-solarwind'] ?></div>
          <div class="metric-icon"><i class="fa-solid fa-wind"></i></div>
        </div>
        <div class="metric-value"><?= htmlspecialchars($solar['solarwind']) ?></div>
        <div class="metric-footer">
          <span class="metric-unit"><?= $text['solar-units-kmps'] ?></span>
          <span class="metric-badge"><?= $text['solar-solarwind-desc'] ?></span>
        </div>
      </div>

      <div class="metric-card magfield-card">
        <div class="metric-header">
          <div class="metric-label"><?= $text['solar-magfield'] ?></div>
          <div class="metric-icon"><i class="fa-solid fa-arrows-spin"></i></div>
        </div>
        <div class="metric-value"><?= htmlspecialchars($solar['magneticfield']) ?></div>
        <div class="metric-footer">
          <span class="metric-unit"><?= $text['solar-units-nt'] ?></span>
          <span class="metric-badge"><?= htmlspecialchars($solar['geomagfield']) ?></span>
        </div>
      </div>

      <div class="metric-card noise-card">
        <div class="metric-header">
          <div class="metric-label"><?= $text['solar-signalnoise'] ?></div>
          <div class="metric-icon"><i class="fa-solid fa-wave-square"></i></div>
        </div>
        <div class="metric-value noise-val"><?= htmlspecialchars($solar['signalnoise']) ?></div>
        <div class="metric-footer">
          <span class="metric-unit"></span>
          <span class="metric-badge"><?= $text['solar-signalnoise-desc'] ?></span>
        </div>
      </div>

    </div>

    <!-- Secondary metrics row -->
    <div class="solar-secondary">

      <div class="sec-item">
        <span class="sec-label"><i class="fa-solid fa-location-crosshairs"></i> <?= $text['solar-aurora'] ?></span>
        <span class="sec-value"><?= htmlspecialchars($solar['aurora']) ?>°</span>
        <span class="sec-sub"><?= $text['solar-aurora-desc'] ?></span>
      </div>

      <div class="sec-item">
        <span class="sec-label"><i class="fa-solid fa-atom"></i> <?= $text['solar-heliumline'] ?></span>
        <span class="sec-value"><?= htmlspecialchars($solar['heliumline']) ?></span>
        <span class="sec-sub">SFU</span>
      </div>

      <div class="sec-item">
        <span class="sec-label"><i class="fa-solid fa-atom"></i> <?= $text['solar-protonflux'] ?></span>
        <span class="sec-value"><?= htmlspecialchars($solar['protonflux']) ?></span>
        <span class="sec-sub"><?= $text['solar-units-pfu'] ?></span>
      </div>

      <div class="sec-item">
        <span class="sec-label"><i class="fa-solid fa-bolt"></i> <?= $text['solar-electronflux'] ?></span>
        <span class="sec-value"><?= htmlspecialchars($solar['electronflux']) ?></span>
        <span class="sec-sub"><?= $text['solar-units-pfu'] ?></span>
      </div>

      <?php if ($solar['muf'] && $solar['muf'] !== 'NoRpt'): ?>
      <div class="sec-item">
        <span class="sec-label"><i class="fa-solid fa-signal"></i> MUF</span>
        <span class="sec-value"><?= htmlspecialchars($solar['muf']) ?></span>
        <span class="sec-sub">MHz</span>
      </div>
      <?php endif; ?>

    </div>

    <!-- Conditions section -->
    <div class="solar-conditions-grid">

      <!-- HF Band Conditions -->
      <div class="solar-section">
        <h2 class="section-title">
          <i class="fa-solid fa-signal"></i>
          <?= $text['solar-hf-conditions'] ?>
        </h2>
        <table class="conditions-table">
          <thead>
            <tr>
              <th><?= $text['solar-band-label'] ?></th>
              <th><i class="fa-solid fa-sun"></i> <?= $text['solar-band-day'] ?></th>
              <th><i class="fa-solid fa-moon"></i> <?= $text['solar-band-night'] ?></th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($bandOrder as $band): ?>
              <?php
                $day   = $solar['bands'][$band]['day']   ?? '—';
                $night = $solar['bands'][$band]['night'] ?? '—';
              ?>
              <tr>
                <td class="band-name"><?= $band ?></td>
                <td class="cond-cell <?= condClass($day) ?>">
                  <span class="cond-dot"></span>
                  <?= translateCond($day, $text) ?>
                </td>
                <td class="cond-cell <?= condClass($night) ?>">
                  <span class="cond-dot"></span>
                  <?= translateCond($night, $text) ?>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        <div class="cond-legend">
          <span class="legend-item cond-good"><span class="cond-dot"></span><?= $text['solar-cond-good'] ?></span>
          <span class="legend-item cond-fair"><span class="cond-dot"></span><?= $text['solar-cond-fair'] ?></span>
          <span class="legend-item cond-poor"><span class="cond-dot"></span><?= $text['solar-cond-poor'] ?></span>
          <span class="legend-item cond-closed"><span class="cond-dot"></span><?= $text['solar-cond-closed'] ?></span>
        </div>
      </div>

      <!-- VHF Conditions -->
      <div class="solar-section">
        <h2 class="section-title">
          <i class="fa-solid fa-tower-broadcast"></i>
          <?= $text['solar-vhf-conditions'] ?>
        </h2>
        <div class="vhf-list">
          <?php foreach ($solar['vhf'] as $ph): ?>
          <div class="vhf-item <?= condClass($ph['condition']) ?>">
            <div class="vhf-name">
              <span class="cond-dot"></span>
              <?= translatePhenom($ph['name'], $text) ?>
            </div>
            <div class="vhf-loc"><?= translateLoc($ph['location'], $text) ?></div>
            <div class="vhf-cond"><?= translateCond($ph['condition'], $text) ?></div>
          </div>
          <?php endforeach; ?>
        </div>
      </div>

    </div>

    <!-- Charts -->
    <div class="solar-charts-grid">

      <div class="solar-section">
        <h2 class="section-title">
          <i class="fa-solid fa-chart-line"></i>
          <?= $text['solar-flux-chart'] ?>
        </h2>
        <div class="chart-container">
          <canvas id="flux-chart"></canvas>
          <div class="chart-loading" id="flux-loading">
            <i class="fa-solid fa-circle-notch fa-spin"></i>
          </div>
        </div>
      </div>

    </div>

    <!-- Space weather images -->
    <div class="solar-section solar-images-section">
      <h2 class="section-title">
        <i class="fa-solid fa-image"></i>
        <?= $text['solar-images'] ?>
      </h2>
      <div class="solar-images-grid">

        <div class="solar-img-card">
          <div class="solar-img-label">SDO/AIA 171Å</div>
          <a href="https://sdo.gsfc.nasa.gov/data/" target="_blank" rel="noopener">
            <img src="https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0171.jpg"
                 alt="SDO AIA 171" loading="lazy"
                 onerror="this.parentElement.parentElement.style.display='none'">
          </a>
          <div class="solar-img-sub"><?= $text['solar-img-corona'] ?></div>
        </div>

        <div class="solar-img-card">
          <div class="solar-img-label">SDO/AIA 304Å</div>
          <a href="https://sdo.gsfc.nasa.gov/data/" target="_blank" rel="noopener">
            <img src="https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0304.jpg"
                 alt="SDO AIA 304" loading="lazy"
                 onerror="this.parentElement.parentElement.style.display='none'">
          </a>
          <div class="solar-img-sub"><?= $text['solar-img-chromosphere'] ?></div>
        </div>

        <div class="solar-img-card">
          <div class="solar-img-label">SDO/HMI <?= $text['solar-img-magnetogram'] ?></div>
          <a href="https://sdo.gsfc.nasa.gov/data/" target="_blank" rel="noopener">
            <img src="https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_HMIB.jpg"
                 alt="SDO HMI Magnetogram" loading="lazy"
                 onerror="this.parentElement.parentElement.style.display='none'">
          </a>
          <div class="solar-img-sub"><?= $text['solar-img-magnetogram'] ?></div>
        </div>

        <div class="solar-img-card">
          <div class="solar-img-label">NOAA <?= $text['solar-img-aurora'] ?></div>
          <a href="https://www.swpc.noaa.gov/products/aurora-30-minute-forecast" target="_blank" rel="noopener">
            <img src="https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg"
                 alt="Aurora forecast" loading="lazy"
                 onerror="this.parentElement.parentElement.style.display='none'">
          </a>
          <div class="solar-img-sub"><?= $text['solar-img-aurora'] ?></div>
        </div>

      </div>
    </div>

    <!-- Attribution -->
    <div class="solar-attribution">
      <i class="fa-solid fa-database"></i>
      <?= $text['solar-data-source'] ?>
      <a href="https://www.hamqsl.com/solar.html" target="_blank" rel="noopener">hamqsl.com</a>
      &nbsp;|&nbsp;
      <a href="https://www.swpc.noaa.gov/" target="_blank" rel="noopener">NOAA SWPC</a>
      &nbsp;|&nbsp;
      <a href="https://sdo.gsfc.nasa.gov/" target="_blank" rel="noopener">NASA SDO</a>
    </div>

    <?php endif; ?>
  </div>

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

  <?php if ($solar): ?>
  <script>
    const solarTranslations = {
      fluxError: <?= json_encode($text['solar-chart-error']) ?>,
      loading:   <?= json_encode($text['solar-loading']) ?>,
    };
  </script>
  <script src="assets/js/solar.js"></script>
  <?php endif; ?>

</body>
</html>
