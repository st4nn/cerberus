<?php
   include("../../conectar.php"); 
   include("../../../../assets/mensajes/enviarCorreo.php");  
   include("../datosUsuario.php"); 

   $link = Conectar();

   $datos = json_decode($_POST['datos']);

   $idUsuario = addslashes($datos->id);
   $ridUsuario = addslashes($datos->Usuario);
   $Clave = addslashes($datos->Clave);
   
   $rUsuario = datosUsuario($idUsuario);
   $Usuario = datosUsuario($ridUsuario);
   

   $Usuario->Nombre;

   $sql = "UPDATE login SET Clave = '" . md5(md5(md5($Clave))) . "' WHERE idLogin = '" . $idUsuario . "';";
   $link->query(utf8_decode($sql));
   if ( $link->affected_rows > 0)
   {
      $mensaje = "Buen Día, " . $Usuario->Nombre . "
      <br>" . $rUsuario->Nombre . " ha cambiado la clave de acceso del sistema Cerberus,
      <br><br>
      Los datos de autenticación son:
      <br><br>
      <br>Url de Acceso: http://cerberus.wspcolombia.com
      <br>Usuario: " . $Usuario->Usuario . "
      <br>Clave: $Clave";

      Correo("Cambio de Clave " . $Usuario->Nombre, $Usuario->Correo, $mensaje) ;
      echo 1;
   } else
   {
      echo 0;
   }
?>