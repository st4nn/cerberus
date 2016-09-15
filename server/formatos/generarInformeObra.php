<?php

	require('../../assets/fpdf/fpdf.php');
	require('../php/conectar.php');
	$link = Conectar();

	$idObra = $_GET['id'];

	$tamanioFuente = 11;

	
	class PDF extends FPDF
	{
		function Header()
		{

		    // Logo
		    $this->Image('gas-natural-fenosa-logo.png',10,8,30);
		    $this->SetFont('Arial','B',7);
		    $this->SetY(5);
		    $this->Cell(0,10, "ASEGURAMIENTO DE LA CALIDAD EN DISTRIBUCIÓN", 0, 0, 'C');
		    $this->Ln(20);
		}

		function Footer()
		{
		    // Posición: a 1,5 cm del final
		    $this->SetY(-15);
		    
		    $this->SetFont('Arial','B',8);

		    $this->Cell(0,5,'Página '.$this->PageNo().' de {nb}',0,0,'R');
		}
	}

	$pdf = new PDF();
	$pdf->AliasNbPages();
	$pdf->SetMargins(25, 25, 20);
	$pdf->AddPage();

	$posX = 0;
	$posY = 17;

	$sql = "SELECT 
		obras_InformacionBasica.*,
		msc.Fecha,
		msc.Lugar,
		datosusuarios.Nombre AS Responsable,
		confTiposObra.Nombre AS tipoObra,
		obras.codigoObra,
		obras.Nombre AS Descripcion,
		confEstadosObra.Nombre AS estadoObra
	FROM 
		obras_InformacionBasica
		INNER JOIN msc ON obras_InformacionBasica.idObra = msc.idObra
		INNER JOIN datosusuarios ON datosusuarios.idLogin = obras_InformacionBasica.idResponsable
		LEFT JOIN confTiposObra ON confTiposObra.idTipoObra = obras_InformacionBasica.idTipoObra
		INNER JOIN obras ON obras.idObra = obras_InformacionBasica.idObra
		INNER JOIN confEstadosObra ON confEstadosObra.id = obras_InformacionBasica.Estado
	WHERE
		obras_InformacionBasica.idObra = '$idObra'";

	$result = $link->query($sql);
	$row = $result->fetch_assoc();

	$pdf->SetFont('Arial','',$tamanioFuente);

	$asunto = "INFORME DE MESA DE CALIDAD " . $row['tipoObra'] . "\n\n OBRAS " . $row['codigoObra'] . " " . $row['Descripcion'];
	$pdf->SetXY(70, 160);
	$pdf->Multicell(120,4, $asunto ,0,'R');

	$pdf->Ln();
	$meses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	$pdf->Cell(0,5, strtoupper($meses[substr($row['Fecha'], 5,2) * 1]) . " " . substr($row['Fecha'] , 0,4) ,0,1,'R');

	$pdf->AddPage();

	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Cell(33,5,'CONTRATISTA:',0,0,'L');
	$pdf->SetFont('Arial','',$tamanioFuente);
	$pdf->Cell(90,5,$row['Contratista'] ,0,1,'L');
	$pdf->Ln();

	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Cell(33,5,'Obra N°:',0,0,'L');
	$pdf->SetFont('Arial','',$tamanioFuente);
	$pdf->Cell(90,5,$row['codigoObra'] . " " . $row['Descripcion'] ,0,1,'L');
	$pdf->Ln();

	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Cell(33,5,'Tipo Obra:',0,0,'L');
	$pdf->SetFont('Arial','',$tamanioFuente);
	$pdf->Cell(90,5,$row['tipoObra'] ,0,1,'L');
	$pdf->Ln();


	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Cell(33,5,'Alcance:',0,1,'L');
	$pdf->SetFont('Arial','',$tamanioFuente);
	$pdf->Multicell(160,4,$row['Alcances'] ,0,'J');
	$pdf->Ln();

	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Cell(33,5,'Dirección:',0,1,'L');
	$pdf->SetFont('Arial','',$tamanioFuente);
	$pdf->Multicell(160,4,$row['Direccion'] ,0,'J');
	$pdf->Ln();
	
	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Cell(40,5,'Vigilante Obra/SGT:',0,0,'L');
	$pdf->SetFont('Arial','',$tamanioFuente);
	$pdf->Cell(90,5,$row['Vigilante'] ,0,1,'L');

	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Cell(40,5,'Auditor:',0,0,'L');
	$pdf->SetFont('Arial','',$tamanioFuente);
	$pdf->Cell(90,5,$row['Responsable'] ,0,1,'L');
	$pdf->Ln();

	$sql = "SELECT * FROM msc_CompInforme WHERE idObra = '$idObra'";
	$tmpResult = $link->query($sql);

	if ($tmpResult->num_rows > 0)
	{
		$tmpRow = $tmpResult->fetch_assoc();
		

		$pdf->SetFont('Arial','B',$tamanioFuente);
		$pdf->Cell(33,5,'Desviaciones:',0,1,'L');
		$pdf->SetFont('Arial','',$tamanioFuente);
		$pdf->Cell(0,4,"Presupuesto - Replanteo – Ultimo  Reformado" ,0, 1,'J');
		$pdf->Ln();
		$pdf->Cell(67,4,"La Obra presenta una Desviación de: " ,0, 0,'J');
		$pdf->SetFont('Arial','B',$tamanioFuente);
		$desv = number_format((1-($tmpRow['CosteRepTrabajo']/$tmpRow['CosteRealTrabajo']))*100, 2, ",", ".");
		$pdf->Cell(30,4, $desv . " %" ,0, 0,'J');
		$pdf->Ln();
	}

	$pdf->Ln();
	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Cell(33,5,'Comentarios de encargado de obra: :',0,1,'L');
	$pdf->SetFont('Arial','',$tamanioFuente);
	$pdf->Multicell(160,4,$row['Observaciones'] ,0,'J');
	$pdf->Ln();

	$pdf->SetDrawColor(0, 128, 255);
	$pdf->SetLineWidth(0.8);

	$pdf->SetFillColor(153, 204, 255);
	$pdf->SetFont('Arial','B',$tamanioFuente - 3);
	$pdf->Cell(30,5,'Cod Obra',1,0,'C', 1);
	$pdf->Cell(40,5,'Descripción',1,0,'C', 1);
	$pdf->Cell(29,5,'Presupuesto',1,0,'C', 1);
	$pdf->Cell(29,5,'Coste Rep Trabajo',1,0,'C', 1);
	$pdf->Cell(29,5,'Coste Real Trabajo',1,0,'C', 1);
	$pdf->Cell(14,5,'Desv (%)',1,1,'C', 1);

	$pdf->SetFont('Arial','',$tamanioFuente - 3);

	$pdf->SetFillColor(229, 243, 255);
	$posY = $pdf->GetY();

	$renglones = ceil(strlen($row['Descripcion'])/39);
	$lineas = $renglones * 4;
	
	$pdf->Cell(30,$lineas,$row['codigoObra'],1,0,'C', 1);
	
	$pdf->Multicell(40,4, $row['Descripcion'] ,0,'L', 1);

	$pdf->SetXY(95,$posY);

	if ($tmpResult->num_rows > 0)
	{
		$pdf->Cell(29,$lineas, "$" . number_format($tmpRow['Presupuesto'], 2, ",", "."),1,0,'L', 1);
		$pdf->Cell(29,$lineas, "$" . number_format($tmpRow['CosteRepTrabajo'], 2, ",", ".") ,1,0,'L', 1);
		$pdf->Cell(29,$lineas, "$" . number_format($tmpRow['CosteRealTrabajo'], 2, ",", ".") ,1,0,'L', 1);
		
		$pdf->Cell(14,$lineas,$desv . " %",1,1,'C', 1);

		mysqli_free_result($tmpResult);
	}

	$pdf->Line(30, $posY, 160, $posY);	
	$pdf->Line(30, ($posY + $lineas), 160, ($posY + $lineas));	


	$pdf->Ln();

	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Cell(33,5,'Datos de la Inspección:',0,1,'L');
	$pdf->SetFont('Arial','',$tamanioFuente);
	$pdf->Ln();

	$sql = "SELECT COUNT(*) AS Cantidad FROM postes WHERE idObra = '$idObra'";
	$tmpResult = $link->query($sql);
	$tmpRow = $tmpResult->fetch_assoc();
	$numPostes = $tmpRow['Cantidad'];
	mysqli_free_result($tmpResult);

	$sql = "SELECT 
				COUNT(DISTINCT resultadoauditoria.codigoPoste) AS Cantidad 
			FROM 
				resultadoauditoria 
				LEFT JOIN msc_Resultado 
					ON (msc_Resultado.idObra = resultadoauditoria.idObra 
					AND msc_Resultado.codigoPoste = resultadoauditoria.codigoPoste
					AND msc_Resultado.Criterio = resultadoauditoria.Criterio
					AND msc_Resultado.codigoNC = resultadoauditoria.codigoNC)
			WHERE 
				resultadoauditoria.idObra = '$idObra' 
				and resultadoauditoria.Resultado = 'No Cumple'
				AND ((msc_Resultado.Clasificacion <> 'No Aplica'
				AND msc_Resultado.Clasificacion <> 'Defecto de Terceros') OR msc_Resultado.Clasificacion IS NULL)";

	$tmpResult = $link->query($sql);
	$tmpRow = $tmpResult->fetch_assoc();
	$numPostesObservaciones = $tmpRow['Cantidad'];

	$sql = "SELECT COUNT(DISTINCT codigoPoste) AS Cantidad FROM resultadoauditoria WHERE resultadoauditoria.idObra = '$idObra';";

	$tmpResult = $link->query($sql);
	$tmpRow = $tmpResult->fetch_assoc();
	$numPostesRevisados = $tmpRow['Cantidad'];



	$sql = "SELECT 
				COUNT(DISTINCT resultadoauditoria.codigoNC) AS Cantidad 
			FROM 
				resultadoauditoria 
				LEFT JOIN msc_Resultado 
					ON (msc_Resultado.idObra = resultadoauditoria.idObra 
					AND msc_Resultado.codigoPoste = resultadoauditoria.codigoPoste
					AND msc_Resultado.Criterio = resultadoauditoria.Criterio
					AND msc_Resultado.codigoNC = resultadoauditoria.codigoNC)
			WHERE 
				resultadoauditoria.idObra = '$idObra' 
				and resultadoauditoria.Resultado = 'No Cumple'
				AND ((msc_Resultado.Clasificacion <> 'No Aplica'
				AND msc_Resultado.Clasificacion <> 'Defecto de Terceros') OR msc_Resultado.Clasificacion IS NULL)";


	$tmpResult = $link->query($sql);
	$tmpRow = $tmpResult->fetch_assoc();
	$numNC = $tmpRow['Cantidad'];

	if ($numPostes > 0)
	{
		$tmpPorcentajeRevision = number_format($numPostesRevisados * 100/$numPostes, 2, ",", ".");
	} else
	{
		$tmpPorcentajeRevision = 0;
	}

	if ($numPostesRevisados > 0)
	{
		$tmpPorcentajeObservaciones = number_format($numPostesObservaciones * 100/$numPostesRevisados, 2, ",", ".");
	} else
	{
		$tmpPorcentajeObservaciones = 0;
	}

	
	$texto = "La presente auditoria se realizó efectuando revisiones a los trabajos que se encuentran en estado  " . $row['estadoObra'] . ", en total se revisaron " . $numPostesRevisados . "  de " . $numPostes . " elementos intervenidos, es decir se revisó en un " . $tmpPorcentajeRevision . "% la obra, de los " . $numPostesRevisados . " postes revisados se encontraron " . $numPostesObservaciones . " postes con observación, es decir un " . $tmpPorcentajeObservaciones . "% de estructuras con observaciones, para un total de " . $numNC . " Observaciones.";
	$pdf->Multicell(0,4,$texto ,0,'J');

	$pdf->Ln();

	$pdf->SetDrawColor(0, 128, 255);
	$pdf->SetLineWidth(0.8);

	$pdf->SetFillColor(153, 204, 255);
	$pdf->SetFont('Arial','B',$tamanioFuente - 3);
	$pdf->Cell(35,5,'',0,0,'R');
	$pdf->Cell(60,5,'DESCRIPCIÓN',1,0,'C', 1);
	$pdf->Cell(30,5,'CANTIDAD',1,1,'C', 1);

	$pdf->SetFont('Arial','',$tamanioFuente - 3);

	$pdf->SetFillColor(229, 243, 255);
	$posY = $pdf->GetY();
	$pdf->SetFont('Arial','',$tamanioFuente - 3);

	$pdf->Cell(35,5,'',0,0,'R');
	$pdf->Cell(60,5,'Postes total de Obra según diseño',1,0,'R', 1);
	$pdf->Cell(30,5,$numPostes,1,1,'R', 1);

	$pdf->Cell(35,5,'',0,0,'R');
	$pdf->Cell(60,5,'Postes Inspeccionados ',1,0,'R', 1);
	$pdf->Cell(30,5,$numPostesRevisados,1,1,'R', 1);

	$pdf->Cell(35,5,'',0,0,'R');
	$pdf->Cell(60,5,'Postes con observaciones ',1,0,'R', 1);
	$pdf->Cell(30,5,$numPostesObservaciones,1,1,'R', 1);

	if ($numPostesObservaciones > 0)
	{

		$pdf->Ln();
		$pdf->SetFont('Arial','',$tamanioFuente);
		$pdf->Cell(0,5,'El resumen de las no conformidades detectadas se puede observar en la siguiente tabla.',0,1,'L', 0);
		$pdf->Ln();

		$sql = "SELECT 
					resultadoauditoria.Criterio AS 'Criterio',
	               resultadoauditoria.codigoNC AS 'Codigo',
	               confPuntosControl_Subgrupos.Descripcion,
	               confPuntosControl_Subgrupos.tipoDefecto,
					COUNT(DISTINCT resultadoauditoria.codigoPoste) AS Cantidad 
				FROM 
					resultadoauditoria 
					INNER JOIN confPuntosControl_Subgrupos ON (resultadoauditoria.codigoNC = confPuntosControl_Subgrupos.Codigo AND resultadoauditoria.Criterio = confPuntosControl_Subgrupos.Criterio)
					LEFT JOIN msc_Resultado 
						ON (msc_Resultado.idObra = resultadoauditoria.idObra 
						AND msc_Resultado.codigoPoste = resultadoauditoria.codigoPoste
						AND msc_Resultado.Criterio = resultadoauditoria.Criterio
						AND msc_Resultado.codigoNC = resultadoauditoria.codigoNC)
				WHERE 
					resultadoauditoria.idObra = '$idObra' 
					and resultadoauditoria.Resultado = 'No Cumple'
					AND ((msc_Resultado.Clasificacion <> 'No Aplica'
					AND msc_Resultado.Clasificacion <> 'Defecto de Terceros') OR msc_Resultado.Clasificacion IS NULL)
				GROUP BY
	               resultadoauditoria.Criterio,
	               resultadoauditoria.codigoNC,
	               confPuntosControl_Subgrupos.Descripcion,
	               confPuntosControl_Subgrupos.tipoDefecto
	            ORDER BY
	               resultadoauditoria.codigoNC";

	    $tmpResult = $link->query($sql);
		
	    $pdf->SetDrawColor(0, 128, 255);
		$pdf->SetLineWidth(0.8);

		$pdf->SetFillColor(153, 204, 255);
		$pdf->SetFont('Arial','B',$tamanioFuente - 3);
		$pdf->Cell(20,5,'Criterio',1,0,'C', 1);
		$pdf->Cell(20,5,'PC',1,0,'C', 1);
		$pdf->Cell(74,5,'Descripción',1,0,'C', 1);
		$pdf->Cell(18,5,'Tipo Defecto',1,0,'C', 1);
		$pdf->Cell(15,5,'Total',1,0,'C', 1);
		$pdf->Cell(15,5,'%',1,1,'C', 1);

		$pdf->SetFont('Arial','',$tamanioFuente - 3);

		$pdf->SetFillColor(229, 243, 255);
		while ($tmpRow = mysqli_fetch_assoc($tmpResult))
	    {
			$posY = $pdf->GetY();

			$renglones = ceil(strlen($tmpRow['Descripcion'])/59);
			$lineas = $renglones * 4;
			
			$pdf->Cell(20,$lineas,$tmpRow['Criterio'],1,0,'C', 1);
			$pdf->Cell(20,$lineas,$tmpRow['Codigo'],1,0,'C', 1);
			
			$pdf->Multicell(74,4, $tmpRow['Descripcion'] ,0,'L', 1);

			$pdf->SetXY(139,$posY);
			$pdf->Cell(18,$lineas,$tmpRow['tipoDefecto'],1,0,'C', 1);
			$pdf->Cell(15,$lineas,$tmpRow['Cantidad'],1,0,'R', 1);
			$pdf->Cell(15,$lineas,number_format((($tmpRow['Cantidad']/$numPostesObservaciones)*100), 2, ",", "."),1,1,'R', 1);

			$pdf->Line(30, ($posY ), 160, ($posY));
			$pdf->Line(30, ($posY + $lineas), 160, ($posY + $lineas));

			if ($posY > 265)
			{
				$pdf->AddPage();

				$pdf->SetDrawColor(0, 128, 255);
				$pdf->SetLineWidth(0.8);

				$pdf->SetFillColor(153, 204, 255);
				$pdf->SetFont('Arial','B',$tamanioFuente - 3);
				$pdf->Cell(20,5,'Criterio',1,0,'C', 1);
				$pdf->Cell(20,5,'PC',1,0,'C', 1);
				$pdf->Cell(74,5,'Descripción',1,0,'C', 1);
				$pdf->Cell(18,5,'Tipo Defecto',1,0,'C', 1);
				$pdf->Cell(15,5,'Total',1,0,'C', 1);
				$pdf->Cell(15,5,'%',1,1,'C', 1);

				$pdf->SetFont('Arial','',$tamanioFuente - 3);
				$pdf->SetFillColor(229, 243, 255);
			}
	    }
	    $pdf->SetX(157);
	    $pdf->Cell(15, 5,$numPostesObservaciones,1,0,'R');
	    $pdf->Cell(15, 5,'100%',1,0,'R');
	}

    $pdf->AddPage();
    $pdf->SetFont('Arial','B',$tamanioFuente);
    $pdf->Cell(0, 5,'Observaciones',0,1,'L');
    $pdf->Ln();

    
    $pdf->SetFont('Arial','',$tamanioFuente);
    if ($numNC > 0)
    {
    	$pdf->Cell(0, 5,'En la inspección realizada, la obra se encontró NO Conforme',0,1,'L');
    } else
    {
    	$pdf->Cell(0, 5,'En la inspección realizada, la obra se encontró Conforme',0,1,'L');
    }

    $sql = "SELECT 
				resultadoauditoria.codigoPoste,
				resultadoauditoria.Criterio AS 'Criterio',
				resultadoauditoria.codigoNC AS 'Codigo',
				confPuntosControl_Subgrupos.Descripcion,
				confPuntosControl_Subgrupos.tipoDefecto,
				msc_Resultado.justificacion,
				msc_Resultado.justificacionClasificacion,
				IF (msc_Resultado.Clasificacion IS NULL, resultadoauditoria.Resultado , msc_Resultado.Clasificacion) AS Clasificacion,
				soportes.observaciones AS Observacion,
				GROUP_CONCAT(DISTINCT soportes.foto SEPARATOR '$') AS Fotos
			FROM 
				resultadoauditoria 
				INNER JOIN confPuntosControl_Subgrupos ON (resultadoauditoria.codigoNC = confPuntosControl_Subgrupos.Codigo AND resultadoauditoria.Criterio = confPuntosControl_Subgrupos.Criterio)
				LEFT JOIN msc_Resultado 
					ON (msc_Resultado.idObra = resultadoauditoria.idObra 
					AND msc_Resultado.codigoPoste = resultadoauditoria.codigoPoste
					AND msc_Resultado.Criterio = resultadoauditoria.Criterio
					AND msc_Resultado.codigoNC = resultadoauditoria.codigoNC)
				LEFT JOIN soportes
					ON (soportes.idObra = resultadoauditoria.idObra 
					AND soportes.codigoPoste = resultadoauditoria.codigoPoste
					AND soportes.Criterio = resultadoauditoria.Criterio
					AND soportes.codigoNC = resultadoauditoria.codigoNC)
			WHERE 
				resultadoauditoria.idObra = '$idObra' 
				AND resultadoauditoria.Resultado = 'No Cumple'
				AND ((msc_Resultado.Clasificacion <> 'No Aplica'
				AND msc_Resultado.Clasificacion <> 'Defecto de Terceros') OR msc_Resultado.Clasificacion IS NULL)
			GROUP BY
				resultadoauditoria.codigoPoste,
				resultadoauditoria.Criterio,
				resultadoauditoria.codigoNC
			ORDER BY
			   resultadoauditoria.codigoNC,
			   resultadoauditoria.codigoPoste";

			   

	$result = $link->query($sql);

	$pdf->Ln();
	$pdf->Ln();

	$tmpCodigoNC = "";
	$tmpCriterio = "";
	$tmpObservaciones = "";
	$idx = 0;
	$justificaciones = array();
	$justificacionesC = array();

	while ($row = mysqli_fetch_assoc($result))
	{

		$posY = $pdf->GetY();

		if ($posY > 205)
		{
			$pdf->AddPage();
			$posY = $pdf->GetY();		
		}

		if ($tmpCriterio <> $row['Criterio'] OR $tmpCodigoNC <> $row['Codigo'])
		{
			if ($idx > 0)
			{
				$idx = 0;
				$pdf->Ln();
				$posY = $posY + 60;
				$pdf->SetXY(30, $posY);
				$posY = $pdf->GetY();
			}

			$idx = 0;
			if ($tmpObservaciones <> "")
			{
				$pdf->Ln();
				$pdf->Multicell(0,4, $tmpObservaciones ,1,'L', 1);	
				$pdf->Ln();

				$tmpObservaciones = "";
			}

			foreach ($justificaciones as $key => $value)
			{
				if ($value <> "")
				{
					$pdf->SetFont('Arial','B',$tamanioFuente);
					$pdf->Cell(0, 5, "Justificación " . $key,0,1,'L', 0);
					$pdf->SetFont('Arial','',$tamanioFuente);
					$pdf->Multicell(0,4, $value, 0,'J', 0);
					$pdf->Ln();$pdf->Ln();

					$pdf->SetFont('Arial','B',$tamanioFuente);
					$pdf->Cell(0, 5, "Clasificación de la Justificación " . $key,0,1,'L', 0);
					$pdf->SetFont('Arial','',$tamanioFuente);
					$pdf->Multicell(0,4, $justificacionesC[$key], 0,'J', 0);
					$pdf->Ln();$pdf->Ln();
				}
			}

			$justificaciones = array();
			$justificacionesC = array();

			$tmpCriterio = $row['Criterio'];
			$tmpCodigoNC = $row['Codigo'];
			$pdf->SetDrawColor(0, 128, 255);
			$pdf->SetFillColor(153, 204, 255);
			$pdf->SetFont('Arial','B',$tamanioFuente - 2);
			$pdf->Cell(30, 5,'CRITERIO',1,0,'C', 1);
			$pdf->Cell(25, 5,'CODIGO',1,0,'C', 1);
			$pdf->Cell(78, 5,'DESCRIPCIÓN',1,0,'C', 1);
			$pdf->Cell(32, 5,'CLASIFICACIÓN',1,1,'C', 1);
			
			$pdf->SetFont('Arial','',$tamanioFuente - 2);
			$pdf->SetFillColor(229, 243, 255);

			$posY = $pdf->GetY();
			$renglones = ceil(strlen($row['Descripcion'])/46);
			$lineas = $renglones * 4;

			$pdf->Cell(30, $lineas, $row['Criterio'],1,0,'L', 1);
			$pdf->Cell(25, $lineas, $row['Codigo'],1,0,'L', 1);
			$pdf->Multicell(78,4, $row['Descripcion'] ,1,'L', 1);

			$pdf->SetXY(158,$posY);
			$pdf->Cell(32, $lineas, $row['Clasificacion'] ,1,1,'C', 1);
			$pdf->Ln();
		} 

		$posY = $pdf->GetY();

		$fotos = explode("$", $row['Fotos']);
		
		foreach ($fotos as $key => $value) 
		{
			if ($posY > 210)
			{
				$pdf->AddPage();
				$posY = $pdf->GetY();
			}
			if ($idx == 1)
			{
				$pdf->SetX(110);
			}

			$ruta = "../archivos/Auditorias/" . $idObra . "/" . $row['codigoPoste'] . "/" . $value;

			$size = getimagesize($ruta);

			if (file_exists($ruta) AND $size['mime'] <> "")
			{
				$pdf->Image($ruta, null, $posY, 80, 0);
			}	
			

			$idx++;

			if ($idx > 1)
			{
				$idx = 0;
				$pdf->Ln();
				$posY = $posY + 60;
				$pdf->SetXY(30, $posY);
				$posY = $pdf->GetY();
			}
		}

		$tmpObservaciones .= $row['Observacion'] . " en " . $row['codigoPoste'] . "\n\n";

		$justificaciones[$row['codigoPoste']] = $row['justificacion'];
		$justificacionesC[$row['codigoPoste']] = $row['justificacionClasificacion'];
	}

	if ($idx > 0)
	{
		$idx = 0;
		$pdf->Ln();
		$posY = $posY + 60;
		$pdf->SetXY(30, $posY);
		$posY = $pdf->GetY();
	}

	if ($tmpObservaciones <> "")
	{
		$pdf->Ln();
		$pdf->Multicell(0,4, $tmpObservaciones ,1,'L', 1);	
		$pdf->Ln();

		$tmpObservaciones = "";
	}

	foreach ($justificaciones as $key => $value)
	{
		if ($value <> "")
		{
			$pdf->SetFont('Arial','B',$tamanioFuente);
			$pdf->Cell(0, 5, "Justificación " . $key,0,1,'L', 0);
			$pdf->SetFont('Arial','',$tamanioFuente);
			$pdf->Multicell(0,4, $value, 0,'J', 0);
			$pdf->Ln();$pdf->Ln();

			$pdf->SetFont('Arial','B',$tamanioFuente);
			$pdf->Cell(0, 5, "Clasificación de la Justificación " . $key,0,1,'L', 0);
			$pdf->SetFont('Arial','',$tamanioFuente);
			$pdf->Multicell(0,4, $justificacionesC[$key], 0,'J', 0);
			$pdf->Ln();$pdf->Ln();
		}
	}
	
	$pdf->Output();
?>
	
