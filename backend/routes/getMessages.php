<?php
require_once '../config/database.php';

$sender = $_GET['sender_id'];
$receiver = $_GET['receiver_id'];

$sql = "SELECT * FROM messages 
WHERE (sender_id = ? AND receiver_id = ?)
OR (sender_id = ? AND receiver_id = ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iiii", $sender, $receiver, $receiver, $sender);
$stmt->execute();

$result = $stmt->get_result();

$messages = [];

while ($row = $result->fetch_assoc()) {
    $messages[] = $row;
}

echo json_encode($messages);
