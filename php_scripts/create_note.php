<?php

if (!isset($_POST["content"]) || $_POST["content"] == "") {
    header("location:../");
    exit();
}

$content = $_POST["content"];



$DB_connection = new PDO("mysql:host=localhost;dbname=notes-js", "root" , "root");

$SQL_query = "INSERT INTO notes (`content`) VALUES (?)";

$preparation = $DB_connection->prepare($SQL_query);

$res = $preparation->execute([$content]);

//header("location:../");

?>