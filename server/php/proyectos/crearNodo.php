<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = json_decode($_POST['datos']);
   $idProyecto = json_decode($_POST['idObra']);

   
   if ($idProyecto == "")
   {
    $idProyecto = 'null';
   } 
   
  $sql = "INSERT INTO postes (idObra, Codigo, Auditar) 
         VALUES (
            $idProyecto, 
            '" . $datos->Nombre . "', 
            '0')
          ON DUPLICATE KEY UPDATE
            Codigo = VALUES(Codigo),
            Auditar = VALUES(Auditar);";


  $result = $link->query(utf8_decode($sql));

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } else
  {
     echo 0;
  }
?>