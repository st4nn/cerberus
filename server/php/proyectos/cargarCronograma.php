<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idObra = $_POST['idObra'];
   $idObra = $_POST['Usuario'];

   
   $sql = "SELECT 
               obras.Nombre,
               obras_InformacionBasica.fechaInicio, 
                obras_InformacionBasica.fechaFinalizacion 
            FROM 
               obras_InformacionBasica
                INNER JOIN obras ON obras_InformacionBasica.idObra = obras.idObra";

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