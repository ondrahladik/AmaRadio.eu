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
  <title><?= $text['404-message'] ?></title>
  <meta name="description" content="<?= $text['404-message'] ?>">
  <meta property="og:title" content="<?= $text['404-message'] ?>">
  <meta property="og:description" content="<?= $text['404-message'] ?>">
  <?php include 'assets/inc/head.php'?>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <link rel="stylesheet" href="assets/css/notfound.css"/>
</head>
<body>
  <div class="error-container">
    <h1>404</h1>
    <p><?= $text['404-message'] ?></p>
    <a href="/" class="cta-button"><i class="fas fa-home"></i> <?= $text['404-back'] ?></a>
  </div>
</body>
</html>
