<?php
   include("../../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = json_decode($_POST['datos']);
   $items = json_decode($_POST['items']);

  $sql = "INSERT INTO poda_Visitas (
            idOt, 
            Etapa,
            Prefijo, 
            Fecha, 
            TipoDeRed, 
            Ubicacion, 
            Subestacion, 
            Empresa, 
            Brigada, 
            Supervisor, 
            Descargo, 
            NombreBrigada, 
            HoraInicio, 
            HoraFin, 
            Observaciones, 
            Usuario
          ) VALUES (
            '" . addslashes($datos->idOt) . "', 
            '" . addslashes($datos->Etapa) . "', 
            '" . addslashes($datos->Prefijo) . "', 
            '" . addslashes($datos->Fecha) . "', 
            '" . addslashes($datos->TipoDeRed) . "', 
            '" . addslashes($datos->Ubicacion) . "', 
            '" . addslashes($datos->Subestacion) . "', 
            '" . addslashes($datos->Empresa) . "', 
            '" . addslashes($datos->Brigada) . "', 
            '" . addslashes($datos->Supervisor) . "', 
            '" . addslashes($datos->Descargo) . "', 
            '" . addslashes($datos->NombreBrigada) . "', 
            '" . addslashes($datos->HoraInicio) . "', 
            '" . addslashes($datos->HoraFin) . "', 
            '" . addslashes($datos->Observaciones) . "', 
            '" . addslashes($datos->Usuario) . "') 
          ON DUPLICATE KEY UPDATE 
            idOt = VALUES(idOt), 
            Etapa = VALUES(Etapa), 
            Prefijo = VALUES(Prefijo), 
            Fecha = VALUES(Fecha), 
            TipoDeRed = VALUES(TipoDeRed), 
            Ubicacion = VALUES(Ubicacion), 
            Subestacion = VALUES(Subestacion), 
            Empresa = VALUES(Empresa), 
            Brigada = VALUES(Brigada), 
            Supervisor = VALUES(Supervisor), 
            Descargo = VALUES(Descargo), 
            NombreBrigada = VALUES(NombreBrigada), 
            HoraInicio = VALUES(HoraInicio), 
            HoraFin = VALUES(HoraFin), 
            Observaciones = VALUES(Observaciones), 
            Usuario = VALUES(Usuario);";

  $result = $link->query(utf8_decode($sql));

  $nuevoId = $link->insert_id;

  if ($link->error <> "")
  {
    echo $link->error;
  } else
  {
    $values = "";
    foreach ($items as $key => $value) 
    {
        $values .= "('" . addslashes($datos->idOt) . "', '" . addslashes($datos->Prefijo) . "', '" . $key . "', '" . addslashes($value->Resultado) . "', '" . addslashes($value->Observaciones) . "', '" . addslashes($datos->Usuario) . "'), ";
    }

    if ($values <> "")
    {
        $values = substr($values, 0, -2);
        $sql = "INSERT INTO 
                  poda_Resultado (idOt, Prefijo, idPuntoControl, Resultado, Observaciones, Usuario) 
                VALUES $values
                ON DUPLICATE KEY UPDATE 
                    Prefijo = VALUES(Prefijo),
                    idPuntoControl = VALUES(idPuntoControl),
                    Resultado = VALUES(Resultado),
                    Observaciones = VALUES(Observaciones),
                    Usuario = VALUES(Usuario),
                    fechaCargue = CURRENT_TIMESTAMP;";

        $result = $link->query(utf8_decode($sql));
    }
  }

?>