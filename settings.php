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
  <title><?= $text['settings-page-title'] ?></title>
  <meta name="description" content="<?= $text['settings-title'] ?>">
  <meta property="og:title" content="<?= $text['settings-page-title'] ?>">
  <meta property="og:description" content="<?= $text['settings-title'] ?>">
  <?php include 'assets/inc/head.php'?>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <link rel="stylesheet" href="assets/css/settings.css"/>
</head>
<body>
  <?php include 'assets/inc/menu.php'; ?>

  <div class="container">
    <main class="content-settings">
      <h1><?= $text['settings-page-title'] ?></h1>

      <form id="settingsForm">
        <div class="form-group">
          <label for="language"><?= $text['settings-language'] ?></label>
          <div class="language-selector">
            <button type="button" class="lang-btn" data-lang="cs" id="btn-cs">
              <img src="https://flagsapi.com/CZ/flat/32.png" alt="CZ">
              <span>Čeština</span>
            </button>
            <button type="button" class="lang-btn" data-lang="en" id="btn-en">
              <img src="https://flagsapi.com/GB/flat/32.png" alt="EN">
              <span>English</span>
            </button>
          </div>
          <input type="hidden" id="language" name="lang">
        </div>

        <div class="form-group">
          <label for="callsign"><?= $text['settings-callsign'] ?></label>
          <input 
            type="text" 
            id="callsign" 
            name="mycall" 
            placeholder="<?= $text['settings-callsign-help'] ?>"
            maxlength="12"
          >
        </div>

        <div class="form-group">
          <label for="locator"><?= $text['settings-locator'] ?></label>
          <input 
            type="text" 
            id="locator" 
            name="mylocator" 
            placeholder="<?= $text['settings-locator-help'] ?>"
            maxlength="6"
            pattern="[A-R]{2}[0-9]{2}[A-X]{2}"
          >
        </div>

        <div class="button-group">
          <button type="submit" class="btn btn-save"><?= $text['settings-save'] ?></button>
        </div>

        <div id="message" class="message"></div>
      </form>
    </main>
  </div>

  <script>
    window.settingsMessages = {
      invalidLocator: '<?= $text['locator-map-invalid-locator'] ?>',
      success: '<?= $text['settings-success'] ?>',
      error: '<?= $text['settings-error'] ?>'
    };
  </script>
  <script src="assets/js/settings.js"></script>
</body>
</html>
