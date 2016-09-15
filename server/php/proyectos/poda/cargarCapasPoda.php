<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $idCircuito = addslashes($_POST['idCircuito']);
   
   $sql = "SELECT 
            fecha_levanta, 
            count(*) as Cantidad  
         FROM 
            poda_CapaForestal
         WHERE 
            idCircuito = '$idCircuito'
         GROUP BY 
            fecha_levanta";

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