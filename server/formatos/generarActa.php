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
		    $this->Image('lblActa.png',0,20,25);
		    $this->Image('gas-natural-fenosa-logo.png',170,8,30);
		}

		function Footer()
		{
		    // Posición: a 1,5 cm del final
		    $this->SetY(-15);
		    
		    $this->SetFont('Arial','B',8);

		    $this->Cell(0,10,'Página '.$this->PageNo().' de {nb}',0,0,'R');
		}
	}

	$pdf = new PDF();
	$pdf->AliasNbPages();
	$pdf->SetMargins(25, 25, 20);
	$pdf->AddPage();

	$posX = 0;
	$posY = 17;

	$sql = "SELECT 
		obras_InformacionBasica.idObra,
		msc.Fecha,
		msc.Lugar,
		datosusuarios.Nombre AS Responsable,
		confTiposObra.Nombre AS tipoObra,
		obras.codigoObra,
		obras.Nombre AS Descripcion,
		COUNT(DISTINCT resultadoauditoria.codigoPoste) AS noConformes
	FROM 
		obras_InformacionBasica
		INNER JOIN msc ON obras_InformacionBasica.idObra = msc.idObra
		INNER JOIN datosusuarios ON datosusuarios.idLogin = msc.idResponsable
		LEFT JOIN confTiposObra ON confTiposObra.idTipoObra = obras_InformacionBasica.idTipoObra
		INNER JOIN obras ON obras.idObra = obras_InformacionBasica.idObra
		LEFT JOIN resultadoauditoria ON obras_InformacionBasica.idObra = resultadoauditoria.idObra AND resultadoauditoria.Resultado = 'No Cumple'
	WHERE
		obras_InformacionBasica.idObra = '$idObra'";

	$result = $link->query($sql);
	$row = $result->fetch_assoc();

	$pdf->SetFont('Arial','',$tamanioFuente);

	
	$pdf->Cell(33,5,'Fecha:',0,0,'L');
	$pdf->Cell(90,5,$row['Fecha'] ,0,1,'L');
	$pdf->Cell(33,5,'Lugar:',0,0,'L');
	$pdf->Cell(90,5,$row['Lugar'] ,0,1,'L');
	$pdf->Cell(33,5,'A la atención de:',0,0,'L');
	$pdf->Cell(90,5,'Auditoría Técnica' ,0,1,'L');
	$pdf->Cell(33,5,'Realizado Por:',0,0,'L');
	$pdf->Cell(90,5,$row['Responsable'] ,0,1,'L');

	$pdf->Ln();
	$pdf->Ln();

	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Cell(33,5,'Asunto:',0,0,'L');
	$pdf->SetFont('Arial','',$tamanioFuente);

	$asunto = "Mesa de Calidad Obras de " . $row['tipoObra'] . "\n Obra " . $row['codigoObra'] . " " . $row['Descripcion'];
	$pdf->Multicell(90,4, $asunto ,0,'R');

	$pdf->Ln();

	$sql = "SELECT 
				Nombre, 
				Correo, 
				Cargo, 
				Empresa 
			FROM 
				obras_Contactos 
			WHERE 
				idObra = '$idObra' 
		UNION ALL
			SELECT 
				datosusuarios.Nombre, 
				datosusuarios.Correo, 
				datosusuarios.Cargo, 
				'WSP COLOMBIA SAS' AS Empresa 
			FROM
				datosusuarios
				INNER JOIN msc ON msc.idResponsable = datosusuarios.idLogin
			WHERE
				msc.idObra = '$idObra'";

	$contactos = $link->query($sql);

	while ($rowContactos = mysqli_fetch_assoc($contactos))
	{
		$pdf->SetX(50);
		$pdf->Cell(80,5,$rowContactos['Nombre'] ,0,0,'L');
		$pdf->Cell(120,5,$rowContactos['Empresa'] ,0,1,'L');
	}

	$pdf->Ln();
	$pdf->Ln();
	$pdf->Ln();
	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Cell(0,5,'AGENDA DEL DÍA:',0,1,'C');
	$pdf->Ln();

	$pdf->SetFillColor(177, 189, 195);
	$pdf->Cell(0,6,'* REVISIÓN DEL ACTA ANTERIOR',0,1,'L', 1);

	$pdf->SetFont('Arial','',$tamanioFuente);

	$pdf->SetFillColor(220, 225, 228);
	$pdf->Cell(0,6,'1. 	TEMA 1: Revisión de las no conformidades de la obra',0,1,'L', 1);
	$pdf->Cell(0,6,  $row['codigoObra'] . " " . $row['Descripcion'] ,0,1,'L', 1);

	$pdf->SetFillColor(177, 189, 195);
	$pdf->Cell(0,6,'2. 	TEMA 2: Justificación de las No Conformidades',0,1,'L', 1);
	$pdf->Cell(0,6,  "" ,0,1,'L', 1);

	$pdf->SetFillColor(220, 225, 228);
	$pdf->Cell(0,6,'3. 	TEMA 3: Fechas y compromisos',0,1,'L', 1);
	$pdf->Cell(0,6,  "" ,0,1,'L', 1);

	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Ln();
	$pdf->Cell(0,5,'DESARROLLO DE LA REUNIÓN',0,1,'C');

	$pdf->SetFont('Arial','',$tamanioFuente);
	$pdf->Ln();

	$sql = "SELECT ActaAnterior FROM msc_CompInforme WHERE idObra = '$idObra' ";
	$ActaAnterior = $link->query($sql);
	while ($rowActa = mysqli_fetch_assoc($ActaAnterior))
	{
		$DesarrolloReunion = $rowActa['ActaAnterior'];
	}


	$pdf->SetFillColor(220, 225, 228);
	$pdf->MultiCell(0, 4, $DesarrolloReunion, 0,'J', 1);
	$pdf->Ln();

	$DesarrolloReunion = "Se revisaron los trabajos realizados por medio del poste a poste y la evidencia tomada por auditoria de la obra " . $row['codigoObra'] . " " . $row['Descripcion'] . ", el resultado fue de obra conforme en proceso de corrección de producto no conforme, no conformidades detectadas por el ingeniero encargado de obra. Se encontraron " . $row['noConformes'] . " productos no conforme con cronograma de corrección de estas; cabe anotar que los trabajos que queden pendiente por ejecutar después de la fecha límite de programación de corrección de producto no conforme pasaran a ser no conformidades.";

	$pdf->SetFillColor(220, 225, 228);
	$pdf->MultiCell(0, 4, $DesarrolloReunion, 0,'J', 1);

	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->SetFillColor(177, 189, 195);
	$pdf->Ln();

	$pdf->Cell(0,5,'Justificaciones y Comentarios',0,1,'L', 1);
	$pdf->Cell(0,5,'',0,1,'L', 1);
	$pdf->SetFont('Arial','',$tamanioFuente);

	$sql = "SELECT 
				msc_Resultado.*, 
				confPuntosControl_Subgrupos.Descripcion 
			FROM 
				msc_Resultado 
				INNER JOIN confPuntosControl_Subgrupos 
					ON confPuntosControl_Subgrupos.Criterio = msc_Resultado.Criterio AND confPuntosControl_Subgrupos.codigo = msc_Resultado.codigoNC
			WHERE 
				idObra = '$idObra' 
			ORDER BY 
				Criterio, 
				codigoNC";
	$Justificaciones = $link->query($sql);

	while ($rowJustificaciones = mysqli_fetch_assoc($Justificaciones))
	{
		$Texto = "El elemento " . $rowJustificaciones['codigoPoste'] . " se clasificó como " . $rowJustificaciones['Clasificacion'] . " en el aspecto " . $rowJustificaciones['codigoNC'] . " del Formato de " . $rowJustificaciones['Criterio'] . " " . $rowJustificaciones['Descripcion'];
		if ($rowJustificaciones['justificacion'] <> "")
		{
			$Texto .= "\nLa justificación de esto es: " . $rowJustificaciones['justificacion'];
		}

		if ($rowJustificaciones['justificacionClasificacion'] <> "")
		{
			$Texto .= "\nEl Inspector Opina: " . $rowJustificaciones['justificacionClasificacion'];
		}
		$Texto .= "\n\n";
		
		$pdf->MultiCell(0, 5,$Texto ,0,'J', 1);
	}

	$pdf->AddPage();

	$pdf->SetFont('Arial','B',$tamanioFuente);
	$pdf->Ln();
	$pdf->Ln();
	$pdf->Cell(0,5,'COMPROMISOS',0,1,'C');
	$pdf->Ln();

	$pdf->SetFont('Arial','B',$tamanioFuente - 3);

	$sql = "SELECT 
				*
			FROM
				msc_Compromisos
			WHERE
				msc_Compromisos.idObra = '$idObra'";

	$compromisos = $link->query(utf8_encode($sql));
	
	$tmpPadre = "";
	$pdf->SetDrawColor(255, 255, 255);
	$pdf->SetLineWidth(1);

	$pdf->SetFillColor(221, 215, 212);
	$pdf->SetFont('Arial','B',$tamanioFuente - 3);
	$pdf->Cell(7,5,'No',1,0,'C', 1);
	$pdf->Cell(50,5,'Actividad',1,0,'C', 1);
	$pdf->Cell(13,5,'Avance',1,0,'C', 1);
	$pdf->Cell(35,5,'Responsable',1,0,'C', 1);
	$pdf->Cell(43,5,'Fecha Ejecución Propuesta',1,0,'C', 1);
	$pdf->Cell(18,5,'Fecha Cierre',1,1,'C', 1);

	$pdf->SetFont('Arial','',$tamanioFuente - 3);

	$pdf->Cell(7,5,'#',1,0,'C', 1);
	$pdf->Cell(50,5,'Descripción',1,0,'C', 1);
	$pdf->Cell(13,5,'%',1,0,'C', 1);
	$pdf->Cell(35,5,'Iniciales',1,0,'C', 1);
	$pdf->Cell(21,5,'Inicio',1,0,'C', 1);
	$pdf->Cell(22,5,'Fin',1,0,'C', 1);
	$pdf->Cell(18,5,'',1,1,'C', 1);

	$pdf->SetFont('Arial','',7);

	$posY = $pdf->GetY();

	
	$idx = 1;

	$pdf->SetFillColor(244, 241, 240);
	while ($rowCompromisos = mysqli_fetch_assoc($compromisos))
	{
		$renglones = ceil(strlen($rowCompromisos['Compromiso'])/39);
		$lineas = $renglones * 4;
		
		$pdf->Cell(7,$lineas,$idx,1,0,'C', 1);
		
		$pdf->Multicell(50,4, $rowCompromisos['Compromiso'] ,0,'L', 1);
		$pdf->SetXY(82,$posY);

		$pdf->Cell(13,$lineas,'',1,0,'C', 1);
		$pdf->Cell(35,$lineas, $rowCompromisos['Responsable'] ,1,0,'L', 1);
		$pdf->Cell(21,$lineas,date('Y-m-d', strtotime($rowCompromisos['fechaCargue'])),1,0,'C', 1);
		$pdf->Cell(22,$lineas,date('Y-m-d', strtotime($rowCompromisos['fechaLimite'])),1,0,'C', 1);
		$pdf->Cell(18,$lineas,'',1,1,'C', 1);

		$posY = $posY + $lineas;

		$pdf->Line(10, $posY, 200, $posY);

		if ($posY > 265)
		{
			$pdf->AddPage();

			$pdf->SetFillColor(221, 215, 212);
			$pdf->SetFont('Arial','B',$tamanioFuente - 3);
			$pdf->Cell(7,5,'No',1,0,'C', 1);
			$pdf->Cell(50,5,'Actividad',1,0,'C', 1);
			$pdf->Cell(13,5,'Avance',1,0,'C', 1);
			$pdf->Cell(35,5,'Responsable',1,0,'C', 1);
			$pdf->Cell(43,5,'Fecha Ejecución Propuesta',1,0,'C', 1);
			$pdf->Cell(18,5,'Fecha Cierre',1,1,'C', 1);

			$pdf->SetFont('Arial','',$tamanioFuente - 3);

			$pdf->Cell(7,5,'#',1,0,'C', 1);
			$pdf->Cell(50,5,'Descripción',1,0,'C', 1);
			$pdf->Cell(13,5,'%',1,0,'C', 1);
			$pdf->Cell(35,5,'Iniciales',1,0,'C', 1);
			$pdf->Cell(21,5,'Inicio',1,0,'C', 1);
			$pdf->Cell(22,5,'Fin',1,0,'C', 1);
			$pdf->Cell(18,5,'',1,1,'C', 1);

			$pdf->SetFont('Arial','',7);
			$pdf->SetFillColor(244, 241, 240);

			$posY = $pdf->GetY();
		}

		$idx++;
	}

	$pdf->SetDrawColor(0, 128, 255);
	$pdf->SetLineWidth(0.8);

	$pdf->Ln();

	$pdf->SetFillColor(153, 204, 255);
	$pdf->SetFont('Arial','B',$tamanioFuente - 3);
	$pdf->Cell(20,5,'Criterio',1,0,'C', 1);
	$pdf->Cell(15,5,'PC',1,0,'C', 1);
	$pdf->Cell(80,5,'Descripcion',1,0,'C', 1);
	$pdf->Cell(20,5,'Tipo Defecto',1,0,'C', 1);
	$pdf->Cell(15,5,'Total',1,0,'C', 1);
	$pdf->Cell(15,5,'%',1,1,'C', 1);

	$pdf->SetFillColor(229, 243, 255);

	$sql = "SELECT 
				resultadoauditoria.Criterio, 
			    resultadoauditoria.codigoNC, 
			    confPuntosControl_Subgrupos.Descripcion,
			    confPuntosControl_Subgrupos.tipoDefecto,
			    COUNT(resultadoauditoria.codigoNC) AS Cantidad 
			FROM 
				resultadoauditoria
			    INNER JOIN confPuntosControl_Subgrupos 
			    	ON confPuntosControl_Subgrupos.Criterio = resultadoauditoria.Criterio AND confPuntosControl_Subgrupos.codigo = resultadoauditoria.codigoNC
			    LEFT JOIN msc_Resultado ON msc_Resultado.idObra = resultadoauditoria.idObra AND msc_Resultado.Criterio = resultadoauditoria.Criterio AND msc_Resultado.codigoNC = resultadoauditoria.codigoNC AND msc_Resultado.codigoPoste = resultadoauditoria.codigoPoste
			WHERE 
				resultadoauditoria.idObra = '$idObra' 
				AND resultadoauditoria.Resultado = 'No Cumple'
				AND (msc_Resultado.Clasificacion = 'No Conforme' OR msc_Resultado.Clasificacion IS NULL)
			GROUP BY 
				resultadoauditoria.Criterio, 
			    resultadoauditoria.codigoNC,
			    confPuntosControl_Subgrupos.Descripcion,
			    confPuntosControl_Subgrupos.tipoDefecto
			ORDER BY
				resultadoauditoria.Criterio,
			    resultadoauditoria.codigoNC";

	$compromisos = $link->query(utf8_encode($sql));

	while ($rowCompromisos = mysqli_fetch_assoc($compromisos))
	{
		$renglones = ceil(strlen($rowCompromisos['Descripcion'])/80);
		$lineas = $renglones * 4;
		
		$pdf->SetFont('Arial','',$tamanioFuente - 3);

		$pdf->Cell(20,5, $rowCompromisos['Criterio'],1,0,'L', 1);
		$pdf->Cell(15,5, $rowCompromisos['codigoNC'] ,1,0,'L', 1);
		$pdf->Cell(80,5, $rowCompromisos['Descripcion'],1,0,'L', 1);
		$pdf->Cell(20,5, $rowCompromisos['tipoDefecto'],1,0,'L', 1);
		$pdf->Cell(15,5, $rowCompromisos['Cantidad'], 1,0,'L', 1);
		$pdf->Cell(15,5,'%',1,1,'L', 1);

		if ($posY > 265)
		{
			$pdf->AddPage();

			$pdf->SetFillColor(153, 204, 255);
			$pdf->SetFont('Arial','B',$tamanioFuente - 3);
			$pdf->Cell(20,5,'Criterio',1,0,'C', 1);
			$pdf->Cell(15,5,'PC',1,0,'C', 1);
			$pdf->Cell(80,5,'Descripcion',1,0,'C', 1);
			$pdf->Cell(20,5,'Tipo Defecto',1,0,'C', 1);
			$pdf->Cell(15,5,'Total',1,0,'C', 1);
			$pdf->Cell(15,5,'%',1,1,'C', 1);

			$pdf->SetFillColor(229, 243, 255);

			$posY = $pdf->GetY();
		}

	}

	$pdf->Ln();

	$pdf->Cell(0,5,'ESPACIO PARA FIRMAS',0,1,'C', 1);

	$idPar = 0;
	$idY = $pdf->GetY() + 30;

	$sql = "SELECT 
				Nombre, 
				Correo, 
				Cargo, 
				Empresa 
			FROM 
				obras_Contactos 
			WHERE 
				idObra = '$idObra' 
		UNION ALL
			SELECT 
				datosusuarios.Nombre, 
				datosusuarios.Correo, 
				datosusuarios.Cargo, 
				'WSP COLOMBIA SAS' AS Empresa 
			FROM
				datosusuarios
				INNER JOIN msc ON msc.idResponsable = datosusuarios.idLogin
			WHERE
				msc.idObra = '$idObra'";

	$contactos = $link->query($sql);

	$margenIdx = 10;

	while ($rowContactos = mysqli_fetch_assoc($contactos))
	{
		if ($idY > 255)
		{
			$pdf->AddPage();
			$idY = 60;
		}

		$pdf->SetY($idY);

		if ($idPar == 0)
		{
			$pdf->SetX(10);
			$margenIdx = 30;
			$idPar = 1;
		} else
		{
			$idY = $idY + 40;
			$pdf->SetX(110);
			$margenIdx = 110;
			$idPar = 0;
		}
		
		$pdf->SetX($margenIdx);
		$pdf->Cell(80,5,$rowContactos['Nombre'] ,0,1,'L');
		$pdf->SetX($margenIdx);
		$pdf->Cell(80,5,$rowContactos['Cargo'] ,0,1,'L');
		$pdf->SetX($margenIdx);
		$pdf->Cell(80,5,$rowContactos['Correo'] ,0,1,'L');
		$pdf->SetX($margenIdx);
		$pdf->Cell(120,5,$rowContactos['Empresa'] ,0,1,'L');

	}

	$pdf->Output();
?>
	
