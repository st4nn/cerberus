<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $idOt = addslashes($_POST['idOt']);
   $idArbol = addslashes($_POST['idArbol']);
   
   $sql = "SELECT 
            poda_Observaciones.*,
            datosusuarios.Nombre
         FROM 
            poda_Observaciones
            INNER JOIN datosusuarios ON datosusuarios.idLogin = poda_Observaciones.Usuario
         WHERE
            poda_Observaciones.idOt = '$idOt'
            AND poda_Observaciones.idArbol = '$idArbol'
         ORDER BY poda_Observaciones.fechaCargue ASC";

   $result = $link->query($sql);

   $idx = 0;
   if ($link->error <> "")
   {
      echo $link->error;
   } else
   {
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
   }

?>