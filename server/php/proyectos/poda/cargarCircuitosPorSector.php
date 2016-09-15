<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $idSector = addslashes($_POST['Sectores']);
   $sql = "SELECT * FROM poda_Circuitos WHERE idSector IN ($idSector) ORDER BY poda_Circuitos.Nombre";

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