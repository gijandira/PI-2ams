<?php

function getEnvValue($key) {
    $lines = file(__DIR__ . '/../.env');

    foreach ($lines as $line) {
        if (strpos($line, $key . '=') === 0) {
            return trim(explode('=', $line)[1]);
        }
    }

    return null;
}

$host = getEnvValue('DB_HOST');
$user = getEnvValue('DB_USER');
$pass = getEnvValue('DB_PASS');
$db   = getEnvValue('DB_NAME');

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}
