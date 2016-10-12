<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idObra = $_POST['idObra'];

   $sql = "SELECT ActaAnterior FROM msc_CompInforme
            WHERE
               msc_CompInforme.idObra = '$idObra';";

   $result = $link->query($sql);

   $Acta = "";

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Acta .= $row['ActaAnterior'];
      }
         mysqli_free_result($result);  
   } 

   echo $Acta;
?>