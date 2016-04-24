<?php
header('Content-Type: text/cache-manifest');
$filesToCache = array(
    './index.html', 
    './js/my-app.js', 
    './css/styles.css', 
    './img/Background.png', 
    '../../dist/js/framework7.min.js', 
    '../../dist/css/framework7.min.css'
);
?>
CACHE MANIFEST

CACHE:
<?php
// Print files that we need to cache and store hash data
$hashes = '';
foreach($filesToCache as $file) {
    echo $file."\n";
    $hashes.=md5_file($file);
};
?>

NETWORK:
*

# Hash Version: <?=md5($hashes)?>