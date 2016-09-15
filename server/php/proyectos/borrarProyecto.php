<?php
   include("../conectar.php"); 
   $link = Conectar();

   $idProyecto = json_decode($_POST['idProyecto']);

      
  $sql = "DELETE FROM Proyectos WHERE idProyecto = $idProyecto";

  $result = $link->query($sql);

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } 
?>