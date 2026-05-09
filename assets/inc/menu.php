<?php
$currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
?>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.2.0/css/all.min.css"/>
<link rel="stylesheet" href="/assets/css/menu.css">
<link rel="stylesheet" href="assets/css/help-modal.css">
</head>

<body>
  <div class="navbar">
    <div class="logo"><a href="/">AMARADIO.eu</a></div>
    <div class="menu-toggle" onclick="toggleMenu()"><i class="fas fa-bars"></i></div>
    <div class="menu" id="mobileMenu">
      <div class="menu-item<?= $currentPath === '/prefix' ? ' active' : '' ?>">
        <a href="/prefix" title="<?= $text['prefix-search'] ?>">
          <div class="icon-box"><i class="fa-solid fa-magnifying-glass"></i></div>
          <span><?= $text['prefix-search'] ?></span>
        </a>
      </div>
      <div class="menu-item<?= $currentPath === '/locator-map' ? ' active' : '' ?>">
        <a href="/locator-map" title="<?= $text['locator-map'] ?>">
          <div class="icon-box"><i class="fa-solid fa-location-dot"></i></div>
          <span><?= $text['locator-map'] ?></span>
        </a>
      </div>
      <div class="menu-item<?= $currentPath === '/zone-map' ? ' active' : '' ?>">
        <a href="/zone-map" title="<?= $text['zone-map'] ?>">
          <div class="icon-box"><i class="fa-solid fa-map"></i></div>
          <span><?= $text['zone-map'] ?></span>
        </a>
      </div>
      <div class="menu-item<?= $currentPath === '/rotator' ? ' active' : '' ?>">
        <a href="/rotator" title="<?= $text['rotator'] ?>">
          <div class="icon-box"><i class="fa-solid fa-compass"></i></div>
          <span><?= $text['rotator'] ?></span>
        </a>
      </div>
      <div class="menu-item<?= $currentPath === '/cluster' ? ' active' : '' ?>">
        <a href="/cluster" title="<?= $text['cluster'] ?>">
          <div class="icon-box"><i class="fa-solid fa-circle-nodes"></i></div>
          <span><?= $text['cluster'] ?></span>
        </a>
      </div>
      <div class="menu-item<?= $currentPath === '/solar' ? ' active' : '' ?>">
        <a href="/solar" title="<?= $text['solar-page-title'] ?>">
          <div class="icon-box"><i class="fa-solid fa-sun"></i></div>
          <span><?= $text['solar-page-title'] ?></span>
        </a>
      </div>
      <div class="menu-item<?= $currentPath === '/time' ? ' active' : '' ?>">
        <a href="/time" title="<?= $text['time'] ?>">
          <div class="icon-box"><i class="fa-solid fa-clock"></i></div>
          <span><?= $text['time'] ?></span>
        </a>
      </div>
      <div class="menu-item">
        <a href="https://ctu.amaradio.eu" target="_blank" rel="noopener" title="<?= $text['ctu-database'] ?>">
          <div class="icon-box"><i class="fa-solid fa-database"></i></div>
          <span><?= $text['ctu-database'] ?></span>
        </a>
      </div>
      <div class="menu-item<?= $currentPath === '/settings' ? ' active' : '' ?>">
        <a href="/settings" title="<?= $text['settings-page-title'] ?>">
          <div class="icon-box"><i class="fa-solid fa-gear"></i></div>
          <span><?= $text['settings-page-title'] ?></span>
        </a>
      </div>
      <div class="menu-item lang-switcher" id="langSwitcher">
        <a style="cursor: pointer" onclick="toggleLangDropdown(event)" title="<?= $text['change-lang'] ?>">
          <div class="icon-box">
            <img src="https://flagsapi.com/<?= $text['lang'] === 'cs' ? 'CZ' : 'GB' ?>/flat/32.png"
                 class="lang-flag" alt="<?= strtoupper($text['lang']) ?>">
          </div>
          <span><?= $text['lang'] === 'cs' ? 'CZ' : 'EN' ?></span>
        </a>
        <div class="lang-dropdown" id="langDropdown">
          <button class="lang-option <?= $text['lang'] === 'cs' ? 'lang-active' : '' ?>" data-lang="cs">
            <img src="https://flagsapi.com/CZ/flat/32.png" alt="CZ"> Čeština
          </button>
          <button class="lang-option <?= $text['lang'] === 'en' ? 'lang-active' : '' ?>" data-lang="en">
            <img src="https://flagsapi.com/GB/flat/32.png" alt="EN"> English
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="blur-overlay"></div>

  <script>
    var currentPath = "<?= ltrim($currentPath, '/') ?>";

    function toggleMenu() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    }

    function toggleLangDropdown(event) {
      event.stopPropagation();
      document.getElementById('langDropdown').classList.toggle('open');
    }

    document.addEventListener('click', function(e) {
      const switcher = document.getElementById('langSwitcher');
      if (switcher && !switcher.contains(e.target)) {
        document.getElementById('langDropdown').classList.remove('open');
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      const blurOverlay = document.querySelector('.blur-overlay');
      blurOverlay.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('open');
        document.body.classList.remove('menu-open');
      });

      const cookieMatch = document.cookie.match(/(?:^|;\s*)lang=([^;]+)/);
      const cookieLang = cookieMatch ? cookieMatch[1] : null;
      const localLang = localStorage.getItem('lang');

      if (localLang !== cookieLang && cookieLang) {
        localStorage.setItem('lang', cookieLang);
      }

      document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedLang = btn.getAttribute('data-lang');
          localStorage.setItem('lang', selectedLang);
          document.cookie = "lang=" + selectedLang + "; path=/";
          location.reload();
        });
      });
    });
  </script>
</body>

