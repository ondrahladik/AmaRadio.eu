<?php
error_reporting(0);
ini_set('display_errors', 0);
include 'assets/lang/lang.php';
$currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$disableAnalytics = true;
?>

<!DOCTYPE html>
<html lang="<?= $text['lang'] ?>">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= $text['time-title-2'] ?></title>
    <meta name="description" content="<?= $text['time-title'] ?>">
    <meta property="og:title" content="<?= $text['time'] ?>">
    <meta property="og:description" content="<?= $text['time-title'] ?>">
    <?php include 'assets/inc/head.php' ?>
    <link rel="stylesheet" type="text/css" href="assets/css/time.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Droid+Sans:wght@400&display=swap">
</head>
<body>
    <?php include 'assets/inc/menu.php'; ?>
    <?php include 'assets/inc/help-modal.php'; ?>
    
    <div class="time-wrap">
        <div class="time-panel collapsed" id="timePanel">
            <div class="panel-controls">
                <button type="button" class="btn-icon-vertical" id="local-timezone-button" title="<?= $text['time-local-timezone'] ?>">
                    <i class="fa-solid fa-location-dot"></i>
                </button>
                <button type="button" class="btn-icon-vertical" id="full-button" title="<?= $text['time-fullscreen'] ?>">
                    <i class="fa-solid fa-maximize"></i>
                </button>
                <button type="button" class="panel-toggle" id="panel-toggle-button" title="<?= $text['time-settings'] ?>">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
            </div>

            <div class="panel-content">
                <div class="panel-group">
                    <label for="timezone-selector"><?= $text['time-settings'] ?></label>
                    <div class="input-row">
                        <input type="text" id="timezone-search" placeholder="<?= $text['time-search'] ?>">
                    </div>
                    <select id="timezone-selector" title="<?= $text['time-select-timezone'] ?>">
                    </select>
                </div>

                <div class="sync-info">
                    <div class="sync-row">
                        <i class="fas fa-sync-alt"></i>
                        <span id="time-control"></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="time-display-container">
            <div id="time" class="time-display">00:00:00</div>
        </div>
    </div>

    <script>
        const translations = {
            timeIs: <?= json_encode($text['time-is-title']) ?>,
            timeWaiting: <?= json_encode($text['time-waiting']) ?>,
            timeSyncOk: <?= json_encode($text['time-sync-ok']) ?>,
            timeSyncError: <?= json_encode($text['time-sync-error']) ?>,
            timeSeconds: <?= json_encode($text['time-seconds']) ?>,
        };
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/luxon/3.2.0/luxon.min.js"></script>
    <script type="text/javascript" src="assets/js/time.js"></script>
</body>
</html>