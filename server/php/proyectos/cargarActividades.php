<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idEtapa = $_POST['Etapa'];
   $idProyecto = $_POST['idProyecto'];
   $sql = "SELECT
               actividades.idActividad,
               actividades.Nombre,
               actividades.idHito,
               estadoactividades.idEstado,
               estadoactividades.fecha,
               estadoactividades.valor
            FROM
               actividades
               LEFT JOIN estadoactividades ON actividades.idActividad = estadoactividades.idEstadoActividad
            WHERE
               actividades.idEtapa = $idEtapa
               AND (estadoactividades.idProyecto = $idProyecto OR estadoactividades.idProyecto IS NULL)
               AND (actividades.idProyecto = $idProyecto OR actividades.idProyecto = 0)";

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