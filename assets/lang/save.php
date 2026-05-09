<?php
if (isset($_POST['lang'])) {
    $lang = $_POST['lang'];
    $supported_langs = ['cs', 'en'];
    
    if (in_array($lang, $supported_langs)) {
        setcookie('lang', $lang, time() + 60*60*24*365, "/");
        http_response_code(200);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid language']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No language provided']);
}
?>
