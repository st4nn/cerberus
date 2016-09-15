<?php
   include("../conectar.php"); 
   $link = Conectar();

   date_default_timezone_set("America/Bogota");
   $id = date('YmdHis');

    $campo = $_POST['campo'];
    $valor = $_POST['valor'];
    $idHito = $_POST['idHito'];
    $idActividad = $_POST['idActividad'];
    $idProyecto = $_POST['idProyecto'];

    $sql = "SELECT * FROM estadoactividades WHERE idHito = $idHito AND idActividad = $idActividad AND idProyecto = $idProyecto;";
    $result = $link->query($sql);
    if ($result->num_rows > 0)
    {
      $sql = "UPDATE estadoactividades SET $campo = '$valor' WHERE  idHito = $idHito AND idActividad = $idActividad AND idProyecto = $idProyecto;";
    } else
    {
      if ($campo == "idEstado")
      {
        $sql = "INSERT INTO estadoactividades (idEstadoActividad, $campo, idHito, idActividad, idProyecto, idLogin, idEtapa) VALUES ($id, '$valor', $idHito, $idActividad, $idProyecto, 1, 1);";
      } else
      {
        $sql = "INSERT INTO estadoactividades (idEstadoActividad, $campo, idHito, idActividad, idProyecto, idLogin, idEtapa, idEstado) VALUES ($id, '$valor', $idHito, $idActividad, $idProyecto, 1, 1, 1);";
      }
    }

  $result = $link->query($sql);

  if ( $link->affected_rows > 0)
  {
     echo 1;
  } else
  {
     echo 0;
  }
?>