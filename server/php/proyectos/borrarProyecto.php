<?php
   include("../conectar.php"); 
   $link = Conectar();

   $idProyecto = addslashes($_POST['idObra']);

  $sql = "DELETE FROM obras WHERE idObra = '$idProyecto'";

  $result = $link->query($sql);

  if ( $link->affected_rows > 0)
  {
     echo 1;
  }  else
  {
  	echo $link->error;
  }
?>