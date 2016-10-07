<?php
  include("../../conectar.php"); 
   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);

   $Categoria = "";
   if (array_key_exists("Categoria", $_POST))
   {
      $Categoria = addslashes($_POST['Categoria']);
      if ($Categoria <> "")
      {
         $Categoria = " WHERE Categoria LIKE '$Categoria' ";
      }
   }

   $sql = "SELECT 
            confPoda_PuntosControl.*
         FROM 
            confPoda_PuntosControl
         $Categoria
         ORDER BY confPoda_PuntosControl.Codigo";

   $result = $link->query(utf8_decode($sql));

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