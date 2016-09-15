<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idProyecto = $_POST['idProyecto'];
   $sql = "SELECT * FROM proyectos WHERE idProyecto = $idProyecto ORDER BY idHito";

   $result = $link->query($sql);

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
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>