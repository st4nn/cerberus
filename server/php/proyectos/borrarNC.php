<?php
   include("../conectar.php"); 
   $link = Conectar();

   $idObra = addslashes($_POST['idObra']);
   $codigoPoste = addslashes($_POST['codigoPoste']);
   $codigoNC = addslashes($_POST['codigoNC']);
   $Criterio = addslashes($_POST['Criterio']);
      
  $sql = "DELETE FROM resultadoauditoria WHERE 
			idObra = '$idObra' 
      AND Criterio = '$Criterio'
      AND codigoPoste = '$codigoPoste'
			AND codigoNC = '$codigoNC'";

  $result = $link->query($sql);

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } 
?>