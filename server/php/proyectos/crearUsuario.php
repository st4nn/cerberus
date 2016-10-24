<?php
   include("../conectar.php"); 
   include("../../../assets/mensajes/enviarCorreo.php");  
   $link = Conectar();

   $datos = json_decode($_POST['datos']);

   $nombre = addslashes($datos->nombre);
   $correo = addslashes($datos->correo);
   $cargo = addslashes($datos->cargo);
   $proceso = addslashes($datos->proceso);
   $perfil = addslashes($datos->perfil);
   $usuario = addslashes($datos->usuario);
   $clave = addslashes($datos->clave);
   $clave2 = addslashes($datos->clave2);
   $empresa = addslashes($datos->empresa);;
   $Zonas = addslashes($datos->Zonas);;
   
   $pClave = $datos->clave;

/*
   if (stripos($correo, "@wspgroup.com") == 0)
   {
      $correo = $correo . "@wspgroup.com";
   }
*/
   $correo = strtolower($correo);
   
 
   $sql = "SELECT COUNT(*) AS 'Cantidad' FROM login WHERE Usuario = '$usuario';";
   $result = $link->query($sql);

   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   if ($fila['Cantidad'] > 0)
   {
      echo "El Usuario ya existe, por favor selecciona otro.";
   } else
   {
      $sql = "SELECT COUNT(*) AS 'Cantidad' FROM datosusuarios WHERE Correo = '$correo';";
      $result = $link->query($sql);

      $fila =  $result->fetch_array(MYSQLI_ASSOC);

      if ($fila['Cantidad'] > 0)
      {
         echo "El Correo ya tiene un usuario asignado, por favor selecciona otro.";
      } else
      {
         if ($clave <> $clave2)
         {
            echo "Las claves no coinciden.";
         } else
         {
            $sql = "INSERT INTO login 
                        (Usuario, Clave, Estado, idPerfil) 
                     VALUES 
                        (
                           '$usuario', 
                           '" . md5(md5(md5($clave))) . "', 
                           'Activo',
                           '$perfil');";

            $link->query(utf8_decode($sql));
               if ( $link->affected_rows > 0)
               {
                  $nuevoId = $link->insert_id;
                  if ($nuevoId > 0)
                  {
                     
                     $sql = "INSERT INTO datosusuarios (idLogin, Nombre, Correo, Cargo, idEmpresa, idProceso) 
                              VALUES 
                              (
                                 '$nuevoId', 
                                 '$nombre', 
                                 '$correo',
                                 '$cargo',
                                 '$empresa',
                                 '$proceso');";
                        
                        $link->query(utf8_decode($sql));

                        echo $link->error . " " .$link->affected_rows;   

                        $arrZonas = explode(",", $Zonas);
                        $values = "";
                        foreach ($arrZonas as $key => $value) 
                        {
                           if ($value <> "")
                           {
                              $values .= "($nuevoId, $value), ";
                           }
                        }
                        $values = substr($values, 0, -2);

                        $sql = "INSERT INTO login_has_delegaciones (idLogin,  idDelegacion) VALUES " . $values . ";";
                        $link->query(utf8_decode($sql));
                        

                        $mensaje = "Buen Día, $nombre
                        <br>Se ha creado un usuario de acceso para el sistema Cerberus,
                        <br><br>
                        Los datos de autenticación son:
                        <br><br>
                        <br>Url de Acceso: http://cerberus.wspcolombia.com
                        <br>Usuario: $usuario
                        <br>Clave: $pClave";

                        Correo("Creación de Usuario " . $nombre, $correo, $mensaje) ;
                  } else
                  {
                     echo "Hubo un error desconocido " . $link->error;
                  }
               } else
               {
                  echo "Hubo un error desconocido" . $link->error;
               }
         }
      }
   }

?>