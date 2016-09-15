<?php

	require('../../assets/fpdf/fpdf.php');
	require('../php/conectar.php');
	$link = Conectar();

	$idObra = $_GET['id'];

	$pdf = new FPDF();
	$pdf->AddPage();

	$posX = 0;
	$posY = 17;

	$sql = "SELECT 
		obras_InformacionBasica.idObra,
		obras.Nombre AS Descripcion,
		obras.codigoObra,
		obras_InformacionBasica.fechaInicio,
		obras_InformacionBasica.fechaFinalizacion,
		obras_InformacionBasica.Contratista,
		obras_InformacionBasica.idTipoObra,
		confTiposObra.Nombre AS tipoObra,
		obras.tipoObra AS tipoObraDesc,
		obras_InformacionBasica.Estado,
		confEstadosObra.Nombre AS estadoDes,
		obras_InformacionBasica.Alcances,
		obras_InformacionBasica.Direccion,
		obras_InformacionBasica.Vigilante,
		obras_InformacionBasica.Observaciones,
		obras_InformacionBasica.idResponsable,
		delegaciones.Nombre AS Delegacion,
		datosusuarios.Nombre AS Responsable,
		obras_InformacionBasica.fechaCreacion
	FROM 
		obras_InformacionBasica
		LEFT JOIN confTiposObra ON confTiposObra.idTipoObra = obras_InformacionBasica.idTipoObra
		LEFT JOIN confEstadosObra ON obras_InformacionBasica.Estado =  confEstadosObra.id
		INNER JOIN datosusuarios ON datosusuarios.idLogin = obras_InformacionBasica.idResponsable
		INNER JOIN obras ON obras.idObra = obras_InformacionBasica.idObra
		LEFT JOIN delegaciones ON delegaciones.idDelegacion = obras.idDelegacion
	WHERE
		obras_InformacionBasica.idObra = '$idObra'";

	$result = $link->query($sql);
	$row = $result->fetch_assoc();

	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(0,5,'AdC - INSPECCION INTERNA DE SEGURIDAD (ALEATORIA PARA SUPERVISION DE OBRAS EN RED)',1,1,'C');

	$pdf->setY($posY);

	$pdf->SetFillColor(219, 228, 255);

	$pdf->Cell(23,5,'Redactado por:',0,0,'R');
	$pdf->Cell(90,5,$row['Responsable'] ,0,0,'L', 1);
	$pdf->Cell(11,5,'Fecha:',0,0,'L');
	$pdf->Cell(30,5,'',0,0,'C', 1);
	$pdf->Cell(20,5,'Informe N°',0,0,'L');
	$pdf->Cell(16,5,'',0,1,'C', 1);

	$posY = 24;
	$pdf->setY($posY);

	$pdf->SetFillColor(255, 218, 179);
	$pdf->SetTextColor(128, 0, 0);
	$pdf->Cell(0,5,'DATOS GENERALES de trazabilidad y ubicación de la obra',1,1,'L', 1);

	$pdf->SetFillColor(219, 228, 255);
	$pdf->SetTextColor(0);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'N° GOR/SGT',0,0,'L');
	$pdf->Cell(43,5,'',0,0,'C', 1);
	$pdf->Cell(23,5,'N° OBRA:',0,0,'R');
	$pdf->Cell(43,5,$row['codigoObra'],0,0,'L', 1);
	$pdf->Cell(23,5,'Municipio:',0,0,'R');
	$pdf->Cell(35,5,'',0,1,'C', 1);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Dirección',0,0,'L');
	$pdf->Cell(167,5,'',0,1,'L', 1);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Zona',0,0,'L');
	$pdf->Cell(63,5,'',0,0,'C', 1);
	$pdf->Cell(32,5,'Comunidad Autónoma',0,0,'R');
	$pdf->Cell(72,5,'',0,1,'L', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Deleg. /SS.TT.',0,0,'L');
	$pdf->Cell(63,5,$row['Delegacion'] ,0,0,'J', 1);
	$pdf->Cell(32,5,'Calificación Visita:',0,0,'R');
	$pdf->Cell(72,5,'',0,1,'L', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);
	$pdf->SetFillColor(255, 218, 179);
	$pdf->SetTextColor(128, 0, 0);
	$pdf->Cell(0,5,'DATOS de direccion y ejecucion de obra',1,1,'L', 1);
	$pdf->SetFillColor(219, 228, 255);
	$pdf->SetTextColor(0);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'GO (propio):',0,0,'L');
	$pdf->Cell(70,5,'',0,0,'C', 1);
	$pdf->Cell(27,5,'TC',0,0,'R');
	$pdf->Cell(70,5,'',0,1,'C', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'GO/DF (externo)',0,0,'L');
	$pdf->Cell(60,5,'',0,0,'C', 1);
	$pdf->Cell(37,5,'Empresa (GO/DF externo)',0,0,'R');
	$pdf->Cell(70,5,'',0,1,'L', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Contratista',0,0,'L');
	$pdf->Cell(70,5,$row['Contratista'],0,0,'L', 1);
	$pdf->Cell(27,5,'Jefe Obra:',0,0,'R');
	$pdf->Cell(70,5,'',0,1,'C', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Subcontrata',0,0,'L');
	$pdf->Cell(70,5,'',0,0,'C', 1);
	$pdf->Cell(27,5,'Soldador PE/Ac:',0,0,'R');
	$pdf->Cell(70,5,'',0,1,'C', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Empresa CSS',0,0,'L');
	$pdf->Cell(70,5,'',0,0,'C', 1);
	$pdf->Cell(27,5,'CSS',0,0,'R');
	$pdf->Cell(70,5,'',0,1,'C', 1);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Promotor (urb)',0,0,'L');
	$pdf->Cell(70,5,'',0,1,'C', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);
	$pdf->Cell(0,5,'ASPECTOS DESTACABLES',1,1,'C', 0);
	$pdf->Cell(0,70,'',1,1,'L');
	$posY = $posY + 6;
	$pdf->setY($posY);

	$posY = $posY + 76;
	$pdf->setY($posY);
	$pdf->Cell(40,5,'ITEM',1,0,'C', 0);
	$pdf->Cell(150,5,'OBSERVACIONES',1,1,'C', 0);

	$pdf->Cell(40,10,'',1,0,'C', 0);
	$pdf->Cell(150,10,'',1,1,'L', 0);
	$pdf->Cell(40,10,'',1,0,'C', 0);
	$pdf->Cell(150,10,'',1,1,'L', 0);
	$pdf->Cell(40,10,'',1,0,'C', 0);
	$pdf->Cell(150,10,'',1,1,'L', 0);
	$pdf->Cell(40,10,'',1,0,'C', 0);
	$pdf->Cell(150,10,'',1,1,'L', 0);
	$pdf->Cell(40,10,'',1,0,'C', 0);
	$pdf->Cell(150,10,'',1,1,'L', 0);
	$pdf->Cell(40,10,'',1,0,'C', 0);
	$pdf->Cell(150,10,'',1,1,'L', 0);
	$pdf->Cell(40,10,'',1,0,'C', 0);
	$pdf->Cell(150,10,'',1,1,'L', 0);
	$pdf->Cell(40,10,'',1,0,'C', 0);
	$pdf->Cell(150,10,'',1,1,'L', 0);
	
	

	$sql = "SELECT 
				SPLIT_STR(confPuntosControl_Subgrupos.codigo, '.', 1) AS Categoria,
				CAST(SPLIT_STR(confPuntosControl_Subgrupos.codigo, '.', 2) AS UNSIGNED) AS SubCategoria,
				confPuntosControl_Subgrupos.codigoPadre,
				confPuntosControl_Grupos.Descripcion AS descPadre,
				confPuntosControl_Subgrupos.Criterio,
				confPuntosControl_Subgrupos.codigo,
				confPuntosControl_Subgrupos.Descripcion,
				confPuntosControl_Subgrupos.tipoDefecto,
				group_concat(DISTINCT soportes.Observaciones) AS Observaciones,
				count(DISTINCT resultadoauditoria.codigoPoste) AS Cantidad
			FROM
				confPuntosControl_Subgrupos
				LEFT JOIN confPuntosControl_Grupos ON confPuntosControl_Subgrupos.codigoPadre = confPuntosControl_Grupos.codigo AND confPuntosControl_Subgrupos.Criterio = confPuntosControl_Grupos.Criterio
				LEFT JOIN resultadoauditoria ON confPuntosControl_Subgrupos.codigo = resultadoauditoria.codigoNC AND confPuntosControl_Subgrupos.Criterio = resultadoauditoria.Criterio
				LEFT JOIN soportes ON resultadoauditoria.codigoNC = soportes.codigoNC AND resultadoauditoria.Criterio = soportes.Criterio AND resultadoauditoria.codigoPoste = soportes.codigoPoste AND soportes.idObra = '$idObra'
			WHERE
				confPuntosControl_Subgrupos.codigoPadre <> 0
				AND confPuntosControl_Subgrupos.Criterio = 'Seguridad'
				AND (resultadoauditoria.idObra = '$idObra' OR resultadoauditoria.idObra IS NULL)
			GROUP BY
				Categoria,
				SubCategoria,
				confPuntosControl_Subgrupos.codigoPadre,
				descPadre,
				confPuntosControl_Subgrupos.Criterio,
				confPuntosControl_Subgrupos.codigo,
				confPuntosControl_Subgrupos.Descripcion,
				confPuntosControl_Subgrupos.tipoDefecto
			ORDER BY
				confPuntosControl_Subgrupos.Criterio,
				Categoria, 
				SubCategoria,
			confPuntosControl_Subgrupos.id";

	$result = $link->query($sql);
	
	$pdf->AddPage();
	$posY = 20;

	$pdf->SetFillColor(229, 236, 255);
	$pdf->SetTextColor(0);
	

	$tmpPadre = "";

	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(0,5,'Resultado de inspección',1,1,'C');

	$pdf->Cell(15,5,'N°',1,0,'C');
	$pdf->Cell(90,5,'ASPECTOS INSPECCIONADOS',1,0,'C');
	$pdf->Cell(10,5,'Cant',1,0,'C');
	$pdf->Cell(53,5,'Observaciones',1,0,'C');
	$pdf->Cell(22,5,'Tipo de defecto',1,1,'C');

	$pdf->SetFont('Arial','',7);

	
	while ($row = mysqli_fetch_assoc($result))
	{
		if ($tmpPadre <> $row['Categoria'])
		{
			$pdf->SetFont('Arial','B',8);
			$pdf->SetFillColor(219, 228, 255);
			$pdf->Cell(15,5, $row['Categoria'] ,1,0,'L', 1);
			$pdf->Cell(175,5, $row['descPadre'] ,1,1,'L', 1);

			$pdf->SetFont('Arial','',7);
			$tmpPadre = $row['Categoria'];

			$posY = $posY + 5;
		}

		$pdf->Line(10, $posY, 200, $posY);
		
		if (ceil(strlen($row['Observaciones'])/42) > ceil(strlen($row['Descripcion'])/62))
		{
			$renglones = ceil(strlen($row['Observaciones'])/42);
		} else
		{
			$renglones = ceil(strlen($row['Descripcion'])/62);
		}

		$pdf->Cell(15,(4 * $renglones), $row['codigo'] ,1,0,'L');
		$pdf->MultiCell(90, 4, $row['Descripcion'], 0,'L');
		
		$pdf->SetXY(115,$posY);

		$relleno = 0;
		if ($row['Cantidad'] > 0)
		{
			$pdf->SetFillColor(255,204,204);
			$relleno = 1;
		}
		$pdf->Cell(10, (4 * $renglones), $row['Cantidad'] ,1,0,'L', $relleno);


		//$pdf->Cell(53, (4 * $renglones), $renglones . "->" .$posY . "->". strlen($row['Descripcion']) ,1,0,'L');
		$pdf->MultiCell(53, 4, $row['Observaciones'], 0,'L');
		$pdf->SetXY(178,$posY);
		$pdf->Cell(22, (4 * $renglones), $row['tipoDefecto'],1,1,'L');
		$posY = $posY + (4 * $renglones);

		$pdf->Line(10, $posY, 200, $posY);

		if ($posY > 260)
		{
			$pdf->AddPage();
			$pdf->SetFont('Arial','B',8);
			$pdf->Cell(0,5,'Resultado de inspección',1,1,'C');

			$pdf->Cell(15,5,'N°',1,0,'C');
			$pdf->Cell(90,5,'ASPECTOS INSPECCIONADOS',1,0,'C');
			$pdf->Cell(10,5,'Cant',1,0,'C');
			$pdf->Cell(53,5,'Observaciones',1,0,'C');
			$pdf->Cell(22,5,'Tipo de defecto',1,1,'C');

			$pdf->SetFont('Arial','',7);

			$posY = 20;
		}
	}

	$pdf->Output();
?>
	
