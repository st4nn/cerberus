<?php

   function datosUsuario($idUsuario)
   {
      $link = Conectar();
    
      $sql = "SELECT 
               Login.idLogin,
               Login.Usuario,
               Login.Estado,
               DatosUsuarios.idEmpresa,
               DatosUsuarios.Nombre,
               DatosUsuarios.Correo,
               DatosUsuarios.idProceso,
               Login.idPerfil,
               group_concat(distinct login_has_delegaciones.idDelegacion separator ', ') AS Zonas
            FROM 
               login AS Login
               INNER JOIN datosusuarios AS DatosUsuarios ON Login.idLogin = DatosUsuarios.idLogin
               INNER JOIN login_has_delegaciones ON login_has_delegaciones.idLogin = Login.idLogin
            WHERE 
               Login.idLogin = $idUsuario
            GROUP BY
               Login.idLogin";
      
      $result = $link->query($sql);

      if ( $result->num_rows > 0)
      {
         if(!class_exists('Usuario'))
         {
            class Usuario
            {
               public $idLogin;
               public $Usuario;
               public $idEmpresa;
               public $Nombre;
               public $Correo;
               public $idPerfil;
               public $idProceso;
               public $Estado;
               public $Zonas;
            }
         }
         
         $idx = 0;
            $Usuarios = new Usuario();
            while ($row = mysqli_fetch_assoc($result))
            { 
               if (is_array($Usuarios->Zonas) == false)
               {
                  $Usuarios->Zonas  = array();
               }
               
               $Usuarios->idLogin = utf8_encode($row['idLogin']);
               $Usuarios->Usuario = utf8_encode($row['Usuario']);
               $Usuarios->Nombre = utf8_encode($row['Nombre']);
               $Usuarios->idEmpresa = utf8_encode($row['idEmpresa']);
               $Usuarios->Correo = utf8_encode($row['Correo']);
               $Usuarios->idPerfil = utf8_encode($row['idPerfil']);
               $Usuarios->idProceso = utf8_encode($row['idProceso']);
               $Usuarios->Estado = utf8_encode($row['Estado']);
               $Usuarios->Zonas = utf8_encode($row['Zonas']);

               $idx++;
            }
            
               mysqli_free_result($result);  
               return $Usuarios;
      } else
      {
         echo 0;
      }
   }
?>