<?php
$currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
?>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
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
          <div class="icon-box"><i class="fas fa-search"></i></div>
          <span><?= $text['prefix-search'] ?></span>
        </a>
      </div>
      <div class="menu-item<?= $currentPath === '/locator-map' ? ' active' : '' ?>">
        <a href="/locator-map" title="<?= $text['locator-map'] ?>">
          <div class="icon-box"><i class="fas fa-map-marker-alt"></i></div>
          <span><?= $text['locator-map'] ?></span>
        </a>
      </div>
      <div class="menu-item<?= $currentPath === '/zone-map' ? ' active' : '' ?>">
        <a href="/zone-map" title="<?= $text['zone-map'] ?>">
          <div class="icon-box"><i class="fas fa-map"></i></div>
          <span><?= $text['zone-map'] ?></span>
        </a>
      </div>
      <div class="menu-item<?= $currentPath === '/time' ? ' active' : '' ?>">
        <a href="/time" title="<?= $text['time'] ?>" target="_blank">
          <div class="icon-box"><i class="fas fa-clock"></i></div>
          <span><?= $text['time'] ?></span>
        </a>
      </div>
      <div class="menu-item">
        <a href="https://ctu.amaradio.eu" target="_blank" rel="noopener" title="<?= $text['ctu-database'] ?>">
          <div class="icon-box"><i class="fas fa-database"></i></div>
          <span><?= $text['ctu-database'] ?></span>
        </a>
      </div>
      <div class="menu-item">
        <a style="cursor: pointer" onclick="openLangModal()" title="<?= $text['change-lang'] ?>">
          <div class="icon-box"><i class="fa-solid fa-language"></i></div>
          <span><?= $text['change-lang'] ?></span>
        </a>
      </div>
    </div>
  </div>

  <!-- Rozmazané pozadí -->
  <div class="blur-overlay"></div>

  <!-- MODAL pro výběr jazyka -->
  <div id="langModal" class="modal">
    <div class="modal-content">
      <span class="close" onclick="closeLangModal()" title="<?= $text['close'] ?>">&times;</span>
      <div id="langContent">
        <div id="lang-buttons">
          <p><strong><?= $text['change-lang'] ?></strong></p><br>
          <button class="lang-btn" data-lang="cs">
            <img src="https://flagsapi.com/CZ/flat/32.png" alt="Čeština" class="flag"> Čeština
          </button>
          <button class="lang-btn" data-lang="en">
            <img src="https://flagsapi.com/GB/flat/32.png" alt="English" class="flag"> English
          </button>
        </div>
      </div>
    </div>
  </div>

  <script>
    var currentPath = "<?= ltrim($currentPath, '/') ?>";

    function toggleMenu() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    }

    function openLangModal() {
      document.getElementById('langModal').style.display = 'block';
    }

    function closeLangModal() {
      document.getElementById('langModal').style.display = 'none';
    }

    window.addEventListener('click', function(event) {
      const langModal = document.getElementById('langModal');
      if (event.target === langModal) {
        closeLangModal();
      }
    });

    // Zavření menu kliknutím na blur pozadí
    document.addEventListener('DOMContentLoaded', () => {
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

      const buttons = document.querySelectorAll('.lang-btn');
      buttons.forEach(btn => {
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
