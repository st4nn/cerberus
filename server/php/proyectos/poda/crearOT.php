<?php
   include("../../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = json_decode($_POST['datos']);

   $Usuario = $_POST['Usuario'];
   $Circuito = $_POST['Circuito'];

   if ($datos->idOT == "")
   {
    $idOT = 'null';
   } 
   
  $sql = "INSERT INTO poda_OT(idOT, Prefijo, idCircuito, codigoOT, Observaciones, idLogin) VALUES 
          (
            " . addslashes($idOT) . ",
            '" . addslashes($datos->NumeroInterno) . "',
            '" . addslashes($Circuito) . "',
            '" . addslashes($datos->Numero) . "',
            '" . addslashes($datos->Observaciones) . "',
            '" . addslashes($Usuario) . "'
          ) ON DUPLICATE KEY UPDATE
          codigoOT = VALUES(codigoOT),
          Observaciones = VALUES(Observaciones);";

  $result = $link->query(utf8_decode($sql));

  if ( $link->affected_rows > 0)
  {
     echo $link->insert_id;
  } else
  {
     echo 0;
  }
?>