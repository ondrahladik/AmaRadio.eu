<?php
header('Content-Type: text/html; charset=utf-8');
include '../lang/lang.php';

$page = $_GET['page'] ?? 'default';

switch ($page) {
  case 'prefix':
    echo "<h2>" . $text['help-prefix'] . "</h2><b>" . $text['help-prefix-title-1'] . "</b><br>" . $text['help-prefix-description-1'] . "<br><br>
          <b>" . $text['help-prefix-title-2'] . "</b><br>" . $text['help-prefix-description-2'] . "<br><br>
          <b>" . $text['help-prefix-title-3'] . "</b><br>" . $text['help-prefix-description-3'] . "<br><br>
          <b>" . $text['help-prefix-title-4'] . "</b><br>" . $text['help-prefix-description-4'] . "<br>";
    break;

  case 'locator-map':
    echo "<h2>" . $text['help-locator-map'] . "</h2><b>" . $text['help-locator-map-title-1'] . "</b><br>". $text['help-locator-map-description-1'] . "<br><br>
          <b>" . $text['help-locator-map-title-2'] . "</b><br>" . $text['help-locator-map-description-2'] . "<br><br>
          <b>" . $text['help-locator-map-title-3'] . "</b><br>" . $text['help-locator-map-description-3'] . "<br>";
    break;

  case 'zone-map':
    echo "<h2>" . $text['help-zone-map'] . "</h2>" . $text['help-zone-map-description-1'] . "<br><br>" . $text['help-zone-map-description-2'] . "<br><br>" . $text['help-zone-map-description-3'] . "<br>";
    break;

  case 'time':
    echo "<h2>" . $text['help-time'] . "</h2>" . $text['help-time-description-1'] . "<br><br>" . $text['help-time-description-2'] . "<br>" . $text['help-time-description-3'] . "<br><br>" . $text['help-time-description-4'] . "<br><br>" . $text['help-time-description-5'] . $text['help-time-description-6'] . "<br>" . $text['help-time-description-7'];
    break;

  default:
    echo "";
    break;
}
?>
