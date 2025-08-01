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
  <title><?= $text['about-title'] ?></title>
  <meta name="description" content="<?= $text['about-title'] ?>">
  <meta property="og:title" content="<?= $text['about-title'] ?>">
  <meta property="og:description" content="<?= $text['about-title'] ?>">
  <?php include 'assets/inc/head.php'?>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <link rel="stylesheet" type="text/css" href="assets/css/about.css">
</head>
<body>

    <div class="menu">
        <a href="/"><?= $text['about-close'] ?></a>
    </div>
    <div class="hero">
        <p><?= $text['about-description-1'] ?></p>
        <p><?= $text['about-description-2'] ?></p>
        <p><?= $text['about-description-3'] ?></p>
        <p><?= $text['about-description-4'] ?></p>
        <p><?= $text['about-description-5'] ?></p>
        <p>
          <div class="social-icons">
            <a href="https://fb.me/ok1kky" target="_blank" class="fab fa-facebook-f"></a>
            <a href="https://x.com/ok1kky" target="_blank" class="fab fa-twitter"></a>
            <a href="https://www.youtube.com/@ok1kky" target="_blank" class="fab fa-youtube"></a>
            <a href="https://github.com/ondrahladik/AmaRadio.eu" target="_blank" class="fab fa-github"></a>
          </div>
        </p>
    </div>
</body>
</html>

