<?php 
error_reporting(0);
ini_set('display_errors', 0);
include 'assets/lang/lang.php'; 
?>

<!DOCTYPE html>
<html lang="<?= $text['lang'] ?>">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= $text['zone-map'] ?></title>
    <meta name="description" content="<?= $text['zone-title'] ?>">
    <meta property="og:title" content="<?= $text['zone-map'] ?>">
    <meta property="og:description" content="<?= $text['zone-title'] ?>">
    <?php include 'assets/inc/head.php' ?>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <link rel="stylesheet" type="text/css" href="assets/css/zone-map.css">
<body>
    <?php include 'assets/inc/menu.php'; ?>
    <?php include 'assets/inc/help-modal.php'; ?>
    <div class="zone-map-wrap">
        <div class="zone-panel" id="zonePanel">
            <div class="panel-group">
                <label for="layer-select"><?= $text['zone-map-select-layer'] ?></label>
                <select name="layer" id="layer-select">
                    <option value="" selected disabled hidden><?= $text['zone-map-select-layer'] ?></option>
                    <option value="none"><?= $text['zone-map-select-nolayer'] ?></option>
                    <option value="locator"><?= $text['zone-map-select-grid'] ?></option>
                    <option value="itu"><?= $text['zone-map-select-itu'] ?></option>
                    <option value="cq"><?= $text['zone-map-select-cq'] ?></option>
                    <option value="time"><?= $text['zone-map-select-time'] ?></option>
                </select>
            </div>

            <div class="coordinates-info">
                <div class="coord-row">
                    <span class="coord-label"><?= $text['zone-map-latitude'] ?></span>
                    <strong id="lati">---</strong>
                </div>
                <div class="coord-row">
                    <span class="coord-label"><?= $text['zone-map-longitude'] ?></span>
                    <strong id="long">---</strong>
                </div>
                <div class="coord-row">
                    <span class="coord-label"><?= $text['zone-map-grid'] ?></span>
                    <strong id="mouse-locator">---</strong>
                </div>
            </div>
        </div>

        <div id="map"></div>
        <div id="tooltip-container" class="tooltip-container"></div>
    </div>
    <script>
        const translations = {
            position: <?= json_encode($text['zone-map-position']) ?>,
            lat: <?= json_encode($text['zone-map-lat']) ?>,
            lon: <?= json_encode($text['zone-map-lon']) ?>,
            loc: <?= json_encode($text['zone-map-loc']) ?>,
            alt: <?= json_encode($text['zone-map-alt']) ?>,
            errorGeo: <?= json_encode($text['zone-map-error-geo']) ?>,
            errorGeoBrowser: <?= json_encode($text['zone-map-error-geo-broswer']) ?>,
        };
    </script>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
    <script type="text/javascript" src="assets/js/map-layers.js"></script>
    <script type="text/javascript" src="assets/js/zone-map.js"></script>
</body>

</html>