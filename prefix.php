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
  <title><?= $text['prefix-search'] ?></title>
  <meta name="description" content="<?= $text['prefix-title'] ?>">
  <meta property="og:title" content="<?= $text['prefix-search'] ?>">
  <meta property="og:description" content="<?= $text['prefix-title'] ?>">
  <?php include 'assets/inc/head.php'?>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
  <link rel="stylesheet" type="text/css" href="assets/css/prefix.css" />
</head>
<body>
  <?php include 'assets/inc/menu.php'; ?>
  <?php include 'assets/inc/help-modal.php'; ?>
  <?php include 'assets/inc/table.php'; ?>
  <div class="container">
    <main class="content-prefix">
      <input type="text" id="searchInput" maxlength="12" placeholder="<?= $text['prefix-placeholder'] ?>">
      <div id="resultsContainer">
        <table>
          <thead>
            <tr>
              <th colspan="2" class="state-column"><?= $text['state-label'] ?></th>
              <th class="flag-column"><?= $text['flag-label'] ?></th>
            </tr>
          </thead>
          <tbody id="results">
            <tr id="stateRow">
              <td id="stateName" colspan="2" class="state-label"></td>
              <td id="stateFlag" class="flag-label"></td>
            </tr>
            <tr id="labelsRow">
              <th class="itu-label"><?= $text['itu-label'] ?></th>
              <th class="cq-label"><?= $text['cq-label'] ?></th>
              <th class="dxcc-label"><?= $text['dxcc-label'] ?></th>
            </tr>
            <tr id="valuesRow">
              <td id="ituValue" class="itu-value"></td>
              <td id="cqValue" class="cq-value"></td>
              <td id="dxccValue" class="dxcc-value"></td>
            </tr>
            <tr>
              <th id="qrz" class="qrz-value"></th>
              <th id="qrzcq" class="qrzcq-value"></th>
              <th id="eqsl" class="eqsl-value"></th>
            </tr>
          </tbody>
        </table>
      </div>
      <script>
          const translations = {
              noResults: <?= json_encode($text['no-results']) ?>,
              newWindow: <?= json_encode($text['new-window']) ?>,
              searchError: <?= json_encode($text['search-error']) ?>,
          };
      </script>
      <script type="text/javascript" src="assets/js/prefix.js"></script>
    </main>
  </div>
</body>
</html>
