<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
  if (empty($_POST["Inicio"]))
  {
    $inicio = 0;
  } else
  {
    $inicio = $_POST["Inicio"];
  }

  if (empty($_POST["Fin"]))
  {
    $fin = 30;
  } else
  {
    $fin = $_POST["Fin"];
  }

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT COUNT(*) AS Cantidad FROM 
               Notificaciones
            WHERE 
              Notificaciones.idReceptor = '" . $Usuario->idLogin . "'
              OR Notificaciones.idRPerfil = '" . $Usuario->idPerfil . "'
              OR Notificaciones.idRZona IN (" . $Usuario->Zonas . ");";

    $result = $link->query($sql);
    $fila =  $result->fetch_array(MYSQLI_ASSOC);

    $Cantidad = $fila['Cantidad'];

   $sql = "SELECT    
                Notificaciones.Mensaje,
                Notificaciones.fechaCargue,
                datosusuarios.Nombre
            FROM 
               Notificaciones
               LEFT JOIN datosusuarios ON datosusuarios.idLogin = Notificaciones.idEmisor
            WHERE 
              Notificaciones.idReceptor = '" . $Usuario->idLogin . "'
              OR Notificaciones.idRPerfil = '" . $Usuario->idPerfil . "'
              OR Notificaciones.idRZona IN (" . $Usuario->Zonas . ")
            ORDER BY 
              Notificaciones.fechaCargue DESC
          LIMIT $inicio, $fin;";
                
   $result = $link->query($sql);

   $idx = 0;
   
      $Resultado = array();
      $Resultado['Cantidad'] = $Cantidad;

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
   
?>