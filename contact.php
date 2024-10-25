<?php
$status = ''; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Zpracování dat formuláře
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = "ondra@ok1kky.cz"; 
    $subject = "AmaRadio.eu (new message)";
    $body = "Name: $name\nEmail: $email\nMessage:\n$message";

    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        $status = 'success';
    } else {
        $status = 'error';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="description" content="Tools for radio amateurs">
    <meta name="keywords" content="ham radio, ama radio, prefix, locator, map, OK1KKY">
    <meta name="author" content="OK1KKY">
    <meta property="og:title" content="Contact">
    <meta property="og:description" content="Tools for radio amateurs">
    <meta property="og:image" content="https://amaradio.eu/image/logo-title.png">
    <title>Contact</title>
    <link rel="apple-touch-icon" sizes="180x180" href="image/fav/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="image/fav/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="image/fav/favicon-16x16.png">
    <link rel="manifest" href="image/fav/site.webmanifest">
    <link rel="mask-icon" href="image/fav/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" type="text/css" href="css/menu.css">
    <link rel="stylesheet" type="text/css" href="css/contact.css">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-YV2XHJKTNW"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-YV2XHJKTNW');
    </script>
</head>
<body>
    <div class="container">
        <nav class="sidebar" id="sidebar">
            <a href="/">
                <img class="logo" src="image/logo-web.png" alt="Logo">
            </a>
            <div class="menu">
                <h2>PREFIX</h2>
                <ul>
                    <li><a href="prefix">SEARCH</a></li>
                    <li><a href="table">TABLE</a></li>
                    <li><a href="prefix-help">HELP</a></li>
                </ul>
            </div>
            <div class="menu">
                <h2>LOCATOR</h2>
                <ul>
                    <li><a href="locator">SEARCH</a></li>
                    <li><a href="qso-map">QSO MAP</a></li>
                    <li><a href="maps">MAPS</a></li>
                    <li><a href="locator-help">HELP</a></li>
                </ul>
            </div>
            <div class="menu">
                <h2>OTHER</h2>
                    <ul>
                        <li><a href="time" target="_blank">TIME</a></li>
                        <li><a href="https://ctu.amaradio.eu" target="_blank" title="only czech">ČTÚ</a></li>
                        <li><a href="other-help">HELP</a></li>
                    </ul>
                </div>
            <div class="menu">
                <h2>WEB</h2>
                <ul>
                    <li><a class="active" href="contact">CONTACT</a></li>
                    <li><a href="about">ABOUT</a></li>
                </ul>
            </div>
            <footer>
                <div class="social-icons">
                    <a href="https://fb.me/ok1kky" target="_blank" class="fab fa-facebook-f"></a>
                    <a href="https://x.com/ok1kky" target="_blank" class="fab fa-twitter"></a>
                    <a href="https://www.youtube.com/@ok1kky" target="_blank" class="fab fa-youtube"></a>
                    <a href="https://github.com/ondrahladik/AmaRadio.eu" target="_blank" class="fab fa-github"></a>
                </div>
                <br>
                <div>&copy; 2024 <a href="https://www.ok1kky.cz" target="_blank">OK1KKY</a></div>
            </footer>
        </nav>
        <main class="content-form">
            <h3 class="title">Contact form</h3>
            <button class="burger" id="burger">&#9776;</button>

                <div class="form">
                <form action="contact.php" method="post">
                    <input type="text" id="name" name="name" placeholder="Your name (e.g. Homer Simpson)" required>

                    <input type="email" id="email" name="email" placeholder="Your email (e.g. homer@simpson.com)" required>

                    <textarea id="message" name="message" placeholder="Your message (e.g. D'oh!)" required></textarea>

                    <button class="button" type="submit">Submit</button>
                </form><br>
                <?php if ($status) : ?>
                    <div class="message <?php echo $status; ?>">
                        <?php
                        if ($status == 'success') {
                            echo 'E-mail was successfully sent.';
                        } else {
                            echo 'There was an error sending the email.';
                        }
                        ?>
                    </div>
                <?php endif; ?>
            </div>
        </main>
        <script type="text/javascript" src="js/menu.js" ></script>
</body>
</html>