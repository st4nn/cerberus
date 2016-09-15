<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $idObra = addslashes($_POST['idObra']);
   $codigoPoste = addslashes($_POST['codigoPoste']);
   $foto = addslashes($_POST['foto']);
   $codigoNC = addslashes($_POST['campo']);
   $Observaciones = addslashes($_POST['Observaciones']);
   $Criterio = addslashes($_POST['Criterio']);
   $Coordenadas = addslashes($_POST['Coordenadas']);

   $sql = "DELETE FROM soportes WHERE idObra = '$idObra' AND codigoPoste = '$codigoPoste' AND codigoNC = '$codigoNC' AND Criterio = '$Criterio';";
   $result = $link->query($sql);

   $values = "($idObra, '$codigoPoste', '$Criterio', '$codigoNC', '$foto', '$Observaciones', '$Coordenadas')";
      $sql = "INSERT INTO soportes (idObra, codigoPoste, Criterio, codigoNC, foto, Observaciones, coordenadas) VALUES " . $values . " ON DUPLICATE KEY UPDATE Observaciones = VALUES(Observaciones);";
      
      $result = $link->query($sql);

        $result = $link->query(utf8_decode($sql));

      if ( $link->affected_rows > 0)
      {
         echo 1;
      } else
      {
         echo 0;
      }
?>