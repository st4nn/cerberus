<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idObra = $_POST['idObra'];
   $codigoPoste = $_POST['codigoPoste'];
   $codigoNC = $_POST['codigoNC'];
   $Criterio = $_POST['Criterio'] ;

   if ($codigoNC == 0)
   {
      $codigoNC = "";
   } else
   {
      $codigoNC = "AND soportes.codigoNC = '"  . $codigoNC . "' AND soportes.Criterio = '$Criterio' ";
   }
   
   $sql = "SELECT
               soportes.idObra, 
               soportes.codigoPoste, 
               soportes.Criterio, 
               soportes.codigoNC, 
               soportes.foto, 
               soportes.observaciones, 
               soportes.coordenadas, 
               soportes.fechaCargue,
               msc_Resultado.Clasificacion,
               msc_Resultado.justificacion,
               msc_Resultado.justificacionClasificacion
            FROM
               soportes
               LEFT JOIN msc_Resultado
                ON msc_Resultado.idObra = soportes.idObra 
                AND msc_Resultado.codigoPoste = soportes.codigoPoste 
                AND msc_Resultado.Criterio = soportes.Criterio 
                AND msc_Resultado.codigoNC = soportes.codigoNC
            WHERE
               soportes.idObra = $idObra
               AND soportes.codigoPoste = '" . $codigoPoste ."'
               $codigoNC;";

   if ($codigoNC == "")
   {
      $sql = "SELECT
               obras_Auditoria_Soportes.idObra AS idObra,
               obras_Auditoria_Soportes.codigo AS codigoPoste,
               'General' AS Criterio,
               0 AS CodigoNC,
               obras_Auditoria_Soportes.nomArchivo AS foto,
               '' AS observaciones,
               obras_Auditoria_Soportes.coordenadas AS coordenadas,
               obras_Auditoria_Soportes.fechaCargue AS fechaCargue,
               msc_Resultado.Clasificacion,
               msc_Resultado.justificacion,
               msc_Resultado.justificacionClasificacion
            FROM
               obras_Auditoria_Soportes
               LEFT JOIN msc_Resultado
                   ON msc_Resultado.idObra = obras_Auditoria_Soportes.idObra 
                   AND msc_Resultado.codigoPoste = obras_Auditoria_Soportes.codigo 
            WHERE
               obras_Auditoria_Soportes.idObra = $idObra
               AND obras_Auditoria_Soportes.codigo = '" . $codigoPoste ."'";
   }

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
            if ($key == "coordenadas")
            {
               $url = "http://maps.google.com/maps/api/geocode/json?sensor=false&address=" . $value;

               $page = json_decode(file_get_contents($url));

               $obj = $page->{"results"};
              
               $Direccion = explode(",", $obj[0]->{"formatted_address"});
               $Resultado[$idx]['Direccion'] = utf8_decode($Direccion[0]);
            }
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
