<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $id = addslashes($_POST['id']);
   $idObra = addslashes($_POST['idObra']);
   $codigoPoste = addslashes($_POST['codigoPoste']);
   $codigoNC = addslashes($_POST['codigoNC']);
   $Criterio = addslashes($_POST['Criterio']);
   $Compromiso = addslashes($_POST['Compromiso']);
   $Responsable = addslashes($_POST['Responsable']);
   $fechaLimite = addslashes($_POST['fechaLimite']);

   $Usuario = addslashes($_POST['Usuario']);

   if ($id <> 0)
   {
      $values = "($id, $idObra, '$codigoPoste', '$Criterio', '$codigoNC', '$Compromiso', '$Responsable', '$fechaLimite')";
         $sql = "INSERT INTO msc_Compromisos (id, idObra, codigoPoste, Criterio, codigoNC, Compromiso, Responsable, fechaLimite) VALUES " . $values . " 
                  ON DUPLICATE KEY UPDATE 
                     idObra = VALUES(idObra),
                     codigoPoste = VALUES(codigoPoste),
                     Criterio = VALUES(Criterio),
                     codigoNC = VALUES(codigoNC),
                     Compromiso = VALUES(Compromiso),
                     Responsable = VALUES(Responsable),
                     fechaLimite = VALUES(fechaLimite);";
   } else
   {
      $values = "($idObra, '$codigoPoste', '$Criterio', '$codigoNC', '$Compromiso', '$Responsable', '$fechaLimite')";
         $sql = "INSERT INTO msc_Compromisos (idObra, codigoPoste, Criterio, codigoNC, Compromiso, Responsable, fechaLimite) VALUES " . $values . ";";
   }

      //echo $sql;      
      $result = $link->query(utf8_decode($sql));

      if ( $link->affected_rows > 0)
      {
         echo $link->insert_id;;
      } else
      {
         echo $id;
      }
?>