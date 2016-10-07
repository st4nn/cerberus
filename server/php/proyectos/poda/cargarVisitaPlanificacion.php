<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $idOt = addslashes($_POST['idOt']);
   
   $sql = "SELECT 
            poda_VisitaPlanificacion.*
         FROM 
            poda_VisitaPlanificacion
         WHERE 
            poda_VisitaPlanificacion.idOt = '$idOt';";

   $result = $link->query(utf8_decode($sql));

   $idx = 0;

   if ($link->error <> "")
   {
      echo $link->error;
   } else
   {
      if ( $result->num_rows > 0)
      {
         $datos = array();
         while ($row = mysqli_fetch_assoc($result))
         {
            $datos = array();
            foreach ($row as $key => $value) 
            {
               $datos[$key] = utf8_encode($value);
            }
         }

         $sql = "SELECT 
                     poda_Resultado.*
                  FROM 
                     poda_Resultado
                     INNER JOIN confPoda_PuntosControl ON confPoda_PuntosControl.id = poda_Resultado.idPuntoControl
                  WHERE 
                     poda_Resultado.idOt = '$idOt'
                     AND confPoda_PuntosControl.Categoria = 'Planificación';";

         $result = $link->query(utf8_decode($sql));

         $items = array();
         while ($row = mysqli_fetch_assoc($result))
         {
            $items[$idx] = array();
            foreach ($row as $key => $value) 
            {
               $items[$idx][$key] = utf8_encode($value);
            }
            $idx++;
         }

         $Resultado = array('datos' => $datos, 'items' => $items);

            mysqli_free_result($result);  
            echo json_encode($Resultado);
      } else
      {
         echo 0;
      }
   }

?>