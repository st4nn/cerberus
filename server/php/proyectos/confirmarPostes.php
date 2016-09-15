<?php
   include("../conectar.php"); 
   $link = Conectar();

      $datos = $_POST['datos'];
      $idObra = $_POST['idObra'];

      $postes = "";
      foreach ($datos as $key => $value) 
      {
          $postes .= "'" . trim($value) . "', ";
      }
      $postes = substr($postes, 0, -2);            

      $sql = "UPDATE postes SET Auditar = 0 WHERE idObra = $idObra";
      $result = $link->query($sql);
      $sql = "UPDATE postes SET Auditar = 1 WHERE idObra = $idObra AND Codigo IN (" . $postes . ")";
      $result = $link->query($sql);

      echo 1;
?>