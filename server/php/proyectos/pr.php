<?php

  include("../conectar.php"); 
  include("datosUsuario.php"); 
   $link = Conectar();

   $dUsuario = datosUsuario(5);

   echo $dUsuario->Zonas;
?>