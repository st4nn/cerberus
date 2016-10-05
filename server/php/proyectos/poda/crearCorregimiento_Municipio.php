<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $idMunicipio = addslashes($_POST['idMunicipio']);
   
   $sql = "UPDATE poda_Circuitos SET idMunicipio = '$idMunicipio' WHERE idCircuito = '$idCircuito';";

   $result = $link->query($sql);

   echo 1;
?>