<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idObra = addslashes($_POST['idObra']);
   

   $sql = "SELECT 
               *
            FROM
               msc
            WHERE 
               idObra = '$idObra';";

   $result = $link->query($sql);

   $idx = 0;
   $Resultado = array();
      
   if ( $result->num_rows > 0)
   {
      $Resultado['datos'] = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         foreach ($row as $key => $value) 
         {
            $Resultado['datos'][$key] = utf8_encode($value);
         }
      }
   } else
   {
      $Resultado['datos'] = 0;
   }

   $sql = "SELECT 
            *
         FROM
            obras_Contactos
         WHERE 
            idObra = '$idObra';";

   $result = $link->query($sql);

   if ( $result->num_rows > 0)
   {
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

   } else
   {
      $Resultado['Contactos'] = 0;    
   }
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   
?>