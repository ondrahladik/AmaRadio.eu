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
    <title><?= $text['rotator'] ?></title>
    <meta name="description" content="<?= $text['rotator-title'] ?>">
    <meta property="og:title" content="<?= $text['rotator'] ?>">
    <meta property="og:description" content="<?= $text['rotator-title'] ?>">
    <?php include 'assets/inc/head.php' ?>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
    <link rel="stylesheet" href="assets/css/rotator.css">
<body>
    <?php include 'assets/inc/menu.php'; ?>
    <?php include 'assets/inc/help-modal.php'; ?>

    <div class="rot-wrap">
        <div class="rotator-panel" id="rotatorPanel">

            <div class="panel-group">
                <label for="mylocator"><?= $text['rotator-my-locator'] ?></label>
                <div class="input-row">
                    <input type="text" id="mylocator"
                           placeholder="<?= $text['rotator-my-locator-placeholder'] ?>"
                           maxlength="6" autocomplete="off">
                    <button type="button" id="locatorButton"><?= $text['rotator-set'] ?></button>
                </div>
            </div>

            <div class="panel-group">
                <label for="dxlocator"><?= $text['rotator-dx-locator'] ?></label>
                <div class="input-row">
                    <input type="text" id="dxlocator"
                           placeholder="<?= $text['rotator-dx-locator-placeholder'] ?>"
                           maxlength="6" autocomplete="off" autofocus>
                    <button type="button" id="directionButton"><?= $text['rotator-show'] ?></button>
                </div>
            </div>

            <div class="compass-wrap">
                <div class="compass" id="compass">
                    <span class="c-n">N</span>
                    <span class="c-e">E</span>
                    <span class="c-s">S</span>
                    <span class="c-w">W</span>
                    <div class="c-ne">NE</div>
                    <div class="c-nw">NW</div>
                    <div class="c-se">SE</div>
                    <div class="c-sw">SW</div>
                    <div class="needle-wrap" id="needleWrap">
                        <div class="needle"></div>
                    </div>
                    <div class="compass-center"></div>
                </div>
            </div>

            <div class="direction-info">
                <div class="info-row">
                    <i class="fas fa-route"></i>
                    <span><?= $text['rotator-distance'] ?></span>
                    <strong id="distanceValue">---</strong>
                </div>
                <div class="info-row">
                    <i class="fas fa-location-arrow"></i>
                    <span><?= $text['rotator-azimuth'] ?></span>
                    <strong id="azimuthValue">---</strong>
                </div>
            </div>

        </div>

        <div id="map"></div>
    </div>

    <script>
        const translations = {
            invalidLocator: <?= json_encode($text['rotator-invalid-locator']) ?>,
            noMyLocator:    <?= json_encode($text['rotator-no-my-locator']) ?>,
            editButton:     <?= json_encode($text['rotator-edit']) ?>,
            setButton:      <?= json_encode($text['rotator-set']) ?>,
        };
    </script>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
    <script src="assets/js/rotator.js"></script>
</body>
</html>
