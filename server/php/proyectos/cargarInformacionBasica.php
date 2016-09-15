<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idObra = addslashes($_POST['idObra']);
   

   $sql = "SELECT 
               *
            FROM
               obras_InformacionBasica
            WHERE 
               idObra = '$idObra';";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         foreach ($row as $key => $value) 
         {
            $Resultado[$key] = utf8_encode($value);
         }
      }

      $sql = "SELECT 
               *
            FROM
               obras_Contactos
            WHERE 
               idObra = '$idObra';";

      $result = $link->query($sql);
      
      $Resultado['Contactos'] = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado['Contactos'][$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado['Contactos'][$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }

      $result = $link->query($sql);
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>