<?php
   include("../conectar.php"); 
   $link = Conectar();

   $idObra = addslashes($_POST['idObra']);
   $Codigo = addslashes($_POST['Codigo']);

  $sql = "DELETE FROM postes WHERE Codigo = '$Codigo' AND idObra = '$idObra';";

  $result = $link->query($sql);

  if ( $link->affected_rows > 0)
  {
     echo 1;
  }  else
  {
  	echo $link->error;
  }
?>