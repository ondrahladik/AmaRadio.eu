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
    <title><?= $text['cw-decoder'] ?></title>
    <meta name="description" content="<?= $text['cw-decoder-title'] ?>">
    <meta property="og:title" content="<?= $text['cw-decoder'] ?>">
    <meta property="og:description" content="<?= $text['cw-decoder-title'] ?>">
    <?php include 'assets/inc/head.php' ?>
    <link rel="stylesheet" type="text/css" href="assets/css/cw-decoder.css">
</head>
<body>
    <?php include 'assets/inc/menu.php'; ?>
    <?php include 'assets/inc/help-modal.php'; ?>

    <div class="cw-dec-wrap">

        <div class="cw-dec-header">
            <h1 class="cw-dec-title"><?= $text['cw-decoder'] ?></h1>
        </div>

        <div class="cw-dec-grid">

            <div>
                <div class="cw-panel">
                    <div class="cw-panel-body">

                        <div class="cw-field">
                            <label class="cw-label" for="sourceMode"><?= $text['cw-dec-source-label'] ?></label>
                            <select id="sourceMode" class="cw-select">
                                <option value="mic"><?= $text['cw-dec-source-mic'] ?></option>
                                <option value="file"><?= $text['cw-dec-source-file'] ?></option>
                            </select>
                        </div>

                        <div id="dropZone" class="cw-drop-zone d-none">
                            <label style="display:block;">
                                <input type="file" id="fileInput" accept=".wav,audio/wav,audio/x-wav"
                                    style="display:none;">
                                <span class="cw-btn cw-btn-light" style="display:inline-flex;cursor:pointer;">
                                    <i class="fa-solid fa-folder-open"></i>
                                    <?= $text['cw-dec-file-choose'] ?>
                                </span>
                            </label>
                        </div>

                        <div class="cw-field" style="margin-top: 18px;">
                            <div class="cw-label-row">
                                <label class="cw-label" for="freqInput"><?= $text['cw-dec-freq-label'] ?></label>
                                <span class="cw-label-val" id="freqValue">700 Hz</span>
                            </div>
                            <input type="range" id="freqInput" class="cw-range"
                                min="300" max="1200" step="5" value="700">
                        </div>

                        <div class="cw-field">
                            <div class="cw-label-row">
                                <label class="cw-label" for="thresholdInput"><?= $text['cw-dec-threshold-label'] ?></label>
                                <span class="cw-label-val" id="thresholdValue">42%</span>
                            </div>
                            <input type="range" id="thresholdInput" class="cw-range"
                                min="5" max="90" step="1" value="42">
                        </div>

                        <div class="cw-field">
                            <div class="cw-label-row">
                                <label class="cw-label" for="wpmInput"><?= $text['cw-dec-wpm-label'] ?></label>
                                <span class="cw-label-val" id="wpmValue">20</span>
                            </div>
                            <input type="range" id="wpmInput" class="cw-range"
                                min="5" max="60" step="1" value="20">
                        </div>

                        <div class="cw-two-col">
                            <div class="cw-field">
                                <label class="cw-label" for="bandwidthInput"><?= $text['cw-dec-bandwidth-label'] ?></label>
                                <input type="range" id="bandwidthInput" class="cw-range"
                                    min="20" max="180" step="5" value="70">
                            </div>
                            <div class="cw-field">
                                <label class="cw-label" for="squelchInput"><?= $text['cw-dec-squelch-label'] ?></label>
                                <input type="range" id="squelchInput" class="cw-range"
                                    min="0" max="20" step="1" value="0">
                            </div>
                        </div>

                        <div class="cw-field">
                            <label class="cw-toggle-row" id="autoTuneRow">
                                <input type="checkbox" id="autoTuneInput" class="cw-toggle" checked>
                                <span class="cw-toggle-label"><?= $text['cw-dec-autotune-label'] ?></span>
                            </label>
                            <label class="cw-toggle-row">
                                <input type="checkbox" id="agcInput" class="cw-toggle" checked>
                                <span class="cw-toggle-label"><?= $text['cw-dec-agc-label'] ?></span>
                            </label>
                            <label class="cw-toggle-row" id="audioMonitorRow">
                                <input type="checkbox" id="audioMonitorInput" class="cw-toggle">
                                <span class="cw-toggle-label"><?= $text['cw-dec-monitor-label'] ?></span>
                            </label>
                        </div>

                        <div class="cw-btn-group-icons">
                            <button id="startBtn" class="cw-btn cw-btn-primary cw-btn-icon"
                                title="<?= htmlspecialchars($text['cw-dec-btn-start']) ?>">
                                <i class="fa-solid fa-microphone" id="startBtnIcon"></i>
                            </button>
                            <button id="stopBtn" class="cw-btn cw-btn-danger cw-btn-icon"
                                title="<?= htmlspecialchars($text['cw-dec-btn-stop']) ?>">
                                <i class="fa-solid fa-stop"></i>
                            </button>
                            <button id="findBtn" class="cw-btn cw-btn-info cw-btn-icon"
                                title="<?= htmlspecialchars($text['cw-dec-btn-find']) ?>">
                                <i class="fa-solid fa-crosshairs"></i>
                            </button>
                            <button id="clearBtn" class="cw-btn cw-btn-warn cw-btn-icon"
                                title="<?= htmlspecialchars($text['cw-dec-btn-clear']) ?>">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div>

                <div class="cw-panel">
                    <div class="cw-panel-header">
                        <span><?= $text['cw-dec-spectrum-panel'] ?></span>
                    </div>
                    <div class="cw-panel-body" style="padding:0;">
                        <div class="cw-canvas-wrap">
                            <canvas id="spectrumCanvas" class="cw-canvas cw-spectrum"></canvas>
                        </div>
                    </div>
                </div>

                <div class="cw-panel">
                    <div class="cw-panel-header">
                        <span><?= $text['cw-dec-waterfall-panel'] ?></span>
                    </div>
                    <div class="cw-panel-body" style="padding:0;">
                        <div class="cw-canvas-wrap">
                            <canvas id="waterfallCanvas" class="cw-canvas cw-waterfall"></canvas>
                        </div>
                    </div>
                </div>

            </div>

            <div>

                <div class="cw-panel">
                    <div class="cw-panel-header">
                        <span><?= $text['cw-dec-symbol-panel'] ?></span>
                    </div>
                    <div class="cw-panel-body">
                        <div id="symbolOutput" class="cw-readout cw-readout-symbol"></div>
                    </div>
                </div>

                <div class="cw-panel">
                    <div class="cw-panel-header">
                        <span><?= $text['cw-dec-decoded-panel'] ?></span>
                    </div>
                    <div class="cw-panel-body" style="padding:0 14px 14px;">
                        <div id="decodedOutput" class="cw-readout"></div>
                    </div>
                </div>

                <div class="cw-panel">
                    <div class="cw-panel-header">
                        <span><?= $text['cw-dec-signal-panel'] ?></span>
                    </div>
                    <div class="cw-panel-body">

                        <div style="margin-bottom:10px;">
                            <div class="cw-label-row" style="margin-bottom:6px;">
                                <span class="cw-label"><?= $text['cw-dec-strength-label'] ?></span>
                                <span class="cw-label-val" id="strengthText">0%</span>
                            </div>
                            <div class="cw-meter">
                                <div class="cw-meter-fill" id="meterFill" style="width:0%;"></div>
                                <div class="cw-meter-threshold" id="meterThreshold" style="left:42%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="cw-label-row" style="margin-bottom:6px;">
                                <span class="cw-label"><?= $text['cw-dec-snr-label'] ?></span>
                                <span class="cw-label-val" id="snrValue">-- dB</span>
                            </div>
                            <div class="cw-meter">
                                <div class="cw-meter-fill cw-meter-fill-snr" id="snrMeterFill" style="width:0%;"></div>
                                <div class="cw-meter-threshold" id="snrMeterThreshold" style="left:25%;"></div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    </div>

    <script>
        const cwDecT = {
            fileHint:       <?= json_encode($text['cw-dec-file-hint']) ?>,
            wavReady:       <?= json_encode($text['cw-dec-wav-ready']) ?>,
            wavStart:       <?= json_encode($text['cw-dec-wav-start']) ?>,
            requestingMic:  <?= json_encode($text['cw-dec-requesting-mic']) ?>,
            micActive:      <?= json_encode($text['cw-dec-mic-active']) ?>,
            micModeSelected:<?= json_encode($text['cw-dec-mic-mode']) ?>,
            stopped:        <?= json_encode($text['cw-dec-stopped']) ?>,
            stoppedCached:  <?= json_encode($text['cw-dec-stopped-cached']) ?>,
            noFileSelected: <?= json_encode($text['cw-dec-no-file']) ?>,
            errSecure:      <?= json_encode($text['cw-dec-err-secure']) ?>,
            errPerm:        <?= json_encode($text['cw-dec-err-perm']) ?>,
            errNotFound:    <?= json_encode($text['cw-dec-err-notfound']) ?>,
            warnFallback:   <?= json_encode($text['cw-dec-warn-fallback']) ?>,
        };
    </script>
    <script src="assets/js/cw-decoder.js"></script>
</body>
</html>
