<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache');

$dir = __DIR__ . '/gallery-pics';
$files = glob($dir . '/*.{webp,jpg,jpeg,png,avif,JPG,JPEG,PNG,WEBP}', GLOB_BRACE) ?: [];

$names = array_map('basename', $files);
natcasesort($names);

echo json_encode(
    array_map(fn(string $name): string => 'gallery-pics/' . rawurlencode($name), array_values($names)),
    JSON_UNESCAPED_SLASHES
);
