<?php
$currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Current page metadata for navbar indicator and keyboard shortcuts
$pageInfo = [
    '/prefix'      => ['icon' => 'fa-magnifying-glass', 'label' => $text['prefix-search'],   'key' => 'P', 'href' => '/prefix'],
    '/locator-map' => ['icon' => 'fa-location-dot',     'label' => $text['locator-map'],      'key' => 'L', 'href' => '/locator-map'],
    '/zone-map'    => ['icon' => 'fa-map',              'label' => $text['zone-map'],         'key' => 'Z', 'href' => '/zone-map'],
    '/terrain'     => ['icon' => 'fa-mountain',         'label' => $text['terrain'],          'key' => 'H', 'href' => '/terrain'],
    '/rotator'     => ['icon' => 'fa-compass',          'label' => $text['rotator'],          'key' => 'R', 'href' => '/rotator'],
    '/cluster'     => ['icon' => 'fa-circle-nodes',     'label' => $text['cluster'],          'key' => 'D', 'href' => '/cluster'],
    '/solar'       => ['icon' => 'fa-sun',              'label' => $text['solar-page-title'], 'key' => 'S', 'href' => '/solar'],
    '/time'        => ['icon' => 'fa-clock',            'label' => $text['time'],             'key' => 'T', 'href' => '/time'],
    '/settings'    => ['icon' => 'fa-gear',             'label' => $text['settings-page-title'], 'key' => 'G', 'href' => '/settings'],
    '/cw-encoder'  => ['icon' => 'fa-wave-square',      'label' => $text['cw-encoder'],          'key' => 'E', 'href' => '/cw-encoder'],
    '/cw-decoder'  => ['icon' => 'fa-headphones',       'label' => $text['cw-decoder'],          'key' => 'K', 'href' => '/cw-decoder'],
];
$currentPage = $pageInfo[$currentPath] ?? null;
?>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.2.0/css/all.min.css"/>
<link rel="stylesheet" href="/assets/css/menu.css">
<link rel="stylesheet" href="assets/css/help-modal.css">
</head>

<body>
  <!-- Navbar -->
  <div class="navbar">
    <div class="navbar-left">
      <div class="logo"><a href="/">AMARADIO.eu</a></div>
      <?php if ($currentPage): ?>
      <div class="navbar-current">
        <i class="fa-solid <?= $currentPage['icon'] ?>"></i>
        <span><?= $currentPage['label'] ?></span>
      </div>
      <?php endif; ?>
    </div>

    <button class="menu-toggle" id="menuToggle" onclick="toggleMenu()" aria-label="Menu" aria-expanded="false" aria-controls="navOverlay">
      <div class="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="toggle-labels">
        <span class="label-menu">MENU</span>
        <span class="label-close"><?= strtoupper($text['close']) ?></span>
      </div>
    </button>
  </div>

  <!-- Fullscreen overlay menu -->
  <div class="nav-overlay" id="navOverlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
    <div class="nav-overlay-inner">

      <nav class="nav-grid">
        <a href="/prefix" class="nav-item<?= $currentPath === '/prefix' ? ' active' : '' ?>">
          <div class="nav-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
          <span class="nav-label"><?= $text['prefix-search'] ?></span>
          <p class="nav-desc"><?= $text['prefix-title'] ?></p>
        </a>
        <a href="/locator-map" class="nav-item<?= $currentPath === '/locator-map' ? ' active' : '' ?>">
          <div class="nav-icon"><i class="fa-solid fa-location-dot"></i></div>
          <span class="nav-label"><?= $text['locator-map'] ?></span>
          <p class="nav-desc"><?= $text['locator-title'] ?></p>
        </a>
        <a href="/zone-map" class="nav-item<?= $currentPath === '/zone-map' ? ' active' : '' ?>">
          <div class="nav-icon"><i class="fa-solid fa-map"></i></div>
          <span class="nav-label"><?= $text['zone-map'] ?></span>
          <p class="nav-desc"><?= $text['zone-title'] ?></p>
        </a>
        <a href="/rotator" class="nav-item<?= $currentPath === '/rotator' ? ' active' : '' ?>">
          <div class="nav-icon"><i class="fa-solid fa-compass"></i></div>
          <span class="nav-label"><?= $text['rotator'] ?></span>
          <p class="nav-desc"><?= $text['rotator-title'] ?></p>
        </a>
        <a href="/terrain" class="nav-item<?= $currentPath === '/terrain' ? ' active' : '' ?>">
          <div class="nav-icon"><i class="fa-solid fa-mountain"></i></div>
          <span class="nav-label"><?= $text['terrain'] ?></span>
          <p class="nav-desc"><?= $text['terrain-title'] ?></p>
        </a>
        <a href="/cluster" class="nav-item<?= $currentPath === '/cluster' ? ' active' : '' ?>">
          <div class="nav-icon"><i class="fa-solid fa-circle-nodes"></i></div>
          <span class="nav-label"><?= $text['cluster'] ?></span>
          <p class="nav-desc"><?= $text['cluster-title'] ?></p>
        </a>
        <a href="/solar" class="nav-item<?= $currentPath === '/solar' ? ' active' : '' ?>">
          <div class="nav-icon"><i class="fa-solid fa-sun"></i></div>
          <span class="nav-label"><?= $text['solar-page-title'] ?></span>
          <p class="nav-desc"><?= $text['solar-title'] ?></p>
        </a>
        <a href="/cw-encoder" class="nav-item<?= $currentPath === '/cw-encoder' ? ' active' : '' ?>">
          <div class="nav-icon"><i class="fa-solid fa-wave-square"></i></div>
          <span class="nav-label"><?= $text['cw-encoder'] ?></span>
          <p class="nav-desc"><?= $text['cw-encoder-title'] ?></p>
        </a>
        <a href="/cw-decoder" class="nav-item<?= $currentPath === '/cw-decoder' ? ' active' : '' ?>">
          <div class="nav-icon"><i class="fa-solid fa-headphones"></i></div>
          <span class="nav-label"><?= $text['cw-decoder'] ?></span>
          <p class="nav-desc"><?= $text['cw-decoder-title'] ?></p>
        </a>
        <a href="/time" class="nav-item<?= $currentPath === '/time' ? ' active' : '' ?>">
          <div class="nav-icon"><i class="fa-solid fa-clock"></i></div>
          <span class="nav-label"><?= $text['time'] ?></span>
          <p class="nav-desc"><?= $text['time-title'] ?></p>
        </a>
        <a href="https://ctu.amaradio.eu" target="_blank" rel="noopener" class="nav-item">
          <span class="nav-ext-badge"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
          <div class="nav-icon"><i class="fa-solid fa-database"></i></div>
          <span class="nav-label"><?= $text['ctu-database'] ?></span>
          <p class="nav-desc"><?= $text['ctu-title'] ?></p>
        </a>
        <a href="/settings" class="nav-item<?= $currentPath === '/settings' ? ' active' : '' ?>">
          <div class="nav-icon"><i class="fa-solid fa-gear"></i></div>
          <span class="nav-label"><?= $text['settings-page-title'] ?></span>
          <p class="nav-desc"><?= $text['settings-title'] ?></p>
        </a>
      </nav>

      <div class="nav-overlay-footer">
        <div class="lang-switcher-full">
          <button class="lang-opt <?= $text['lang'] === 'cs' ? 'lang-active' : '' ?>" data-lang="cs">
            <img src="https://flagsapi.com/CZ/flat/32.png" alt="CZ"> Čeština
          </button>
          <button class="lang-opt <?= $text['lang'] === 'en' ? 'lang-active' : '' ?>" data-lang="en">
            <img src="https://flagsapi.com/GB/flat/32.png" alt="EN"> English
          </button>
        </div>
        <button class="shortcuts-btn" onclick="openShortcuts()">
          <i class="fa-solid fa-keyboard"></i>
          <span><?= $text['lang'] === 'cs' ? 'Klávesové zkratky' : 'Keyboard shortcuts' ?></span>
        </button>
      </div>

    </div>
  </div>

  <!-- Keyboard shortcuts modal -->
  <div class="shortcuts-modal" id="shortcutsModal" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="shortcuts-modal-backdrop" onclick="closeShortcuts()"></div>
    <div class="shortcuts-modal-box">
      <div class="shortcuts-modal-head">
        <span><i class="fa-solid fa-keyboard"></i>&nbsp; <?= $text['lang'] === 'cs' ? 'Klávesové zkratky' : 'Keyboard shortcuts' ?></span>
        <button class="shortcuts-modal-close" onclick="closeShortcuts()" aria-label="<?= $text['close'] ?>">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="shortcuts-list">
        <div class="shortcut-row"><kbd>Alt+P</kbd><span><?= $text['prefix-search'] ?></span></div>
        <div class="shortcut-row"><kbd>Alt+L</kbd><span><?= $text['locator-map'] ?></span></div>
        <div class="shortcut-row"><kbd>Alt+Z</kbd><span><?= $text['zone-map'] ?></span></div>
        <div class="shortcut-row"><kbd>Alt+R</kbd><span><?= $text['rotator'] ?></span></div>
        <div class="shortcut-row"><kbd>Alt+H</kbd><span><?= $text['terrain'] ?></span></div>
        <div class="shortcut-row"><kbd>Alt+D</kbd><span><?= $text['cluster'] ?></span></div>
        <div class="shortcut-row"><kbd>Alt+S</kbd><span><?= $text['solar-page-title'] ?></span></div>
        <div class="shortcut-row"><kbd>Alt+E</kbd><span><?= $text['cw-encoder'] ?></span></div>
        <div class="shortcut-row"><kbd>Alt+K</kbd><span><?= $text['cw-decoder'] ?></span></div>
        <div class="shortcut-row"><kbd>Alt+T</kbd><span><?= $text['time'] ?></span></div>
        <div class="shortcut-row"><kbd>Alt+C</kbd><span><?= $text['ctu-database'] ?></span></div>
        <div class="shortcut-row"><kbd>Alt+G</kbd><span><?= $text['settings-page-title'] ?></span></div>
        <div class="shortcut-separator"></div>
        <div class="shortcut-row"><kbd>Esc</kbd><span><?= $text['lang'] === 'cs' ? 'Zavřít menu' : 'Close menu' ?></span></div>
        <div class="shortcut-row"><kbd>↑↓←→</kbd><span><?= $text['lang'] === 'cs' ? 'Navigace v menu' : 'Navigate menu' ?></span></div>
      </div>
    </div>
  </div>

  <script>
    var currentPath = "<?= ltrim($currentPath, '/') ?>";

    // Toggle open/close
    function toggleMenu() {
      const menu = document.getElementById('navOverlay');
      const toggle = document.getElementById('menuToggle');
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('menu-open', isOpen);

      if (isOpen) {
        setTimeout(() => {
          const active = document.querySelector('.nav-item.active');
          const first = document.querySelector('.nav-item');
          const target = active || first;
          if (target) target.focus();
        }, 380);
      }
    }

    // Keyboard: Escape + arrow navigation + Alt shortcuts
    document.addEventListener('keydown', function(e) {
      const menu = document.getElementById('navOverlay');

      if (e.key === 'Escape') {
        if (document.getElementById('shortcutsModal').classList.contains('open')) {
          closeShortcuts(); return;
        }
        if (menu.classList.contains('open')) {
          toggleMenu(); return;
        }
      }

      // Arrow key navigation inside open menu
      if (menu.classList.contains('open') && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const items = Array.from(document.querySelectorAll('.nav-item'));
        const focused = document.activeElement;
        let idx = items.indexOf(focused);
        const cols = window.innerWidth <= 600 ? 2 : 3;

        if (idx === -1) {
          idx = 0;
        } else if (e.key === 'ArrowRight') {
          idx = Math.min(idx + 1, items.length - 1);
        } else if (e.key === 'ArrowLeft') {
          idx = Math.max(idx - 1, 0);
        } else if (e.key === 'ArrowDown') {
          idx = Math.min(idx + cols, items.length - 1);
        } else if (e.key === 'ArrowUp') {
          idx = Math.max(idx - cols, 0);
        }

        items[idx].focus();
        return;
      }

      if (e.altKey && !menu.classList.contains('open')) {
        const shortcuts = {
          'p': '/prefix',
          'l': '/locator-map',
          'z': '/zone-map',
          'r': '/rotator',
          'h': '/terrain',
          'd': '/cluster',
          's': '/solar',
          't': '/time',
          'c': 'https://ctu.amaradio.eu',
          'g': '/settings',
          'e': '/cw-encoder',
          'k': '/cw-decoder',
        };
        const target = shortcuts[e.key.toLowerCase()];
        if (target) {
          e.preventDefault();
          if (target.startsWith('http')) window.open(target, '_blank');
          else window.location.href = target;
        }
      }
    });

    // Keyboard shortcuts modal
    function openShortcuts() {
      var m = document.getElementById('shortcutsModal');
      m.classList.add('open');
      m.setAttribute('aria-hidden', 'false');
    }
    function closeShortcuts() {
      var m = document.getElementById('shortcutsModal');
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
    }

    // Language switcher
    window.addEventListener('DOMContentLoaded', () => {
      const cookieMatch = document.cookie.match(/(?:^|;\s*)lang=([^;]+)/);
      const cookieLang = cookieMatch ? cookieMatch[1] : null;
      const localLang = localStorage.getItem('lang');
      if (localLang !== cookieLang && cookieLang) localStorage.setItem('lang', cookieLang);

      document.querySelectorAll('.lang-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedLang = btn.getAttribute('data-lang');
          localStorage.setItem('lang', selectedLang);
          document.cookie = "lang=" + selectedLang + "; path=/";
          location.reload();
        });
      });
    });
  </script>
