<?php
   include("../conectar.php"); 
   $link = Conectar();

   $id = addslashes($_POST['id']);
   $Usuario = addslashes($_POST['Usuario']);
      
  $sql = "DELETE FROM msc_Compromisos WHERE id = '$id'";

  $result = $link->query($sql);

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } 
?>