<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $idObra = addslashes($_POST['idObra']);
   $codigoPoste = addslashes($_POST['idPoste']);
   $campos = addslashes($_POST['campos']);
   $coordenadas = addslashes($_POST['Coordenadas']);

   if ($campos == "")
   {
    $campos = 0;
   }

   $campos = explode(",", $campos);

   $values = "";
   $tmpCumplimiento = "";
   foreach ($campos as $key => $value) 
   {
     if ($value <> "")
     {
        $arrCampo = explode("#", $value);
        $valor = $arrCampo[0];
        if ($valor == 0)
        {
          $tmpCumplimiento = "Cumple";
          $arrCampo[1] = "General";
        } else
        {
          $tmpCumplimiento = "No Cumple";
        }
      $values .= "($idObra, '" . $codigoPoste . "', '" . $arrCampo[1] . "', '" . $valor . "', '" .  $tmpCumplimiento . "', '" . $coordenadas . "'), ";
     }
   }

   if ($values <> "")
   {
      $sql = "DELETE FROM resultadoauditoria WHERE idObra = $idObra AND codigoPoste = '" . $codigoPoste . "'";
      $result = $link->query($sql);
      $values = substr($values, 0, -2);
      $sql = "INSERT INTO resultadoauditoria (idObra, codigoPoste, Criterio, codigoNC, Resultado, coordenadas) VALUES " . $values . ";";
      $result = $link->query($sql);

        $result = $link->query($sql);

      if ( $link->affected_rows > 0)
      {
         echo 1;
      } else
      {
         echo 0;
      }
   }
?>