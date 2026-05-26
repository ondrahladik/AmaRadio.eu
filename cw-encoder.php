<?php
error_reporting(0);
ini_set('display_errors', 0);
include 'assets/lang/lang.php';
$currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
?>
<!DOCTYPE html>
<html lang="<?= $text['lang'] ?>">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= $text['cw-encoder'] ?></title>
    <meta name="description" content="<?= $text['cw-encoder-title'] ?>">
    <meta property="og:title" content="<?= $text['cw-encoder'] ?>">
    <meta property="og:description" content="<?= $text['cw-encoder-title'] ?>">
    <?php include 'assets/inc/head.php' ?>
    <link rel="stylesheet" type="text/css" href="assets/css/cw-encoder.css">
</head>
<body>
    <?php include 'assets/inc/menu.php'; ?>
    <?php include 'assets/inc/help-modal.php'; ?>

    <div class="cw-enc-wrap">

        <div class="cw-enc-header">
            <h1 class="cw-enc-title"><?= $text['cw-encoder'] ?></h1>
        </div>

        <div class="cw-enc-grid">

            <div class="cw-enc-col-left">
                <div class="cw-panel">
                    <div class="cw-panel-body">

                        <div class="cw-field">
                            <label class="cw-label" for="plainText"><?= $text['cw-enc-text-label'] ?></label>
                            <textarea id="plainText" class="cw-textarea" rows="5"
                                placeholder="<?= htmlspecialchars($text['cw-enc-text-placeholder']) ?>"></textarea>
                        </div>

                        <div class="cw-field">
                            <div class="cw-label-row">
                                <label class="cw-label" for="wpmInput"><?= $text['cw-enc-speed'] ?></label>
                                <span class="cw-label-val" id="wpmValue">20</span>
                            </div>
                            <input type="range" id="wpmInput" class="cw-range"
                                min="5" max="40" step="1" value="20">
                        </div>

                        <div class="cw-field">
                            <div class="cw-label-row">
                                <label class="cw-label" for="freqInput"><?= $text['cw-enc-freq'] ?></label>
                                <span class="cw-label-val" id="freqValue">700 Hz</span>
                            </div>
                            <input type="range" id="freqInput" class="cw-range"
                                min="300" max="1200" step="10" value="700">
                        </div>

                        <div class="cw-two-col">
                            <div class="cw-field">
                                <div class="cw-label-row">
                                    <label class="cw-label" for="rampInput"><?= $text['cw-enc-rise'] ?></label>
                                </div>
                                <input type="range" id="rampInput" class="cw-range"
                                    min="0" max="20" step="1" value="5">
                            </div>
                            <div class="cw-field">
                                <div class="cw-label-row">
                                    <label class="cw-label" for="volumeInput"><?= $text['cw-enc-amp'] ?></label>
                                    <span class="cw-label-val" id="volumeValue">80%</span>
                                </div>
                                <input type="range" id="volumeInput" class="cw-range"
                                    min="5" max="100" step="5" value="80">
                            </div>
                        </div>

                        <div class="cw-field">
                            <div class="cw-label-row">
                                <label class="cw-label" for="gapInput"><?= $text['cw-enc-word-gap'] ?></label>
                                <span class="cw-label-val" id="gapValue">7</span>
                            </div>
                            <input type="range" id="gapInput" class="cw-range"
                                min="5" max="14" step="1" value="7">
                        </div>

                        <div class="cw-btn-group-icons">
                            <button id="playBtn" class="cw-btn cw-btn-primary cw-btn-icon"
                                title="<?= htmlspecialchars($text['cw-enc-btn-play']) ?>" disabled>
                                <i class="fa-solid fa-play"></i>
                            </button>
                            <button id="stopBtn" class="cw-btn cw-btn-danger cw-btn-icon"
                                title="<?= htmlspecialchars($text['cw-enc-btn-stop']) ?>" disabled>
                                <i class="fa-solid fa-stop"></i>
                            </button>
                            <button id="downloadBtn" class="cw-btn cw-btn-info cw-btn-icon"
                                title="<?= htmlspecialchars($text['cw-enc-btn-wav']) ?>" disabled>
                                <i class="fa-solid fa-download"></i>
                            </button>
                            <button id="clearBtn" class="cw-btn cw-btn-warn cw-btn-icon"
                                title="<?= htmlspecialchars($text['cw-enc-btn-clear']) ?>" disabled>
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>

                        <div class="cw-stats-grid" style="grid-template-columns: repeat(2,1fr); margin-top: 14px;">
                            <div class="cw-stat">
                                <div class="cw-stat-label"><?= $text['cw-enc-stat-duration'] ?></div>
                                <div class="cw-stat-value" id="durationValue">0.00 s</div>
                            </div>
                            <div class="cw-stat">
                                <div class="cw-stat-label"><?= $text['cw-enc-stat-chars'] ?></div>
                                <div class="cw-stat-value" id="charValue">0</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="cw-enc-col-right">

                <div class="cw-panel">
                    <div class="cw-panel-header">
                        <span><?= $text['cw-enc-output-panel'] ?></span>
                    </div>
                    <div class="cw-panel-body">
                        <div id="morseOutput" class="cw-readout cw-readout-morse"></div>
                    </div>
                </div>

                <div class="cw-panel">
                    <div class="cw-panel-header">
                        <span><?= $text['cw-enc-waveform-panel'] ?></span>
                    </div>
                    <div class="cw-panel-body" style="padding:0;">
                        <div class="cw-canvas-wrap">
                            <canvas id="waveCanvas" class="cw-canvas"></canvas>
                        </div>
                    </div>
                </div>

                <div id="outputValue" hidden></div>

            </div>
        </div>
    </div>

    <script src="assets/js/cw-encoder.js"></script>
</body>
</html>
