<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idProyecto = $_POST['idProyecto'];
   
   $sql = "SELECT 
            etapas.idEtapa,
            COUNT(actividades.idActividad) AS 'Cantidad',
            'Totales' AS 'Concepto'
         FROM 
            etapas 
            LEFT JOIN actividades 
               ON etapas.idEtapa = actividades.idEtapa 
         WHERE 
            actividades.idProyecto = $idProyecto
            OR actividades.idProyecto = 0 
            OR actividades.idProyecto IS NULL
         GROUP BY 
            etapas.idEtapa
         UNION ALL
         SELECT 
            etapas.idEtapa,
            COUNT(estadoactividades.idEstadoActividad) AS 'Cantidad',
            'Realizadas' AS 'Concepto'
         FROM 
            etapas 
            LEFT JOIN estadoactividades 
               ON etapas.idEtapa = estadoactividades.idEtapa 
         WHERE 
            (estadoactividades.idProyecto = $idProyecto AND idEstado = 5)
            OR estadoactividades.idProyecto IS NULL
         GROUP BY 
            etapas.idEtapa;";

   $result = $link->query($sql);

   $Resultado = array();
   $Resultado['Totales'] = array();
   $Resultado['Realizadas'] = array();

   if ( $result->num_rows > 0)
   {
      while ($row = mysqli_fetch_assoc($result))
      {
            $Resultado[$row['Concepto']]['e' . $row['idEtapa']] = utf8_encode($row['Cantidad']);
      }
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>