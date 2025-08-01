<link rel="stylesheet" href="assets/css/help-modal.css"> 

<button class="help-button" onclick="openHelpModal()" title="<?= $text['help-button'] ?>">
  <i class="fas fa-question"></i> 
</button>

<div id="helpModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeHelpModal()" title="<?= $text['help-close'] ?>">&times;</span>
    <div id="helpContent"></div>
  </div>
</div>

<script>
  var currentPath = "<?= ltrim($currentPath, '/') ?>";
  function openHelpModal() {
    const modal = document.getElementById('helpModal');
    const contentDiv = document.getElementById('helpContent');
    const helpButton = document.querySelector('.help-button');

    modal.style.display = 'block';

    fetch('assets/inc/help-text.php?page=' + currentPath)
      .then(response => response.text())
      .then(html => contentDiv.innerHTML = html);
  }

  function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    const helpButton = document.querySelector('.help-button');

    modal.style.display = 'none';
  }

  window.addEventListener('click', function(event) {
    const modal = document.getElementById('helpModal');
    if (modal && event.target === modal) {
      closeHelpModal();
    }
  });

</script>
