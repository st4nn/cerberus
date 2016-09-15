<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = json_decode($_POST['datos']);
   $contactos = json_decode($_POST['contactos']);
   $idObra = addslashes($_POST['idObra']);
   $Usuario = addslashes($_POST['Usuario']);

   
  $sql = "INSERT INTO  obras_InformacionBasica (
              idObra ,
              fechaInicio ,
              fechaFinalizacion ,
              Contratista ,
              idTipoObra ,
              Estado ,
              Alcances ,
              Direccion,
              Vigilante ,
              Observaciones,
              idResponsable
            )
            VALUES 
            (
            '" . $idObra . "', 
            '" . $datos->FechaIni . "', 
            '" . $datos->FechaFin . "', 
            '" . $datos->Contratista . "', 
            '" . $datos->Tipo . "', 
            '" . $datos->Estado . "', 
            '" . $datos->Alcances . "',
            '" . $datos->Direccion . "',
            '" . $datos->Vigilante . "', 
            '" . $datos->Comentarios . "',
            '" . $Usuario . "')
          ON DUPLICATE KEY UPDATE
            fechaInicio = VALUES(fechaInicio ),
            fechaFinalizacion = VALUES(fechaFinalizacion ),
            Contratista = VALUES(Contratista ),
            idTipoObra = VALUES(idTipoObra ),
            Estado = VALUES(Estado ),
            Alcances = VALUES(Alcances ),
            Direccion= VALUES(Direccion),
            Vigilante = VALUES(Vigilante ),
            Observaciones= VALUES(Observaciones),
            idResponsable= VALUES(idResponsable);";

  $result = $link->query(utf8_decode($sql));

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } else
  {
     echo "";
  }

  $values = "";
  $sql = "DELETE FROM obras_Contactos WHERE idObra = '$idObra'";
  $result = $link->query(utf8_decode($sql));

  foreach ($contactos as $key => $value) 
  {
    $values .= "('" . $idObra . "', '" . $value->Nombre . "', '" . $value->Correo . "', '" . $value->Cargo . "', '" . $value->Empresa . "'), ";
  }
  if ($values <> "")
  { 
    $values = utf8_decode(substr($values, 0, -2));

    $sql = "INSERT INTO obras_Contactos (idObra, Nombre, Correo, cargo, Empresa) VALUES $values 
          ON DUPLICATE KEY UPDATE 
            Nombre = VALUES(Nombre),
            cargo = VALUES(cargo),
            Empresa = VALUES(Empresa);";
            
    $result = $link->query(utf8_decode($sql));

  } 
?>