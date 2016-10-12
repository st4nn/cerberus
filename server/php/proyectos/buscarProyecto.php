<?php
  include("../conectar.php"); 
   include("datosUsuario.php"); 
   $link = Conectar();

   $Parametro = addslashes($_POST['Parametro']);
   $Fecha = addslashes($_POST['Fecha']);
   $Usuario = $_POST['Usuario'];

   $dUsuario = datosUsuario($Usuario);


   $Parametro = str_replace(" ", "%", $Parametro);
   /*
   $Parametro = $_POST['parametro'];
   */
   $Where = "";
   $Limit = "";

   if ($Fecha <> "")
   {
      $Fecha = " obras.fechaCargue >= '$Fecha 00:00:00' ";
   }

   if (trim($Parametro) <> "")
   {
      $Where = "  (obras.codigoObra LIKE '%$Parametro%' 
                  OR obras.Nombre LIKE '%$Parametro%' 
                  OR obras.Responsable LIKE '%$Parametro' 
                  OR obras.tipoObra LIKE '%$Parametro%'
                  OR delegaciones.Nombre LIKE '%$Parametro%') ";
   }

   if ($dUsuario->Zonas <> "")
   {
      if ($Where <> "")
      {
         $Where .= " AND obras.idDelegacion IN (" . $dUsuario->Zonas . ") ";
      } else
      {
         $Where = " obras.idDelegacion IN (" . $dUsuario->Zonas . ") ";
      }
   }


   if ($Fecha <> "")
   {
      if ($Where <> "")
      {
         $Where = " WHERE " . $Fecha . " AND " . $Where;
      } else
      {
         $Where = " WHERE " . $Fecha;
      }
   } else
   {
      if ($Where <> "")
      {
         $Where = " WHERE " . $Where;
      } else
      {
         $Limit = "LIMIT 0, 30";
      }
   }


   $sql = "SELECT 
            obras.*, 
            delegaciones.Nombre AS Delegacion 
         FROM 
            obras 
            LEFT JOIN delegaciones on obras.idDelegacion = delegaciones.idDelegacion 
         $Where 
         ORDER BY obras.idObra DESC $Limit";

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