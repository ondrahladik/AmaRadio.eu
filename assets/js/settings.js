window.addEventListener('DOMContentLoaded', function() {
  const lang = localStorage.getItem('lang') || 'cs';
  const mycall = localStorage.getItem('mycall') || '';
  const mylocator = localStorage.getItem('mylocator') || '';

  document.getElementById('language').value = lang;
  document.getElementById('callsign').value = mycall;
  document.getElementById('locator').value = mylocator;

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    }
  });
});

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const lang = this.getAttribute('data-lang');
    document.getElementById('language').value = lang;

    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

document.getElementById('settingsForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const form = this;
  const messageDiv = document.getElementById('message');
  
  const lang = document.getElementById('language').value;
  const mycall = document.getElementById('callsign').value.toUpperCase();
  const mylocator = document.getElementById('locator').value.toUpperCase();

  if (mylocator && !/^[A-R]{2}[0-9]{2}[A-X]{2}$/.test(mylocator)) {
    messageDiv.textContent = window.settingsMessages.invalidLocator;
    messageDiv.className = 'message error';
    return;
  }

  try {
    localStorage.setItem('lang', lang);
    localStorage.setItem('mycall', mycall);
    localStorage.setItem('mylocator', mylocator);

    fetch('/assets/lang/save.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'lang=' + encodeURIComponent(lang)
    }).then(response => {
      if (response.ok) {
        messageDiv.textContent = window.settingsMessages.success;
        messageDiv.className = 'message success';

        setTimeout(() => {
          location.reload();
        }, 800);
      }
    }).catch(err => {
      messageDiv.textContent = window.settingsMessages.error;
      messageDiv.className = 'message error';
      
      setTimeout(() => {
        messageDiv.className = 'message';
      }, 3000);
    });
  } catch (err) {
    messageDiv.textContent = window.settingsMessages.error;
    messageDiv.className = 'message error';
    
    setTimeout(() => {
      messageDiv.className = 'message';
    }, 3000);
  }
});

document.addEventListener('click', function(e) {
  const messageDiv = document.getElementById('message');
  if (e.target === messageDiv) {
    messageDiv.className = 'message';
  }
});
