<?php
require_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$sql = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iis", $data['sender_id'], $data['receiver_id'], $data['message']);

$stmt->execute();

echo json_encode(["message" => "Enviado"]);
