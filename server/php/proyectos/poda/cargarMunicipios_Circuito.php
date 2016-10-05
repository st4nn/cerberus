<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $idCircuito = addslashes($_POST['idCircuito']);
   $Usuario = addslashes($_POST['Usuario']);

   $sql = "SELECT
               confMunicipios.id,
               confMunicipios.Nombre,
               poda_Circuitos.idMunicipio            
            FROM
               poda_Circuitos
               INNER JOIN sectores ON poda_Circuitos.idSector = sectores.idSector
               INNER JOIN  confMunicipios ON confMunicipios.idDepartamento = sectores.idDepartamento
            WHERE
               poda_Circuitos.idCircuito = '$idCircuito'
            ORDER BY
               confMunicipios.Nombre;";

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