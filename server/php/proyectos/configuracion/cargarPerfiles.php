<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $Usuario = datosUsuario($idUsuario);
   $Proceso = addslashes($_POST['Proceso']);

   $Perfil = "";

   if ($Usuario->idPerfil <> 1)
   {
      $Perfil = " WHERE perfiles.id >= '" . $Usuario->idPerfil . "' ";
   }

   if ($Usuario->idProceso <> 1)
   {
      if ($Perfil == "")
      {
        $Perfil = " WHERE perfiles.idProceso = '" . $Usuario->idProceso . "' ";
      } else
      {
        $Perfil .= " AND perfiles.idProceso = '" . $Usuario->idProceso . "' ";
      }
   } else
   {
      if ($Perfil == "")
      {
        $Perfil = " WHERE perfiles.idProceso = '" . $Proceso . "' ";
      } else
      {
        $Perfil .= " AND perfiles.idProceso = '" . $Proceso . "' ";
      }
   }

   $sql = "SELECT    
                perfiles.idPerfil AS id,
                perfiles.Nombre
            FROM 
               perfiles $Perfil;";

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