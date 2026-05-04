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
    <title><?= $text['locator-map'] ?></title>
    <meta name="description" content="<?= $text['locator-title'] ?>">
    <meta property="og:title" content="<?= $text['locator-map'] ?>">
    <meta property="og:description" content="<?= $text['locator-title'] ?>">
    <?php include 'assets/inc/head.php' ?>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
    <link rel="stylesheet" type="text/css" href="assets/css/locator-map.css">
</head>
<body>
    <?php include 'assets/inc/menu.php'; ?>
    <?php include 'assets/inc/help-modal.php'; ?>
    <div class="locator-map-wrap">
        <div class="locator-panel" id="locatorPanel">
            <div class="panel-group">
                <label for="locator1"><?= $text['locator-map-locator-label-a'] ?></label>
                <div class="input-row">
                    <input type="text" id="locator1" name="locator1" maxlength="6" placeholder="<?= $text['locator-map-locator-placeholder'] ?>" required>
                    <button type="button" class="btn-icon" onclick="updateLocatorFromGPS()"><i class="fa-solid fa-location-dot"></i></button>
                </div>
            </div>

            <div class="panel-group">
                <label for="locator2"><?= $text['locator-map-locator-label-b'] ?></label>
                <div class="input-row">
                    <input type="text" id="locator2" name="locator2" maxlength="6" placeholder="<?= $text['locator-map-locator-placeholder'] ?>" required>
                    <button type="button" class="btn-icon" onclick="updateLocatorToBFromGPS()"><i class="fa-solid fa-location-dot"></i></button>
                </div>
            </div>

            <button type="button" class="btn-search" onclick="handleCalculate()"><?= $text['locator-map-get-locator'] ?></button>

            <div class="distance-info" id="distanceInfo">
                <div class="distance-row">
                    <span class="distance-label"><?= $text['locator-map-distance'] ?>:</span>
                    <strong id="distance">---</strong>
                </div>
            </div>

            <div class="coordinates-info">
                <div class="coord-row">
                    <span class="coord-label"><?= $text['locator-map-lat'] ?></span>
                    <strong id="lati">---</strong>
                </div>
                <div class="coord-row">
                    <span class="coord-label"><?= $text['locator-map-lon'] ?></span>
                    <strong id="long">---</strong>
                </div>
                <div class="coord-row">
                    <span class="coord-label"><?= $text['locator-map-loc'] ?></span>
                    <strong id="mouse-locator">---</strong>
                </div>
            </div>
        </div>

        <div id="map"></div>
    </div>
    <script>
        const translations = {
            invalidLocator: <?= json_encode($text['locator-map-invalid-locator']) ?>,
            invalidLocators: <?= json_encode($text['locator-map-invalid-locators']) ?>,
            sameLocator: <?= json_encode($text['locator-map-same-locator']) ?>,
            errorGeoBrowser: <?= json_encode($text['locator-map-error-geo-broswer']) ?>,
            position: <?= json_encode($text['locator-map-position']) ?>,
            lat: <?= json_encode($text['locator-map-lat']) ?>,
            lon: <?= json_encode($text['locator-map-lon']) ?>,
            alt: <?= json_encode($text['locator-map-alt']) ?>,
            loc: <?= json_encode($text['locator-map-loc']) ?>,
            error: <?= json_encode($text['locator-map-error']) ?>,
        };
    </script>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
    <script type="text/javascript" src="assets/js/locator-map.js"></script>
</body>

</html>