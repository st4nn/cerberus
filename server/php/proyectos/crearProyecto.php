<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = json_decode($_POST['datos']);

   $fecha = $datos->FechaIni;

   if ($fecha == "")
   {
      $fecha = date('Y-m-d H:i:s');
   }

   if ($datos->idProyecto == "")
   {
    $idProyecto = 'null';
   } 
   
  $sql = "INSERT INTO obras (idObra, Nombre, Responsable, fechaIni, fechaFin) 
         VALUES (
            $idProyecto, 
            '" . $datos->Nombre . "', 
            '" . $datos->Descripcion . "', 
            '" . $datos->FechaIni . "', 
            '" . $datos->FechaFin . "')
          ON DUPLICATE KEY UPDATE
            Nombre = VALUES(Nombre),
            Responsable = VALUES(Responsable),
            fechaIni = VALUES(fechaIni),
            fechaFin = VALUES(fechaFin);";

  $result = $link->query(utf8_decode($sql));

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } else
  {
     echo 0;
  }
?>