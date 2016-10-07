<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $idOt = addslashes($_POST['idOt']);
   $idArbol = addslashes($_POST['idArbol']);
   
   $sql = "SELECT 
            poda_VisitaPrevia_Datos.*
         FROM 
            poda_VisitaPrevia_Datos
         WHERE
            poda_VisitaPrevia_Datos.idOt = '$idOt'
            AND poda_VisitaPrevia_Datos.idArbol = '$idArbol'";

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