<?php
// Default language
$default_lang = 'en';

// Supported languages
$supported_langs = ['cs', 'en'];

// Try to retrieve the language from the cookie
$lang = $_COOKIE['lang'] ?? null;

// If cookie is not set, use PHP to detect browser language
if (!$lang) {
    if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        // Get the language from the Accept-Language header (e.g. cs-CZ, en-US)
        $browser_langs = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
        foreach ($browser_langs as $blang) {
            // take the first two letters (language)
            $code = substr($blang, 0, 2);
            if (in_array($code, $supported_langs)) {
                $lang = $code;
                break;
            }
        }
    }
    // If the language is still unknown, we will use the default
    if (!$lang) {
        $lang = $default_lang;
    }

    // Set cookie for further requests
    setcookie('lang', $lang, time() + 60*60*24*365, "/");
}

// Now load the correct language file
switch ($lang) {
    case 'cs':
        include_once 'cs.php';
        break;
    case 'en':
    default:
        include_once 'en.php';
        break;
}
?>