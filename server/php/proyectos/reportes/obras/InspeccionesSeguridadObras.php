<?php
  include("../../../conectar.php"); 
  include("../../datosUsuario.php"); 
   
   $link = Conectar();

   /*
   $Usuario = addslashes($_POST['Usuario']);
   $fechaIni = addslashes($_POST['fechaIni']);
   $fechaFin = addslashes($_POST['fechaFin']);
   */
  
  $Usuario = 2;
   $fechaIni = "";
   $fechaFin = "";
   
   $dUsuario = datosUsuario($Usuario);

   $arrWhere = array();
   $where = "";

   if ($dUsuario->Zonas <> "")
   {
      $arrWhere[] = " obras.idDelegacion IN (" . $dUsuario->Zonas . ") ";
   }

   if ($fechaIni <> "")
   {
      $arrWhere[] = " obras_InformacionBasica.fechaInicio >= '$fechaIni 00:00:00'";
   }

   if ($fechaFin <> "")
   {
      $arrWhere[] = " obras_InformacionBasica.fechaInicio <= '$fechaFin 23:59:59'";
   }

   foreach ($arrWhere as $key => $value) 
   {
      $where .= $value . " AND";
   }

   $where = substr($where, 0, -3);

   if ($where <> "")
   {
      $where = " AND " . $where;
   }

   $sql = "SELECT DISTINCT 
             delegaciones.Nombre AS Delegacion,
             confTiposObra.nombre AS TipoObra,
             resultadoauditoria.idObra AS idObra,
             obras_InformacionBasica.Vigilante AS Vigilante,
             resultadoauditoria.Criterio AS Criterio,
             resultadoauditoria.Resultado AS Resultado,
             msc_Resultado.Clasificacion AS Clasificacion,
             confPuntosControl_Subgrupos.tipoDefecto AS tipoDefecto,
             count(resultadoauditoria.idObra) AS Cantidad
         FROM
            msc
             INNER JOIN obras on msc.idObra = obras.idObra
            INNER JOIN delegaciones on delegaciones.idDelegacion = obras.idDelegacion
            INNER JOIN obras_InformacionBasica on msc.idObra = obras_InformacionBasica.idObra
            INNER JOIN confTiposObra on confTiposObra.idTipoObra = obras_InformacionBasica.idTipoObra
            INNER JOIN resultadoauditoria on resultadoauditoria.idObra = msc.idObra
            INNER JOIN confPuntosControl_Subgrupos on resultadoauditoria.Criterio = convert(confPuntosControl_Subgrupos.Criterio USING utf8) 
                                       AND resultadoauditoria.codigoNC = convert(confPuntosControl_Subgrupos.codigo USING utf8)
            LEFT JOIN msc_Resultado on msc_Resultado.idObra = resultadoauditoria.idObra 
                                       AND resultadoauditoria.Criterio = convert(msc_Resultado.Criterio USING utf8)
                                       AND resultadoauditoria.codigoPoste = convert(msc_Resultado.codigoPoste USING utf8)
                                       AND convert(msc_Resultado.codigoNC USING utf8) = resultadoauditoria.codigoNC
         WHERE
            obras.idObra > 0
            AND (resultadoauditoria.Criterio LIKE 'Seguridad' OR resultadoauditoria.Criterio LIKE 'General')
            $where 
         GROUP BY delegaciones.Nombre,
                  obras.tipoObra,
                  resultadoauditoria.idObra,
                  obras_InformacionBasica.Vigilante,
                  resultadoauditoria.Criterio,
                  resultadoauditoria.Resultado,
                  msc_Resultado.Clasificacion,
                  confPuntosControl_Subgrupos.tipoDefecto
         ORDER BY
            obras.idObra,
            resultadoauditoria.Resultado;";

            echo $sql . "<br><br>";
   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         if (!isset($Resultado[$row['idObra']]))
         {
            $Resultado[$row['idObra']] = array();
            $Resultado[$row['idObra']]['Cumple'] = 0;
            $Resultado[$row['idObra']]['T1'] = 0;
            $Resultado[$row['idObra']]['T2'] = 0;
         }

         if ($row['Clasificacion'] == 'No Conforme' OR $row['Clasificacion'] == "")
         {
            if ($row['tipoDefecto'] == "T1")
            {
               $Resultado[$row['idObra']]['T1'] = $Resultado[$row['idObra']]['T1'] + $row['Cantidad'];
            }
            elseif ($row['tipoDefecto'] == "T2")
            {
               $Resultado[$row['idObra']]['T2'] = $Resultado[$row['idObra']]['T2'] + $row['Cantidad'];
            }
            else
            {
               $Resultado[$row['idObra']]['Cumple'] = $Resultado[$row['idObra']]['Cumple'] + $row['Cantidad'];
            }
         } else
         {
            $Resultado[$row['idObra']]['Cumple'] = $Resultado[$row['idObra']]['Cumple'] + $row['Cantidad'];
         }
         
      }

      $Respuesta = array();

      $Respuesta['CantidadObras'] = 0;
      
      $Respuesta['CantidadApoyos'] = 0;
      $Respuesta['CantidadApoyosT1T2'] = 0;
      $Respuesta['CantidadApoyosT1'] = 0;

      $Respuesta['SinT1'] = 0;
      $Respuesta['SinT1T2'] = 0;

      $Respuesta['ConT1'] = 0;
      $Respuesta['ConT1T2'] = 0;

      $Respuesta['CanT1'] = 0;
      $Respuesta['CanT1T2'] = 0;

      foreach ($Resultado as $key => $value) 
      {
         $Respuesta['CantidadObras']++;
         $Respuesta['CantidadApoyos'] = $Respuesta['CantidadApoyos'] + $value['Cumple'] + $value['T1'] + $value['T2'];
         $Respuesta['CantidadApoyosT1T2'] = $Respuesta['CantidadApoyosT1T2'] + $value['T1'] + $value['T2'];
         $Respuesta['CantidadApoyosT1'] = $Respuesta['CantidadApoyosT1'] + $value['T1'];

         if ($value['T1'] == 0)
         {
            $Respuesta['SinT1']++;            
         } else
         {
            $Respuesta['ConT1']++;
            $Respuesta['CanT1'] = $Respuesta['ConT1'] + $value['T1'];
         }

         if ($value['T1'] == 0 AND $value['T2'] == 0)
         {
            $Respuesta['SinT1T2']++;            
         } else
         {
            //if ($value['T2'] > 0)
            //{
               $Respuesta['ConT1T2']++;
               $Respuesta['CanT1T2'] = $Respuesta['CanT1T2'] + $value['T2'] + $value['T1'];
            //}  
         }

         $idx++;
      }

      if ($Respuesta['ConT1'] > 0)
      {
         $Respuesta['PromedioDefectosT1'] = $Respuesta['CanT1']/$Respuesta['ConT1'];
      } else
      {
         $Respuesta['PromedioDefectosT1'] = 0;
      }

      if ($Respuesta['ConT1T2'] > 0)
      {
         $Respuesta['PromedioDefectosT1T2'] = $Respuesta['CanT1T2']/$Respuesta['ConT1T2'];
      } else
      {
         $Respuesta['PromedioDefectosT1T2'] = 0;
      }

      $Respuesta['PorcentajeObrasSinT1'] = ($Respuesta['SinT1'] * 100)/ $Respuesta['CantidadObras'];
      $Respuesta['PorcentajeObrasSinT1T2'] = ($Respuesta['SinT1T2'] * 100)/ $Respuesta['CantidadObras'];

      $Respuesta['PorcentajeObrasSinT1T2'] = ($Respuesta['SinT1T2'] * 100)/ $Respuesta['CantidadObras'];
      $Respuesta['PorcentajeObrasSinT1'] = ($Respuesta['CantidadApoyosT1T2'] * 100)/ $Respuesta['CantidadApoyos'];

         
      mysqli_free_result($result);  
      echo json_encode($Respuesta);
   } else
   {
      echo 0;
   }
?>