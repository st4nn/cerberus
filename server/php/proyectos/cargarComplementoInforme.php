<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idObra = addslashes($_POST['idObra']);

   if ($idObra == 0 OR $idObra == "")
   {
      $idObra = "";
   } else
   {
      $idObra = " msc_CompInforme.idObra = '"  . $idObra . "' ";
   }
   
   $sql = "SELECT
               *
            FROM
               msc_CompInforme
            WHERE
               $idObra;";

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
