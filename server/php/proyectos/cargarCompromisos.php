<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idObra = addslashes($_POST['idObra']);
   $codigoPoste = addslashes($_POST['codigoPoste']);
   $codigoNC = addslashes($_POST['codigoNC']);
   $Criterio = addslashes($_POST['Criterio']);

   if ($codigoNC == 0 OR $codigoNC == "")
   {
      $codigoNC = "";
   } else
   {
      $codigoNC = " AND msc_Compromisos.codigoNC = '"  . $codigoNC . "' AND msc_Compromisos.Criterio = '$Criterio' ";
   }

   if ($codigoPoste == 0 OR $codigoPoste == "")
   {
      $codigoPoste = "";
   } else
   {
      $codigoPoste = " AND msc_Compromisos.codigoPoste = '"  . $codigoPoste . "' ";
   }

   if ($idObra == 0 OR $idObra == "")
   {
      $idObra = "";
   } else
   {
      $idObra = " AND msc_Compromisos.idObra = '"  . $idObra . "' ";
   }
   
   $sql = "SELECT
               *
            FROM
               msc_Compromisos
            WHERE
               msc_Compromisos.id > 0
               $idObra
               $codigoPoste
               $codigoNC;";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado[$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado[$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>
