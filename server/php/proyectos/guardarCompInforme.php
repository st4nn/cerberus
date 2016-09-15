<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = json_decode($_POST['datos']);
   $idObra = addslashes($_POST['idObra']);

   
  $sql = "INSERT INTO  msc_CompInforme (
              idObra ,
              Presupuesto ,
              CosteRepTrabajo ,
              CosteRealTrabajo
            )
            VALUES 
            (
            '" . $idObra . "', 
            '" . $datos->Presupuesto . "', 
            '" . $datos->CosteRepTrabajo . "', 
            '" . $datos->CosteRealTrabajo . "')
          ON DUPLICATE KEY UPDATE
            Presupuesto = VALUES(Presupuesto),
            CosteRepTrabajo = VALUES(CosteRepTrabajo),
            CosteRealTrabajo = VALUES(CosteRealTrabajo);";

  $result = $link->query(utf8_decode($sql));

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } else
  {
     echo "";
  }
?>