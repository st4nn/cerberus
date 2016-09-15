<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $idCircuito = addslashes($_POST['idCircuito']);
   $fecha = addslashes($_POST['fecha']);
   $idOT  = addslashes($_POST['idOT']);
   $idVisita  = addslashes($_POST['idVisita']);

   if ($idVisita <> 0)
   {
      $idVisita = "AND poda_OT_Programacion.idEstado > 1";
   } else
   {
      $idVisita = "";
   }

   if ($idOT <> 0)
   {
      $idOT = "AND poda_OT.idOT = '$idOT'";
   } else
   {
      $idOT = "";
   }

   if ($fecha <> 0)
   {
      $fecha = "AND poda_CapaForestal.fecha_levanta = '$fecha'";
   } else
   {
      $fecha = "";
   }
   
   $sql = "SELECT
            poda_CapaForestal.idArbol, 
            poda_CapaForestal.fecha_levanta, 
            poda_CapaForestal.matricula,
            poda_CapaForestal.nombre_comun,
            poda_CapaForestal.especie,
            poda_CapaForestal.familia,
            poda_CapaForestal.longitud,
            poda_CapaForestal.latitud,
            poda_CapaForestal.diametro_ap,
            poda_CapaForestal.diametro_copa,
            poda_CapaForestal.altura,
            poda_CapaForestal.estado_fisico,
            poda_CapaForestal.estado_fito,
            poda_CapaForestal.tratmiento,
            poda_CapaForestal.nivel_afectacion,
            poda_CapaForestal.tension,
            poda_OT_Programacion.idEstado
         FROM 
            poda_CapaForestal
            LEFT JOIN poda_OT_Programacion ON poda_CapaForestal.idArbol = poda_OT_Programacion.idArbol 
            LEFT JOIN poda_OT ON poda_OT_Programacion.idOT = poda_OT.idOT $idOT
         WHERE 
            poda_CapaForestal.idCircuito = '$idCircuito' $fecha $idVisita";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado[$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado[$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>