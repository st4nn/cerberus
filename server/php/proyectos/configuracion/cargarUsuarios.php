<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $Usuario = datosUsuario($idUsuario);

   /*$Perfil = "";

   if ($Usuario['idPerfil'] <> 1)
   {
      $Perfil = " WHERE confEmpresas.id = '" . $Usuario['idEmpresa'] . "' ";
   }*/

   $sql = "SELECT 
               Login.idLogin,
               Login.Usuario,
               Login.Estado,
               DatosUsuarios.idEmpresa,
               DatosUsuarios.Nombre,
               DatosUsuarios.Correo,
               Login.idPerfil,
               perfiles.Nombre AS Perfil,
               group_concat(distinct delegaciones.Nombre separator ', ') AS Zonas
            FROM 
               login AS Login
               INNER JOIN datosusuarios AS DatosUsuarios ON Login.idLogin = DatosUsuarios.idLogin
               INNER JOIN perfiles ON perfiles.idPerfil = Login.idPerfil
               INNER JOIN login_has_delegaciones ON login_has_delegaciones.idLogin = Login.idLogin
               INNER JOIN delegaciones ON delegaciones.idDelegacion = login_has_delegaciones.idDelegacion
            GROUP BY
              Login.idLogin;";

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