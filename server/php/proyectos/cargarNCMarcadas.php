<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idObra = $_POST['idObra'];
   $idPoste = $_POST['idPoste'];
   $sql = "SELECT
               resultadoauditoria.*,
               confPuntosControl_Subgrupos.Descripcion
            FROM
               resultadoauditoria
               INNER JOIN confPuntosControl_Subgrupos ON resultadoauditoria.codigoNC = confPuntosControl_Subgrupos.Codigo AND resultadoauditoria.Criterio = confPuntosControl_Subgrupos.Criterio
            WHERE
               idObra = $idObra
               AND codigoPoste = '$idPoste'";

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