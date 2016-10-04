<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $idArbol = addslashes($_POST['idArbol']);

   $sql = "SELECT
            poda_CapaForestal.*
         FROM 
            poda_CapaForestal
         WHERE 
            poda_CapaForestal.idArbol = '$idArbol'
         GROUP BY
            poda_CapaForestal.idArbol";

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