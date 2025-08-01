<?php

include 'assets/lang/lang.php';
?>

<link rel="stylesheet" href="assets/css/table.css"> 

<button class="table-button" onclick="openTableModal()" title="<?= $text['table-button'] ?>">
  <i class="fas fa-table"></i> 
</button>

<div id="tableModal" class="modal">
  <div class="modal-content-table">
    <span class="close" onclick="closeTableModal()" title="<?= $text['table-close'] ?>">&times;</span>
    <h2><?= $text['table-title'] ?></h2>
    <table class="prefix-table" id="resultsTable">
        <thead>
            <tr>
                <th style="width: 10%;"><?= $text['table-prefix'] ?></th>
                <th style="width: 30%;"><?= $text['table-state'] ?></th>
                <th style="width: 15%;"><?= $text['table-flag'] ?></th>
                <th style="width: 15%;"><?= $text['table-itu'] ?></th>
                <th style="width: 15%;"><?= $text['table-cq'] ?></th>
                <th style="width: 15%;"><?= $text['table-dxcc'] ?></th>
            </tr>
        </thead>
        <tbody id="results">
        </tbody>
    </table>

    <button id="downloadBtn"><?= $text['table-download'] ?></button>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
    <script type="text/javascript" src="/assets/js/table.js" ></script>
  </div>
</div>

<script>
  function openTableModal() {
    const modal = document.getElementById('tableModal');
    const tableButton = document.querySelector('.table-button');

    modal.style.display = 'block';
  }

  function closeTableModal() {
    const modal = document.getElementById('tableModal');
    const tableButton = document.querySelector('.table-button');

    modal.style.display = 'none';
  }

  window.addEventListener('click', function(event) {
    const modal = document.getElementById('tableModal');
    if (modal && event.target === modal) {
      closeTableModal();
    }
  });

</script>

