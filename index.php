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
  <title>AMARADIO.eu</title>
  <meta name="description" content="<?= $text['description'] ?>">
  <meta property="og:title" content="AMARADIO.eu">
  <meta property="og:description" content="<?= $text['description'] ?>">
  <?php include 'assets/inc/head.php'?>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <link rel="stylesheet" href="assets/css/index.css"/>
</head>
<body>
  <div class="hero">
    <?php include 'assets/lang/switch.php'; ?>
    <h1>AMARADIO.eu</h1>
    <p><?= $text['description'] ?></p>
    <button class="cta-button" onclick="document.getElementById('tools').scrollIntoView({behavior:'smooth'})"><?= $text['show-tools'] ?></button>
    <div class="menu">
      <a href="about"><?= $text['about'] ?></a>
    </div>
  </div>

  <div class="section" id="tools">
    <div class="tools-grid">
      <a href="/prefix" class="tool-block">
        <h1><i class="fas fa-search"></i> <?= $text['prefix-search'] ?></h1>
        <p><?= $text['prefix-title'] ?></p>
      </a>
      <a href="/locator-map" class="tool-block">
        <h1><i class="fas fa-map-marker-alt"></i> <?= $text['locator-map'] ?></h1>
        <p><?= $text['locator-title'] ?></p>
      </a>
      <a class="tool-block disabled" data-coming="<?= $text['coming-soon'] ?>">
        <h1><i class="fas fa-globe"></i> <?= $text['qso-map'] ?></h1>
        <p><?= $text['qso-title'] ?></p>
      </a>
      <a href="/zone-map" class="tool-block">
        <h1><i class="fa-solid fa-map"></i> <?= $text['zone-map'] ?></h1>
        <p><?= $text['zone-title'] ?></p>
      </a>
      <a href="/time" class="tool-block" target="_blank">
        <h1><i class="fa-solid fa-clock"></i> <?= $text['time'] ?></h1>
        <p><?= $text['time-title'] ?></p>
      </a>
      <a class="tool-block disabled" data-coming="<?= $text['coming-soon'] ?>">
        <h1><i class="fas fa-database"></i> <?= $text['qrg-database'] ?></h1>
        <p><?= $text['qrg-title'] ?></p>
      </a>
      <a href="https://ctu.amaradio.eu" class="tool-block" target="_blank">
        <h1><i class="fas fa-database"></i> <?= $text['ctu-database'] ?></h1>
        <p><?= $text['ctu-title'] ?></p>
      </a>
    </div>
  </div>

  <footer>
    &copy; 2024-<?php echo date("Y") ?> AMARADIO.eu | <?= $text['copyright'] ?><a href="https://www.ok1kky.cz" target="_blank">OK1KKY</a>
  </footer>

</body>
</html>

