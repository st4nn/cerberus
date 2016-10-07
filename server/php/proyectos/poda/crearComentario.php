<?php
   include("../../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $idOt = addslashes($_POST['idOt']);
   $idArbol = addslashes($_POST['idArbol']);
   $Usuario = addslashes($_POST['Usuario']);
   $Comentario = addslashes($_POST['Comentario']);
   $idRespuesta = addslashes($_POST['idRespuesta']);

  $sql = "INSERT INTO poda_Observaciones(idOt, idArbol, Usuario, Comentario, idRespuesta) VALUES 
          (
            '" . $idOt . "',
            '" . $idArbol . "',
            '" . $Usuario . "',
            '" . $Comentario . "',
            '" . $idRespuesta . "'
          ) ON DUPLICATE KEY UPDATE
              idOT = VALUES(idOT),
              idArbol = VALUES(idArbol),
              Usuario = VALUES(Usuario),
              Comentario = VALUES(Comentario),
              idRespuesta = VALUES(idRespuesta);";

  $result = $link->query(utf8_decode($sql));


  if ( $link->affected_rows > 0)
  {
     echo $link->insert_id;
  } else
  {
     echo 0;
  }
?>