<?php

if (!isset($_POST["content"]) || $_POST["content"] == "") {
 
    exit();
}

$id = $_POST["id"];
$content = $_POST["content"];
$x = $_POST["position_x"];
$y = $_POST["position_y"];



$DB_connection = new PDO("mysql:host=localhost;dbname=notes-js", "root" , "root");

// Si la note concernée possède un id différent de 0, c'est qu'elle existe déjà dans la table. Sinon, on peut l'y ajouter.

if ($id == 0) {

    $SQL_query = "INSERT INTO `notes` (`content` , `position_x` , `position_y`) VALUES (? , ? , ?)";

    $preparation = $DB_connection->prepare($SQL_query);

    $res = $preparation->execute([$content , $x , $y]);
    
    // Après insertion, il faut récupérer l'id du nouvel élément
    
    $SQL_query = "SELECT MAX(`id`) FROM `notes`";
    
    $preparation = $DB_connection->query($SQL_query);

    $res = $preparation->fetch();
    
    $new_id = $res[0];
    
    echo $new_id;
    
    
} else {
    
    $SQL_query = "UPDATE `notes` SET `content` = ? , `position_x` = ? , `position_y` = ? WHERE `id` = $id";

    $preparation = $DB_connection->prepare($SQL_query);

    $res = $preparation->execute([$content , $x , $y]);
    
}



?>
