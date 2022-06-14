<?php

$DB_connection = new PDO("mysql:host=localhost;dbname=notes-js", "root" , "");

$SQL_query = "SELECT * FROM `notes`";

$preparation = $DB_connection->query($SQL_query);

$result = $preparation->fetchAll();


// On convertit l'ensemble de notre résultat (les lignes disponibles dans la table notes) au format JSON, pour qu'il soit directement compréhensible par notre script JS comme un tableau renfermant les différentes informations relatives aux notes.

// On doit afficher le résultat de cette conversion pour qu'il soit récupérable coté JS

echo json_encode($result);

?>