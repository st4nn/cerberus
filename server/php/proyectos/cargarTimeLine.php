<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idProyecto = $_POST['idProyecto'];

   $sql = "SELECT
            etapas.Nombre As 'Etapa',
            actividades.Nombre AS 'Actividad',
            hitos.Nombre AS 'Hito',
            DATE_FORMAT(estadoactividades.fecha, '%b %d, %Y') AS fecha,
            estadoactividades.valor
         FROM
            estadoactividades
            INNER JOIN etapas ON estadoactividades.idEtapa = etapas.idEtapa
            INNER JOIN actividades ON estadoactividades.idActividad = actividades.idActividad
            INNER JOIN hitos ON estadoactividades.idHito = hitos.idHito
         WHERE
            estadoactividades.idProyecto = $idProyecto
         ORDER BY
            estadoactividades.idEstadoActividad DESC";

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