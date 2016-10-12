<?php
  include("../../../conectar.php"); 
  include("../../datosUsuario.php"); 
   
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $fechaIni = addslashes($_POST['fechaIni']);
   $fechaFin = addslashes($_POST['fechaFin']);
   
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

   $result = $link->query($sql);

$Respuesta[0] = array();
      $Respuesta[0]['Concepto'] = 'Cantidad de Obras Inspeccionadas';
   $Respuesta[1] = array();
      $Respuesta[1]['Concepto'] = 'Cantidad obras sin defectos T1';
   $Respuesta[2] = array();
      $Respuesta[2]['Concepto'] = 'Cantidad de obras sin defectos (T1+T2)';
   $Respuesta[3] = array();
      $Respuesta[3]['Concepto'] = 'Promedio Defectos (t1) por obra con defecto';
   $Respuesta[4] = array();
      $Respuesta[4]['Concepto'] = 'Promedio de Defectos por obra con defecto';
   $Respuesta[5] = array();
      $Respuesta[5]['Concepto'] = 'Porcentaje Obras sin Defectos T1';
   $Respuesta[6] = array();
      $Respuesta[6]['Concepto'] = 'Porcentaje Obras sin defectos (T1+T2)';

   $Respuesta[7] = array();
      $Respuesta[7]['Concepto'] = 'Cantidad Apoyos Inspeccionados';
   $Respuesta[8] = array();
      $Respuesta[8]['Concepto'] = 'Cantidad Apoyos con defectos';
   $Respuesta[9] = array();
      $Respuesta[9]['Concepto'] = 'Cantidad Defectos T1';
   $Respuesta[10] = array();
      $Respuesta[10]['Concepto'] = 'Cantidad Defectos (T1+T2)';
   $Respuesta[11] = array();
      $Respuesta[11]['Concepto'] = 'Porcentaje Apoyos con Defectos';

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

      $arrRespuesta = array();

      $arrRespuesta['CantidadObras'] = 0;
      
      $arrRespuesta['CantidadApoyos'] = 0;
      $arrRespuesta['CantidadApoyosT1T2'] = 0;
      $arrRespuesta['CantidadApoyosT1'] = 0;

      $arrRespuesta['SinT1'] = 0;
      $arrRespuesta['SinT1T2'] = 0;

      $arrRespuesta['ConT1'] = 0;
      $arrRespuesta['ConT1T2'] = 0;

      $arrRespuesta['CanT1'] = 0;
      $arrRespuesta['CanT1T2'] = 0;

      foreach ($Resultado as $key => $value) 
      {
         $arrRespuesta['CantidadObras']++;
         $arrRespuesta['CantidadApoyos'] = $arrRespuesta['CantidadApoyos'] + $value['Cumple'] + $value['T1'] + $value['T2'];
         $arrRespuesta['CantidadApoyosT1T2'] = $arrRespuesta['CantidadApoyosT1T2'] + $value['T1'] + $value['T2'];
         $arrRespuesta['CantidadApoyosT1'] = $arrRespuesta['CantidadApoyosT1'] + $value['T1'];

         if ($value['T1'] == 0)
         {
            $arrRespuesta['SinT1']++;            
         } else
         {
            $arrRespuesta['ConT1']++;
            $arrRespuesta['CanT1'] = $arrRespuesta['ConT1'] + $value['T1'];
         }

         if ($value['T1'] == 0 AND $value['T2'] == 0)
         {
            $arrRespuesta['SinT1T2']++;            
         } else
         {
            //if ($value['T2'] > 0)
            //{
               $arrRespuesta['ConT1T2']++;
               $arrRespuesta['CanT1T2'] = $arrRespuesta['CanT1T2'] + $value['T2'] + $value['T1'];
            //}  
         }

         $idx++;
      }

      if ($arrRespuesta['ConT1'] > 0)
      {
         $arrRespuesta['PromedioDefectosT1'] = $arrRespuesta['CanT1']/$arrRespuesta['ConT1'];
      } else
      {
         $arrRespuesta['PromedioDefectosT1'] = 0;
      }

      if ($arrRespuesta['ConT1T2'] > 0)
      {
         $arrRespuesta['PromedioDefectosT1T2'] = $arrRespuesta['CanT1T2']/$arrRespuesta['ConT1T2'];
      } else
      {
         $arrRespuesta['PromedioDefectosT1T2'] = 0;
      }

      $arrRespuesta['PorcentajeObrasSinT1'] = ($arrRespuesta['SinT1'] * 100)/ $arrRespuesta['CantidadObras'];
      $arrRespuesta['PorcentajeObrasSinT1T2'] = ($arrRespuesta['SinT1T2'] * 100)/ $arrRespuesta['CantidadObras'];

      $arrRespuesta['PorcentajeObrasSinT1T2'] = ($arrRespuesta['SinT1T2'] * 100)/ $arrRespuesta['CantidadObras'];
      $arrRespuesta['PorcentajeObrasSinT1'] = ($arrRespuesta['CantidadApoyosT1T2'] * 100)/ $arrRespuesta['CantidadApoyos'];

      $Respuesta[0]['Cantidad'] = $arrRespuesta['CantidadObras'];
      $Respuesta[1]['Cantidad'] = $arrRespuesta['SinT1'];
      $Respuesta[2]['Cantidad'] = $arrRespuesta['SinT1T2'];
      $Respuesta[3]['Cantidad'] = $arrRespuesta['PromedioDefectosT1'];
      $Respuesta[4]['Cantidad'] = $arrRespuesta['PromedioDefectosT1T2'];
      $Respuesta[5]['Cantidad'] = $arrRespuesta['PorcentajeObrasSinT1'] . "%";
      $Respuesta[6]['Cantidad'] = $arrRespuesta['PorcentajeObrasSinT1T2'] . "%";

      $Respuesta[7]['Cantidad'] = $arrRespuesta['CantidadApoyos'];
      $Respuesta[8]['Cantidad'] = $arrRespuesta['CantidadApoyosT1T2'];
      $Respuesta[9]['Cantidad'] = $arrRespuesta['CanT1'];
      $Respuesta[10]['Cantidad'] = $arrRespuesta['CanT1T2'];
      $Respuesta[11]['Cantidad'] = ($arrRespuesta['CantidadApoyosT1T2'] * 100)/$arrRespuesta['CantidadApoyos'];
         
      mysqli_free_result($result);  
   } else
   {
      $Respuesta[0]['Cantidad'] = 0;
      $Respuesta[1]['Cantidad'] = 0;
      $Respuesta[2]['Cantidad'] = 0;
      $Respuesta[3]['Cantidad'] = 0;
      $Respuesta[4]['Cantidad'] = 0;
      $Respuesta[5]['Cantidad'] = 0;
      $Respuesta[6]['Cantidad'] = 0;
      $Respuesta[7]['Cantidad'] = 0;
      $Respuesta[8]['Cantidad'] = 0;
      $Respuesta[9]['Cantidad'] = 0;
      $Respuesta[10]['Cantidad'] = 0;
      $Respuesta[11]['Cantidad'] = 0;
   }
   
   echo json_encode($Respuesta);
?>