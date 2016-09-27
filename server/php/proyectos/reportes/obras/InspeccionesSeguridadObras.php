<?php
  include("../../../conectar.php"); 
   $link = Conectar();

   $sql = "SELECT * FROM (
               SELECT
                     1 AS id,    
                     'Cantidad de Obras Inspeccionadas' AS Concepto,
                     Mes,
                     SUM(Cantidad) AS cantidadInspeccionadas
                  FROM 
                     rep_InspeccionesEnObras
                  WHERE Criterio = 'Seguridad' OR Criterio = 'General'
                  GROUP BY Mes
               UNION ALL
                  SELECT 
                        2 AS id,
                        'Cantidad Obras sin defectos T1' AS Concepto,
                        Mes,
                        SUM(Cantidad) AS cantidadSinT1
                     FROM 
                        rep_InspeccionesEnObras
                     WHERE (Criterio = 'Seguridad' OR Criterio = 'General') AND tipoDefecto = 'T1'
                     GROUP BY Mes
               Union ALL
                  SELECT 
                        3 AS id,
                        'Cantidad Obras sin defectos (T1+T2)' AS Concepto,
                        Mes,
                        SUM(Cantidad) AS cantidadT1T2
                     FROM 
                        rep_InspeccionesEnObras
                     WHERE (Criterio = 'Seguridad' OR Criterio = 'General') AND tipoDefecto IS NULL
                     GROUP BY Mes
                  ) AS Datos 
               ORDER BY Mes, id;";

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