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
          <span class="split-btn-time split-btn-time--last">
            <i class="fa-regular fa-clock"></i>
            <span id="lastUpdate">–</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Band filter -->
    <div class="cluster-bands-wrap">
      <div class="cluster-bands" id="bandFilter">
        <?php
        $band_groups = [
          ['all'],
          ['160m','80m','60m','40m','30m','20m','17m','15m','12m','10m'],
          ['6m','4m','2m','70cm'],
          ['23cm','13cm','9cm','6cm','3cm'],
        ];
        $allBands = array_merge(...$band_groups);
        $first = true;
        foreach ($band_groups as $group):
          if (!$first): ?><span class="band-sep"></span><?php endif; $first = false;
        ?>
        <div class="band-group">
          <?php foreach ($group as $b):
            $label = $b === 'all' ? $text['cluster-band-all'] : $b; ?>
          <button class="band-btn<?= $b === 'all' ? ' active' : '' ?>" data-band="<?= $b ?>">
            <?= htmlspecialchars($label) ?>
          </button>
          <?php endforeach; ?>
        </div>
        <?php endforeach; ?>
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
          <col class="col-time">
          <col class="col-spotter">
          <col class="col-freq">
          <col class="col-country">
          <col class="col-dx">
          <col class="col-message">
        </colgroup>
        <thead>
          <tr>
            <th class="col-time"><?= $text['cluster-col-time'] ?></th>
            <th class="col-spotter"><?= $text['cluster-col-spotter'] ?></th>
            <th class="col-freq"><?= $text['cluster-col-freq'] ?></th>
            <th class="col-country"></th>
            <th class="col-dx"><?= $text['cluster-col-dx'] ?></th>
            <th class="col-message"><?= $text['cluster-col-message'] ?></th>
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
