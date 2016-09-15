<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $idOT = addslashes($_POST['idOT']);
   $sql = "SELECT * FROM poda_VisitaPrevia WHERE idOT IN ($idOT) ORDER BY poda_VisitaPrevia.fechaCargue DESC";

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