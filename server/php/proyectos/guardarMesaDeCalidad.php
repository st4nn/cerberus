<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = json_decode($_POST['datos']);
   $contactos = json_decode($_POST['contactos']);
   $idObra = addslashes($_POST['idObra']);
   $Usuario = addslashes($_POST['Usuario']);

   $fecha = date("Y-m-d H:i:s");
   
  $sql = "INSERT INTO  msc (idObra, Lugar, Fecha, idResponsable, fechaActualizacion)
            VALUES 
            (
            '" . $idObra . "', 
            '" . $datos->Lugar . "', 
            '" . $datos->Fecha . " " . $datos->Hora . "', 
            '" . $Usuario . "',
            '$fecha')
          ON DUPLICATE KEY UPDATE
            Lugar = VALUES(Lugar),
            Fecha = VALUES(Fecha),
            idResponsable = VALUES(idResponsable ),
            fechaActualizacion = VALUES(fechaActualizacion );";


  $result = $link->query(utf8_decode($sql));

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } else
  {
     echo "";
  }

  $values = "";

  foreach ($contactos as $key => $value) 
  {
    $values .= "('" . $idObra . "', '" . $value->Nombre . "', '" . $value->Correo . "', '" . $value->Cargo . "', '" . $value->Empresa . "', 1, '$fecha'), ";
  }
  if ($values <> "")
  { 
    $values = utf8_decode(substr($values, 0, -2));

    $sql = "INSERT INTO obras_Contactos (idObra, Nombre, Correo, cargo, Empresa, mesaCalidad) VALUES $values 
          ON DUPLICATE KEY UPDATE 
            Nombre = VALUES(Nombre),
            cargo = VALUES(cargo),
            Empresa = VALUES(Empresa);";
            
    $result = $link->query(utf8_decode($sql));

  } 
?>
