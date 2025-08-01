<style>
    #lang-form {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1000;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    #lang-select {
        padding: 5px 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background-color: #fff;
        font-size: 14px;
        cursor: pointer;
        transition: border-color 0.3s ease;
    }

    #lang-select:hover,
    #lang-select:focus {
        border-color: #666;
        outline: none;
    }

    #lang-form label {
        margin-right: 8px;
        font-weight: bold;
    }
</style>

<div>
    <form id="lang-form">
        <label for="lang-select"><?= $text['language'] ?></label>
        <select id="lang-select">
            <option value="en">English</option>
            <option value="cs">Čeština</option>
        </select>
    </form>
</div>

<script>
(function () {
    const localLang = localStorage.getItem('lang');
    const cookieMatch = document.cookie.match(/(?:^|;\s*)lang=([^;]+)/);
    const cookieLang = cookieMatch ? cookieMatch[1] : null;

    if (localLang !== cookieLang) {
        if(cookieLang) {
            localStorage.setItem('lang', cookieLang);
        }
    }

    const select = document.getElementById('lang-select');
    if (select) {
        select.value = localStorage.getItem('lang') || 'en';
        select.addEventListener('change', function () {
            localStorage.setItem('lang', this.value);
            document.cookie = "lang=" + this.value + "; path=/";
            location.reload();
        });
    }
})();
</script>