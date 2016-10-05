<?php
   include("../../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = json_decode($_POST['datos']);

   $Usuario = addslashes($_POST['Usuario']);
   $Circuito = addslashes($_POST['idCircuito']);

   if ($datos->idArbol == "" OR $datos->idArbol == 0)
   {
    $idArbol = 'null';
   } else
   {
    $idArbol = $datos->idArbol;
   }

   $fecha = date("Ymd");

  $sql = "INSERT INTO poda_CapaForestal(
            idArbol, 
            idCircuito, 
            fecha_levanta, 
            correg, 
            matricula, 
            nombre_comun, 
            especie, 
            familia, 
            ubicacion, 
            longitud, 
            latitud, 
            diametro_ap, 
            diametro_copa, 
            altura, 
            estado_fisico, 
            estado_fito, 
            tratmiento, 
            nivel_afectacion, 
            tension, 
            Observacion, 
            usuarioCargue)
          VALUES (
            " . $idArbol . ", 
            '" . addslashes($Circuito) . "', 
            '" . addslashes($fecha) . "', 
            '" . addslashes($datos->Corregimiento) . "', 
            '" . addslashes($datos->Matricula) . "', 
            '" . addslashes($datos->NombreComun) . "', 
            '" . addslashes($datos->Especie) . "', 
            '" . addslashes($datos->Familia) . "', 
            '" . addslashes($datos->Ubicacion) . "', 
            '" . addslashes($datos->Longitud) . "', 
            '" . addslashes($datos->Latitud) . "', 
            '" . addslashes($datos->circunf_cap) . "', 
            '" . addslashes($datos->DiametroCopa) . "', 
            '" . addslashes($datos->Altura) . "', 
            '" . addslashes($datos->EstadoFisico) . "', 
            '" . addslashes($datos->EstadoFito) . "', 
            '" . addslashes($datos->Tratamiento) . "', 
            '" . addslashes($datos->NivelAfectacion) . "', 
            '" . addslashes($datos->Tension) . "', 
            '" . addslashes($datos->Observaciones) . "', 
            '" . addslashes($Usuario) . "')
          ON DUPLICATE KEY UPDATE 
            cod_Cto = VALUES(cod_Cto), 
            correg = VALUES(correg), 
            matricula = VALUES(matricula), 
            nombre_comun = VALUES(nombre_comun), 
            especie = VALUES(especie), 
            familia = VALUES(familia), 
            ubicacion = VALUES(ubicacion), 
            longitud = VALUES(longitud), 
            latitud = VALUES(latitud), 
            diametro_ap = VALUES(diametro_ap), 
            diametro_copa = VALUES(diametro_copa), 
            altura = VALUES(altura), 
            estado_fisico = VALUES(estado_fisico), 
            estado_fito = VALUES(estado_fito), 
            tratmiento = VALUES(tratmiento), 
            nivel_afectacion = VALUES(nivel_afectacion), 
            tension = VALUES(tension), 
            Observacion = VALUES(Observacion), 
            usuarioCargue = VALUES(usuarioCargue);";

  $result = $link->query(utf8_decode($sql));

  $nuevoId = $link->insert_id;

  if ($link->error <> "")
  {
    $link->error;
  } else
  {
    echo $nuevoId;
  }

?>