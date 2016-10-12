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
      $arrWhere[] = " rep_InspeccionesPorDelegaciones.fechaInicio >= '$fechaIni 00:00:00'";
   }

   if ($fechaFin <> "")
   {
      $arrWhere[] = " rep_InspeccionesPorDelegaciones.fechaInicio <= '$fechaFin 23:59:59'";
   }

   foreach ($arrWhere as $key => $value) 
   {
      $where .= $value . " AND";
   }

   $where = substr($where, 0, -3);

   if ($where <> "")
   {
      $where = " WHERE " . $where;
   }

    $sql = "SELECT    
               rep_InspeccionesPorDelegaciones.*
            FROM 
               rep_InspeccionesPorDelegaciones
               INNER JOIN obras ON obras.idObra = rep_InspeccionesPorDelegaciones.idObra
            $where;";

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