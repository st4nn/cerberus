<?php
   include("../../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = json_decode($_POST['datos']);

  $sql = "INSERT INTO poda_VisitaPrevia_Datos (
            Prefijo, 
            idOt, 
            idArbol, 
            Aviso, 
            Direccion, 
            TipoEspecie, 
            AnalisisTrabajoSeguro, 
            Comejen, 
            RamasPodridas, 
            Gusanos, 
            Abejas, 
            Correcto, 
            RedMT, 
            RedBT, 
            Transformador, 
            EquipManiobra, 
            PodaLigera, 
            PodaExhaustiva, 
            Tala, 
            Nido, 
            Cliente, 
            Tet, 
            Otros, 
            Observaciones, 
            Usuario
          ) VALUES (
            '" . addslashes($datos->NumeroInterno) . "', 
            '" . addslashes($datos->idOt) . "', 
            '" . addslashes($datos->idArbol) . "', 
            '" . addslashes($datos->Aviso) . "', 
            '" . addslashes($datos->Direccion) . "', 
            '" . addslashes($datos->TipoEspecie) . "', 
            '" . addslashes($datos->AnalisisTrabajoSeguro) . "', 
            '" . addslashes($datos->Comejen) . "', 
            '" . addslashes($datos->RamasPodridas) . "', 
            '" . addslashes($datos->Gusanos) . "', 
            '" . addslashes($datos->Abejas) . "', 
            '" . addslashes($datos->Correcto) . "', 
            '" . addslashes($datos->RedMT) . "', 
            '" . addslashes($datos->RedBT) . "', 
            '" . addslashes($datos->Transformador) . "', 
            '" . addslashes($datos->EquipManiobra) . "', 
            '" . addslashes($datos->PodaLigera) . "', 
            '" . addslashes($datos->PodaExhaustiva) . "', 
            '" . addslashes($datos->Tala) . "', 
            '" . addslashes($datos->Nido) . "', 
            '" . addslashes($datos->Cliente) . "', 
            '" . addslashes($datos->Tet) . "', 
            '" . addslashes($datos->Otros) . "', 
            '" . addslashes($datos->Observaciones) . "', 
            '" . addslashes($datos->Usuario) . "') 
          ON DUPLICATE KEY UPDATE 
            Prefijo = VALUES(Prefijo), 
            idOt = VALUES(idOt), 
            idArbol = VALUES(idArbol), 
            Aviso = VALUES(Aviso), 
            Direccion = VALUES(Direccion), 
            TipoEspecie = VALUES(TipoEspecie), 
            AnalisisTrabajoSeguro = VALUES(AnalisisTrabajoSeguro), 
            Comejen = VALUES(Comejen), 
            RamasPodridas = VALUES(RamasPodridas), 
            Gusanos = VALUES(Gusanos), 
            Abejas = VALUES(Abejas), 
            Correcto = VALUES(Correcto), 
            RedMT = VALUES(RedMT), 
            RedBT = VALUES(RedBT), 
            Transformador = VALUES(Transformador), 
            EquipManiobra = VALUES(EquipManiobra), 
            PodaLigera = VALUES(PodaLigera), 
            PodaExhaustiva = VALUES(PodaExhaustiva), 
            Tala = VALUES(Tala), 
            Nido = VALUES(Nido), 
            Cliente = VALUES(Cliente), 
            Tet = VALUES(Tet), 
            Otros = VALUES(Otros), 
            Observaciones = VALUES(Observaciones), 
            Usuario = VALUES(Usuario);";

  $result = $link->query(utf8_decode($sql));

  $nuevoId = $link->insert_id;

  if ($link->error <> "")
  {
    echo $link->error;
  } else
  {
    $sql = "INSERT INTO 
              poda_OT_Programacion (idOT, idArbol, idResponsable, idEstado) 
            VALUES 
              (
                '" . addslashes($datos->idOt) . "', 
                '" . addslashes($datos->idArbol) . "', 
                '" . addslashes($datos->Usuario) . "', 
                3
              )
            ON DUPLICATE KEY UPDATE 
              idEstado = VALUES(idEstado),
              idResponsable = VALUES(idResponsable);";

    $result = $link->query(utf8_decode($sql));

    echo $nuevoId;
  }

?>