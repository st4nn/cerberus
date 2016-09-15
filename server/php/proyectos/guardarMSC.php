<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $idObra = addslashes($_POST['idObra']);
   $codigoPoste = addslashes($_POST['codigoPoste']);
   $Criterio = addslashes($_POST['Criterio']);
   $codigoNC = addslashes($_POST['codigoNC']);
   
   $Clasificacion = addslashes($_POST['Clasificacion']);
   $justificacionClasificacion = addslashes($_POST['justificacionClasificacion']);
   $justificacion = addslashes($_POST['justificacion']);


  $sql = "INSERT INTO 
            msc_Resultado (idObra, codigoPoste, Criterio, codigoNC, Clasificacion, justificacion, justificacionClasificacion) 
            VALUES ('$idObra', '$codigoPoste', '$Criterio', '$codigoNC', '$Clasificacion', '$justificacion', '$justificacionClasificacion') ON DUPLICATE KEY UPDATE
             Clasificacion = VALUES(Clasificacion),
             justificacion = VALUES(justificacion),
             justificacionClasificacion = VALUES(justificacionClasificacion);";


    $result = $link->query(utf8_decode($sql));

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } else
  {
     echo 0;
  }
?>