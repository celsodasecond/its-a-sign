<?php
// Project: It's A Sign Application
// Dev: Casulla, Jerald E.
// Project Started: June 12, 2023
// Project Ended: TBA

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, oAccess-Control-Allow-Headers, Authorization, X-Requested-With");
include_once '../database.php';
include_once '../score.php';

$database = new Database();
$db = $database->getConnection();

$item = new Score($db);
$item->user_id = $_POST['user_id'];
$item->difficulty = $_POST['difficulty'];

echo json_encode($item->getLeaderboard());
?>