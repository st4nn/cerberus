<?php
   include("../conectar.php"); 
   $link = Conectar();

   $idImagen = addslashes($_POST['idSQL']);

      
  $sql = "DELETE FROM obras_Auditoria_Soportes WHERE id = '$idImagen'";

  $result = $link->query($sql);

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } 
?>