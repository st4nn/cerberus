<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $idMunicipio = addslashes($_POST['idMunicipio']);
   $idCircuito = addslashes($_POST['idCircuito']);
   
   $sql = "UPDATE poda_Circuitos SET idMunicipio = '$idMunicipio' WHERE idCircuito = '$idCircuito';";

   $result = $link->query($sql);

   echo 1;
?>