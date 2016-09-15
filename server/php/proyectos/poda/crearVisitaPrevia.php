<?php
   include("../../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = json_decode($_POST['datos']);

   $idOT = $_POST['idOT'];
   $id = $datos->id;

   if ($id == "0")
   {
    $id = 'null';
   } 
   
  $sql = "INSERT INTO poda_VisitaPrevia(id, idOT, Prefijo, Fecha, Subestacion, Brigada, Descargo, refInicio, refFin, Usuario) VALUES 
          (
            " . addslashes($id) . ",
            '" . addslashes($idOT) . "',
            '" . addslashes($datos->NumeroInterno) . "',
            '" . addslashes($datos->Fecha) . "',
            '" . addslashes($datos->Subestacion) . "',
            '" . addslashes($datos->Brigada) . "',
            '" . addslashes($datos->Descargo) . "',
            '" . addslashes($datos->RefInicio) . "',
            '" . addslashes($datos->RefFin) . "',
            '" . addslashes($datos->Usuario) . "'
          ) ON DUPLICATE KEY UPDATE
              idOT = VALUES(idOT),
              Prefijo = VALUES(Prefijo),
              Fecha = VALUES(Fecha),
              Subestacion = VALUES(Subestacion),
              Brigada = VALUES(Brigada),
              Descargo = VALUES(Descargo),
              refInicio = VALUES(refInicio),
              refFin = VALUES(refFin),
              Usuario = VALUES(Usuario);";

  $result = $link->query(utf8_decode($sql));

  if ( $link->affected_rows > 0)
  {
     echo $link->insert_id;
  } else
  {
     echo 0;
  }
?>