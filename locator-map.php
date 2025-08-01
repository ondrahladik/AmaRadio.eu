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
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
    <link rel="stylesheet" type="text/css" href="assets/css/locator-map.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
<body>
    <?php include 'assets/inc/menu.php'; ?>
    <?php include 'assets/inc/help-modal.php'; ?>
    <div class="container">
        <main class="content-locator">
            <div class="container">
                <form>
                    <table class="form-table">
                        <tr>
                            <th><label for="locator"><?= $text['locator-map-search-label'] ?></label></th>
                            <th><label for="locator1" class="locator-label">
                                    <?= $text['locator-map-locator-label'] ?>&nbsp;<div class="icon A">A</div>
                                </label></th>
                            <th><label for="locator2" class="locator-label">
                                    <?= $text['locator-map-locator-label'] ?>&nbsp;<div class="icon B">B</div>
                                </label></th>
                        </tr>
                        <tr class="input">
                            <td>
                                <input type="text" id="locator" name="locator" maxlength="6" placeholder="<?= $text['locator-map-search-placeholder'] ?>" required>
                            </td>
                            <td>
                                <input type="text" id="locator1" name="locator1" maxlength="6" placeholder="<?= $text['locator-map-locator-placeholder-a'] ?>" required>
                            </td>
                            <td>
                                <input type="text" id="locator2" name="locator2" maxlength="6" placeholder="<?= $text['locator-map-locator-placeholder-b'] ?>" required>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button class="btn1" type="button" onclick="calculateSingleLocatorCoordinates()"><?= $text['locator-map-get-locator'] ?></button>
                            </td>
                            <td id="distance" class="distance">
                            </td>
                            <td>
                                <button type="button" onclick="calculateTwoLocatorsCoordinates()"><?= $text['locator-map-get-distance'] ?></button>
                            </td>
                        </tr>
                    </table>
                </form>
                <div id="map">
                    <div id="mouse-locator" class="mouse-locator-info"></div>
                </div>
            </div>
        </main>
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