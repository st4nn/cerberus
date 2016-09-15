<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $Usuario = addslashes($_POST['Usuario']);
   $Elemento = addslashes($_POST['Elemento']);
   $Tipo = addslashes($_POST['Tipo']);
   $idProyecto = addslashes($_POST['idObra']);

   
   if ($idProyecto == "")
   {
    $idProyecto = 'null';
   } 
   
  $sql = "INSERT INTO postes (idObra, Codigo, Tipo, Auditar) 
         VALUES (
            $idProyecto, 
            '" . $Elemento . "', 
            '" . $Tipo. "', 
            '1')
          ON DUPLICATE KEY UPDATE
            Codigo = VALUES(Codigo),
            Auditar = VALUES(Auditar);";


  $result = $link->query(utf8_decode($sql));

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } else
  {
     echo 0;
  }
?>