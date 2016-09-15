<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idObra = $_POST['idObra'];
   $valor = $_POST['valor'];
   $sql = "SELECT    
               DISTINCT postes.*, 
               resultadoauditoria.Resultado 
            FROM 
               postes 
               LEFT JOIN resultadoauditoria 
                  ON resultadoauditoria.idObra = postes.idObra 
                  AND resultadoauditoria.codigoPoste = postes.Codigo 
            WHERE 
               postes.idObra = $idObra 
               AND postes.Auditar IN ($valor);";

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