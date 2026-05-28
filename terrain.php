<?php
if (isset($_GET['pts'])) {
    error_reporting(0);
    header('Content-Type: application/json');
    header('Cache-Control: public, max-age=3600');

    $totalSamples = 100;
    $pointStrings = explode('|', urldecode($_GET['pts']));

    if (count($pointStrings) < 2 || count($pointStrings) > 10) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Need between 2 and 10 waypoints']);
        exit;
    }

    $points = [];
    foreach ($pointStrings as $ps) {
        $parts = explode(',', trim($ps));
        if (count($parts) !== 2) {
            http_response_code(400); echo json_encode(['success' => false, 'error' => 'Invalid point format']); exit;
        }
        $lat = floatval($parts[0]); $lon = floatval($parts[1]);
        if ($lat < -90 || $lat > 90 || $lon < -180 || $lon > 180) {
            http_response_code(400); echo json_encode(['success' => false, 'error' => 'Coordinate out of range']); exit;
        }
        $points[] = ['lat' => $lat, 'lon' => $lon];
    }

    function hvs($la1, $lo1, $la2, $lo2) {
        $R = 6371; $dLa = deg2rad($la2-$la1); $dLo = deg2rad($lo2-$lo1);
        $a = sin($dLa/2)*sin($dLa/2)+cos(deg2rad($la1))*cos(deg2rad($la2))*sin($dLo/2)*sin($dLo/2);
        return $R * 2 * atan2(sqrt($a), sqrt(1-$a));
    }

    $segDists = []; $totalDist = 0;
    for ($i = 0; $i < count($points)-1; $i++) {
        $d = hvs($points[$i]['lat'],$points[$i]['lon'],$points[$i+1]['lat'],$points[$i+1]['lon']);
        $segDists[] = $d; $totalDist += $d;
    }
    if ($totalDist < 0.01) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'Points too close']); exit; }

    $segSamples = []; $alloc = 0;
    for ($i = 0; $i < count($segDists); $i++) {
        if ($i === count($segDists)-1) { $segSamples[] = max(2, $totalSamples - $alloc); }
        else { $s = max(2,(int)round($totalSamples*$segDists[$i]/$totalDist)); $segSamples[]=$s; $alloc+=$s; }
    }

    $locations = [];
    for ($seg = 0; $seg < count($points)-1; $seg++) {
        $la1=$points[$seg]['lat']; $lo1=$points[$seg]['lon'];
        $la2=$points[$seg+1]['lat']; $lo2=$points[$seg+1]['lon'];
        $n=$segSamples[$seg]; $isLast=($seg===count($points)-2);
        for ($i = 0; $i < ($isLast ? $n+1 : $n); $i++) {
            $t=$i/$n; $locations[]=round($la1+($la2-$la1)*$t,6).','.round($lo1+($lo2-$lo1)*$t,6);
        }
    }
    if (count($locations) > 100) {
        $step=(count($locations)-1)/99; $f=[];
        for ($i=0;$i<100;$i++) { $f[]=  $locations[min((int)round($i*$step),count($locations)-1)]; }
        $locations=$f;
    }

    $apiUrl = "https://api.opentopodata.org/v1/mapzen?locations=".implode("|",$locations);
    $ctx = stream_context_create(['http'=>['timeout'=>15,'user_agent'=>'AMARADIO-TerrainAnalyzer/2.0']]);
    $resp = @file_get_contents($apiUrl, false, $ctx);
    $count = count($locations);

    if ($resp === false) {
        http_response_code(503);
        echo json_encode(['success' => false, 'error' => 'Elevation API unavailable']);
        exit;
    }

    $apiData = json_decode($resp, true);
    if (!$apiData || !isset($apiData['results'])) {
        http_response_code(502); echo json_encode(['success'=>false,'error'=>'Invalid API response']); exit;
    }

    $n2=count($apiData['results']); $profile=[];
    for ($i=0;$i<$n2;$i++) {
        $t=$i/max($n2-1,1); $cumDist=$totalDist*$t;
        $elev=$apiData['results'][$i]['elevation']??0;
        if ($elev===null) $elev=0;
        $profile[]=['distance_km'=>round($cumDist,2),'elevation_m'=>round(floatval($elev),1)];
    }
    echo json_encode(['success'=>true,'total_distance_km'=>round($totalDist,2),'points'=>$profile]);
    exit;
}

error_reporting(0);
ini_set('display_errors', 0);
include 'assets/lang/lang.php';
?>
<!DOCTYPE html>
<html lang="<?= $text['lang'] ?>">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= $text['terrain'] ?></title>
    <meta name="description" content="<?= $text['terrain-title'] ?>">
    <meta property="og:title" content="<?= $text['terrain'] ?>">
    <meta property="og:description" content="<?= $text['terrain-title'] ?>">
    <?php include 'assets/inc/head.php' ?>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
    <link rel="stylesheet" href="assets/css/terrain.css">
</head>
<body>
    <?php include 'assets/inc/menu.php'; ?>
    <?php include 'assets/inc/help-modal.php'; ?>

    <div class="terrain-wrap">

        <!-- Left panel -->
        <div class="terrain-panel" id="terrainPanel">

            <!-- Add point by text -->
            <div class="panel-section">
                <div class="section-label"><?= $text['terrain-add-point'] ?></div>
                <div class="input-group">
                    <input type="text" id="pointInput"
                           placeholder="<?= $text['terrain-input-placeholder'] ?>"
                           autocomplete="off" spellcheck="false" />
                    <button type="button" class="btn-add-icon" onclick="addFromInput()" title="<?= $text['terrain-add'] ?>">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                    <button type="button" class="btn-add-icon" onclick="addPointFromGPS()" title="<?= $text['terrain-add-gps'] ?>">
                        <i class="fa-solid fa-location-dot"></i>
                    </button>
                </div>
            </div>

            <!-- RF settings -->
            <div class="panel-section">
                <button type="button" class="rf-settings-toggle" onclick="toggleRFSettings()">
                    <i class="fa-solid fa-tower-broadcast"></i>
                    <span><?= $text['terrain-rf-settings'] ?></span>
                    <i class="fa-solid fa-chevron-down rf-chevron" id="rfChevron"></i>
                </button>
                <div class="rf-settings-body" id="rfSettingsBody">
                    <div class="rf-row">
                        <div class="rf-field">
                            <label><?= $text['terrain-freq'] ?></label>
                            <div class="rf-input-unit">
                                <input type="number" id="rfFreq" value="144" min="1" max="10000" step="1" />
                                <span>MHz</span>
                            </div>
                        </div>
                    </div>
                    <div class="rf-row">
                        <div class="rf-field">
                            <label><?= $text['terrain-ant-a'] ?></label>
                            <div class="rf-input-unit">
                                <input type="number" id="rfAntA" value="0" min="0" max="999" step="1" />
                                <span>m</span>
                            </div>
                        </div>
                        <div class="rf-field">
                            <label><?= $text['terrain-ant-b'] ?></label>
                            <div class="rf-input-unit">
                                <input type="number" id="rfAntB" value="0" min="0" max="999" step="1" />
                                <span>m</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats -->
            <div class="terrain-stats" id="terrainStats">
                <div class="stat-row">
                    <span class="stat-label"><i class="fa-solid fa-ruler-horizontal"></i> <?= $text['terrain-distance'] ?></span>
                    <strong id="statDistance">–</strong>
                </div>
                <div class="stat-row">
                    <span class="stat-label"><i class="fa-solid fa-arrow-up"></i> <?= $text['terrain-max-elev'] ?></span>
                    <strong id="statMaxElev">–</strong>
                </div>
                <div class="stat-row">
                    <span class="stat-label"><i class="fa-solid fa-arrow-down"></i> <?= $text['terrain-min-elev'] ?></span>
                    <strong id="statMinElev">–</strong>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-row">
                    <span class="stat-label"><i class="fa-solid fa-eye"></i> LOS</span>
                    <strong id="statLOS">–</strong>
                </div>
                <div class="stat-row">
                    <span class="stat-label"><i class="fa-solid fa-circle-dot"></i> <?= $text['terrain-fresnel'] ?></span>
                    <strong id="statFresnel">–</strong>
                </div>
            </div>

            <!-- Chart -->
            <div class="terrain-chart-wrap" id="terrainChartWrap" style="display:none;">
                <div class="chart-toolbar">
                    <button class="chart-btn" onclick="openChartModal()" title="<?= $text['terrain-chart-expand'] ?>">
                        <i class="fa-solid fa-expand"></i>
                    </button>
                    <button class="chart-btn" onclick="exportChartPNG()" title="<?= $text['terrain-export-png'] ?>">
                        <i class="fa-solid fa-download"></i>
                    </button>
                </div>
                <canvas id="terrainChart"></canvas>
                <div class="chart-overlay" id="chartOverlay" style="display:none;">
                    <div class="spinner"></div>
                </div>
            </div>

        </div>

        <div id="map"></div>

    </div>

    <!-- Chart modal -->
    <div class="chart-modal" id="chartModal" style="display:none;">
        <div class="chart-modal-backdrop" onclick="closeChartModal()"></div>
        <div class="chart-modal-box">
            <button class="chart-modal-close" onclick="closeChartModal()">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="chart-modal-canvas-wrap">
                <canvas id="terrainChartModal"></canvas>
            </div>
        </div>
    </div>

    <script>
        const translations = {
            invalidInput: <?= json_encode($text['terrain-invalid-input']) ?>,
            geoError:     <?= json_encode($text['terrain-geo-error']) ?>,
            geoBrowser:   <?= json_encode($text['terrain-geo-browser']) ?>,
            losBlocked:   <?= json_encode($text['terrain-los-blocked']) ?>,
            losClear:     <?= json_encode($text['terrain-los-clear']) ?>,
            loadError:    <?= json_encode($text['terrain-load-error']) ?>,
            position:     <?= json_encode($text['zone-map-position']) ?>,
            lat:          <?= json_encode($text['zone-map-lat']) ?>,
            lon:          <?= json_encode($text['zone-map-lon']) ?>,
            loc:          <?= json_encode($text['zone-map-loc']) ?>,
            alt:          <?= json_encode($text['zone-map-alt']) ?>,
            exportPng:    <?= json_encode($text['terrain-export-png']) ?>,
            generatedOn:  <?= json_encode($text['terrain-generated-on']) ?>,
            statLabels: {
                distance: <?= json_encode($text['terrain-distance']) ?>,
                maxElev:  <?= json_encode($text['terrain-max-elev']) ?>,
                minElev:  <?= json_encode($text['terrain-min-elev']) ?>,
                los:      'LOS',
                fresnel:  <?= json_encode($text['terrain-fresnel']) ?>,
            },
        };
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
    <script src="assets/js/map-layers.js"></script>
    <script src="assets/js/terrain.js"></script>
</body>
</html>
