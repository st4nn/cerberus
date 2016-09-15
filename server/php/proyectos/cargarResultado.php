<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idObra = $_POST['idObra'];
   
   $sql = "SELECT
               resultadoauditoria.Criterio AS 'Criterio',
               resultadoauditoria.codigoNC AS 'Codigo',
               confPuntosControl_Subgrupos.Descripcion,
               COUNT(*) AS Cantidad
            FROM
               resultadoauditoria 
               INNER JOIN confPuntosControl_Subgrupos ON (resultadoauditoria.codigoNC = confPuntosControl_Subgrupos.Codigo AND resultadoauditoria.Criterio = confPuntosControl_Subgrupos.Criterio)
            WHERE
               resultadoauditoria.idObra = $idObra
            GROUP BY
               resultadoauditoria.Criterio,
               resultadoauditoria.codigoNC,
               confPuntosControl_Subgrupos.Descripcion 
            ORDER BY
               resultadoauditoria.codigoNC";

   $result = $link->query($sql);

   $sql = "SELECT COUNT(DISTINCT codigoPoste) AS Cantidad FROM resultadoauditoria WHERE resultadoauditoria.idObra = $idObra;";

   $result2 = $link->query($sql);
   $fila =  $result2->fetch_array(MYSQLI_ASSOC);

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
      $Resultado['ItemsRevisados'] = $fila['Cantidad'];

         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>