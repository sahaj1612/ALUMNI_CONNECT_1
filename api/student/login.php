<?php

include "../../config/db.php";

$data = json_decode(file_get_contents("php://input"));

$usn = $data->usn;
$email = $data->email;
$password = $data->password;

$user = $db->students->findOne([
    "usn"=>$usn,
    "email"=>$email,
    "password"=>$password
]);

if($user){
    echo json_encode([
        "status"=>"success",
        "message"=>"Login successful"
    ]);
}else{
    echo json_encode([
        "status"=>"fail",
        "message"=>"Invalid credentials"
    ]);
}

?>