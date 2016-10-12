<?php
  include("../../../conectar.php"); 
  include("../../datosUsuario.php"); 
   
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $fechaIni = addslashes($_POST['fechaIni']);
   $fechaFin = addslashes($_POST['fechaFin']);
   
   $dUsuario = datosUsuario($Usuario);

   $arrWhere = array();
   $arrWhere2 = array();

   $where = "";
   $where2 = "";

   if ($dUsuario->Zonas <> "")
   {
      $arrWhere[] = " delegaciones.idDelegacion IN (" . $dUsuario->Zonas . ") ";
      $arrWhere2[] = " delegaciones.idDelegacion IN (" . $dUsuario->Zonas . ") ";
   }

   if ($fechaIni <> "")
   {
      $arrWhere[] = " obras.mesInfoNum >= '" . substr($fechaIni, 0, 7) . "-01 00:00:00'";
      $arrWhere2[] = " obras_InformacionBasica.fechaInicio >= '$fechaIni 00:00:00'";
   }

   if ($fechaFin <> "")
   {
      $arrWhere[] = " obras.mesInfoNum <= '" . substr($fechaFin, 0, 7) . "-30 23:59:59'";
      $arrWhere2[] = " obras_InformacionBasica.fechaInicio <= '$fechaFin 23:59:59'";
   }

   foreach ($arrWhere as $key => $value) 
   {
      $where .= $value . " AND";
   }

   foreach ($arrWhere2 as $key => $value) 
   {
      $where2 .= $value . " AND";
   }

   $where = substr($where, 0, -3);
   $where2 = substr($where2, 0, -3);

   if ($where <> "")
   {
      $where = " WHERE " . $where;
   }

   if ($where2 <> "")
   {
      $where2 = " WHERE " . $where2;
   }

   $Meses = array();
    $Meses['ENERO'] = '01';
    $Meses['FEBRERO'] = '02';
    $Meses['MARZO'] = '03';
    $Meses['ABRIL'] = '04';
    $Meses['MAYO'] = '05';
    $Meses['JUNIO'] = '06';
    $Meses['JULIO'] = '07';
    $Meses['AGOSTO'] = '08';
    $Meses['SEPTIEMBRE'] = '09';
    $Meses['OCTUBRE'] = '10';
    $Meses['NOVIEMBRE'] = '11';
    $Meses['DICIEMBRE'] = '12';

   $sql = "SELECT Delegacion, mes, SUM(cantP) AS cantP, SUM(cantR) AS cantR FROM
            (
               SELECT delegaciones.Nombre AS Delegacion,
                      obras.mesInfo AS mes,
                      count(obras.idObra) AS cantP,
                      0 AS cantR
               FROM (obras
                     LEFT JOIN delegaciones on((delegaciones.idDelegacion = obras.idDelegacion)))
               $where
               GROUP BY delegaciones.Nombre,
                        obras.mesInfo
               UNION ALL
               SELECT delegaciones.Nombre AS Delegacion,
                      traducirMes(DATE_FORMAT(obras_InformacionBasica.fechaInicio, '%M')) AS mes,
                      0 AS cantP,
                      count(obras.idObra) AS cantR
               FROM obras
                    INNER JOIN msc on obras.idObra = msc.idObra
                    INNER JOIN obras_InformacionBasica ON obras.idObra = obras_InformacionBasica.idObra
                    LEFT JOIN delegaciones on delegaciones.idDelegacion = obras.idDelegacion
               $where2
               GROUP BY delegaciones.Nombre,
                        obras.mesInfo
            ) Datos GROUP BY Delegacion, mes";

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

         $Resultado[$idx]['mesNum'] = date('Y') . $Meses[$row['mes']];
         $idx++;
      }
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>