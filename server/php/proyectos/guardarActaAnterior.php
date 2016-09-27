<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $Usuario = addslashes($_POST['id']);
   $idObra = addslashes($_POST['idObra']);
   $datos = addslashes($_POST['datos']);

   if ($idObra <> 0)
   {
      $sql = "INSERT INTO msc_CompInforme (idObra, ActaAnterior) VALUES ($idObra, '$datos') 
                  ON DUPLICATE KEY UPDATE 
                     ActaAnterior = VALUES(ActaAnterior);";

      $result = $link->query(utf8_decode($sql));

      if ( $link->affected_rows > 0)
      {
         echo $link->insert_id;;
      } else
      {
         echo $id;
      }
   } else
   {
      echo 0;
   }
?>