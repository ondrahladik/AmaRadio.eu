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
  <title><?= $text['cluster-page-title'] ?></title>
  <meta name="description" content="<?= $text['cluster-title'] ?>">
  <meta property="og:title" content="<?= $text['cluster-page-title'] ?> – AMARADIO.eu">
  <meta property="og:description" content="<?= $text['cluster-title'] ?>">
  <?php include 'assets/inc/head.php' ?>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="stylesheet" href="assets/css/cluster.css" />
</head>
<body>
  <?php include 'assets/inc/menu.php'; ?>
  <?php include 'assets/inc/help-modal.php'; ?>

  <div class="cluster-wrap">

    <!-- Header -->
    <div class="cluster-header">
      <div class="cluster-header-left">
        <h1 class="cluster-title">
          <?= $text['cluster-page-title'] ?>
        </h1>
      </div>
      <div class="cluster-header-right">
        <div class="solar-split-btn">
          <span class="split-btn-time">
            <i class="fas fa-layer-group"></i>
            <span id="spotCount">–</span>&nbsp;<?= $text['cluster-spots'] ?>
          </span>
          <button class="split-btn-band-btn" id="bandBtn" type="button" aria-expanded="false">
            <i class="fa-solid fa-tower-broadcast"></i>
            <span id="bandLabel"><?= $text['cluster-band-all'] ?></span>
            <i class="fa-solid fa-chevron-down band-btn-chevron"></i>
          </button>
        </div>
        <div class="band-picker" id="bandPicker" hidden>
          <div class="band-picker-group">
            <button class="band-chip band-chip--all active" data-band="all"><?= $text['cluster-band-all'] ?></button>
          </div>
          <div class="band-picker-sep"></div>
          <div class="band-picker-group">
            <div class="band-picker-label band-picker-label--hf">HF</div>
            <div class="band-picker-chips">
              <?php foreach (['160m','80m','60m','40m','30m','20m','17m','15m','12m','10m'] as $b): ?>
              <button class="band-chip band-chip--hf" data-band="<?= $b ?>"><?= $b ?></button>
              <?php endforeach; ?>
            </div>
          </div>
          <div class="band-picker-sep"></div>
          <div class="band-picker-group">
            <div class="band-picker-label band-picker-label--vhf">VHF / UHF</div>
            <div class="band-picker-chips">
              <?php foreach (['6m','4m','2m','70cm'] as $b): ?>
              <button class="band-chip band-chip--vhf" data-band="<?= $b ?>"><?= $b ?></button>
              <?php endforeach; ?>
            </div>
          </div>
          <div class="band-picker-sep"></div>
          <div class="band-picker-group">
            <div class="band-picker-label band-picker-label--shf">SHF</div>
            <div class="band-picker-chips">
              <?php foreach (['23cm','13cm','9cm','6cm','3cm'] as $b): ?>
              <button class="band-chip band-chip--shf" data-band="<?= $b ?>"><?= $b ?></button>
              <?php endforeach; ?>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="cluster-table-wrap">
      <div id="clusterLoading" class="cluster-loading">
        <i class="fas fa-circle-notch fa-spin"></i>
        <?= $text['cluster-loading'] ?>
      </div>
      <div id="clusterError" class="cluster-error" style="display:none">
        <i class="fas fa-triangle-exclamation"></i>
        <span><?= $text['cluster-error'] ?></span>
      </div>
      <div id="clusterEmpty" class="cluster-empty" style="display:none">
        <i class="fas fa-satellite-dish"></i>
        <span><?= $text['cluster-no-spots'] ?></span>
      </div>
      <table class="cluster-table" id="clusterTable" style="display:none">
        <colgroup>
          <col class="col-date">
          <col class="col-time">
          <col class="col-spotter">
          <col class="col-freq">
          <col class="col-country">
          <col class="col-dx">
          <col class="col-message">
          <col class="col-mode">
        </colgroup>
        <thead>
          <tr>
            <th class="col-date"><?= $text['cluster-col-date'] ?></th>
            <th class="col-time"><?= $text['cluster-col-time'] ?></th>
            <th class="col-spotter"><?= $text['cluster-col-spotter'] ?></th>
            <th class="col-freq"><?= $text['cluster-col-freq'] ?></th>
            <th class="col-country"></th>
            <th class="col-dx"><?= $text['cluster-col-dx'] ?></th>
            <th class="col-message"><?= $text['cluster-col-message'] ?></th>
            <th class="col-mode"><?= $text['cluster-col-mode'] ?></th>
          </tr>
        </thead>
        <tbody id="clusterBody"></tbody>
      </table>
    </div>

    <!-- Attribution -->
    <div class="solar-attribution">
      <i class="fa-solid fa-database"></i>
      <?= $text['cluster-source'] ?>&nbsp;
      <a href="https://hamradio.my" target="_blank" rel="noopener">9M2PJU</a>
    </div>

  </div>

  <script>
    window.T = {
      qrz: <?= json_encode($text['cluster-qrz-lookup']) ?>,
    };
  </script>
  <script src="assets/js/cluster.js"></script>

</body>
</html>
