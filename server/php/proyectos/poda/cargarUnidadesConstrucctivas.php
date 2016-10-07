<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   
   $sql = "SELECT 
            confPoda_UnidadesConstructivas.*
         FROM 
            confPoda_UnidadesConstructivas
         ORDER BY confPoda_UnidadesConstructivas.Nombre";

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