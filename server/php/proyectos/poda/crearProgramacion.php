<?php
   include("../../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $Usuario = $_POST['Usuario'];
   $idOt = $_POST['idOt'];
   $Arboles = $_POST['Arboles'];

  $sql = "DELETE FROM poda_OT_Programacion WHERE idOT = '" . $idOt. "' AND idEstado < 3;";
  $result = $link->query($sql);

  $arrArboles = explode(", ", $Arboles);

  $values = "";
  foreach ($arrArboles as $key => $value) 
  {
    $value = str_replace("-", "", $value);
    if ($value <> "")
    {
      $values .= "('$idOt', '" .  $value . "', '$Usuario', 2), ";
    }
  }
  $values = substr($values, 0, -2);

  if ($values <> "")
  {
    $sql = "INSERT INTO poda_OT_Programacion(idOT, idArbol, idResponsable, idEstado) VALUES " . $values . " ON DUPLICATE KEY UPDATE idArbol = VALUES(idArbol);";
    $result = $link->query($sql);
    echo 1;
  } else
  {
    echo 1;
  }
  
?>