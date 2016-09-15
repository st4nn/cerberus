<?php
  include("../conectar.php"); 
   $link = Conectar();

   $id = addslashes($_POST['id']);
   $codigo = addslashes($_POST['codigo']);
   $Descripcion = addslashes($_POST['Descripcion']);
   $Criterio = addslashes($_POST['Criterio']);
   $codigoPadre = addslashes($_POST['codigoPadre']);
   $nivel = addslashes($_POST['nivel']);

   $idObra = addslashes($_POST['idObra']);
   $codigoPoste = addslashes($_POST['codigoPoste']);
   
   if ($nivel == "1")
   {
      $sql = "SELECT * FROM confPuntosControl_Grupos WHERE Criterio LIKE '$Criterio'";
   } else
   {
      $Condicion = "";

      if ($id <> "")
      {
         $Condicion .= "AND confPuntosControl_Subgrupos.id = '$id' ";
      }

      if ($codigo <> "")
      {
         $Condicion .= "AND confPuntosControl_Subgrupos.codigo = '$codigo' ";
      }

      if ($Descripcion <> "")
      {
         $Condicion .= "AND confPuntosControl_Subgrupos.Descripcion LIKE '%$Descripcion%' ";
      }

      if ($Criterio <> "")
      {
         $Condicion .= "AND confPuntosControl_Subgrupos.Criterio = '$Criterio' ";
      }

      if ($codigoPadre <> "")
      {
         $Condicion .= "AND confPuntosControl_Subgrupos.codigoPadre = '$codigoPadre' ";
      }

      $Condicion = substr($Condicion, 3);

      $sql = "SELECT 
                  confPuntosControl_Subgrupos.*,
                  resultadoauditoria.Resultado
               FROM 
                  confPuntosControl_Subgrupos 
                   LEFT JOIN resultadoauditoria ON resultadoauditoria.codigoNC = confPuntosControl_Subgrupos.Codigo AND resultadoauditoria.idObra = '$idObra' AND resultadoauditoria.codigoPoste = '$codigoPoste' AND resultadoauditoria.Criterio = confPuntosControl_Subgrupos.Criterio
               WHERE 
                  $Condicion
               ORDER BY id";
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