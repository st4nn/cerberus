<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $Usuario = datosUsuario($idUsuario);

   $Perfil = "";

   if ($Usuario->idProceso <> 1)
   {
      $Perfil = " WHERE confProcesos.id = '" . $Usuario->idProceso . "' ";
   }

   $sql = "SELECT    
                confProcesos.id AS id,
                confProcesos.Nombre
            FROM 
               confProcesos $Perfil;";

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