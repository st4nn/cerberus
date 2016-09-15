<?php

	require('../../../assets/fpdf/fpdf.php');
	require('../conectar.php');
	$link = Conectar();

	$idObra = $_GET['id'];

	$pdf = new FPDF();
	$pdf->AddPage();

	$posX = 0;
	$posY = 17;

	$sql = "SELECT 
		obras_InformacionBasica.idObra,
		obras.Nombre AS Descripcion,
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
	$pdf->Cell(0,5,' ASEGURAMIENTO DE LA CALIDAD EN OBRAS DE DISTRIBUCIÓN ELECTRICIDAD (REDES MBT / LÍNEAS AT)',1,1,'C');

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
	$pdf->Cell(0,5,'DATOS GENERALES',1,1,'L', 1);

	$pdf->SetFillColor(219, 228, 255);
	$pdf->SetTextColor(0);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'N° Expediente',0,0,'L');
	$pdf->Cell(43,5,'',0,0,'C', 1);
	$pdf->Cell(23,5,'Tipo Obra:',0,0,'R');
	$pdf->Cell(43,5,$row['tipoObraDesc'],0,0,'L', 1);
	$pdf->Cell(23,5,'Municipio:',0,0,'R');
	$pdf->Cell(35,5,'',0,1,'C', 1);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Descripción',0,0,'L');
	$pdf->Cell(167,5,$row['Descripcion'],0,1,'L', 1);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Zona',0,0,'L');
	$pdf->Cell(72,5,'',0,0,'C', 1);
	$pdf->Cell(23,5,'Delegación',0,0,'R');
	$pdf->Cell(72,5,$row['Delegacion'],0,1,'L', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);
	$pdf->SetFillColor(255, 218, 179);
	$pdf->SetTextColor(128, 0, 0);
	$pdf->Cell(0,5,'DATOS de diseño y ejecucion de obra',1,1,'L', 1);
	$pdf->SetFillColor(219, 228, 255);
	$pdf->SetTextColor(0);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Ingeniería',0,0,'L');
	$pdf->Cell(70,5,'',0,0,'C', 1);
	$pdf->Cell(27,5,'Técnico Ingeniería',0,0,'R');
	$pdf->Cell(70,5,'',0,1,'C', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Trabajo',0,0,'L');
	$pdf->Cell(70,5,'',0,0,'C', 1);
	$pdf->Cell(27,5,'Estado',0,0,'R');
	$pdf->Cell(70,5,$row['estadoDes'],0,1,'L', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Tipo',0,0,'L');
	$pdf->Cell(70,5,$row['tipoObra'] ,0,1,'L', 1);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'GO (propio)',0,0,'L');
	$pdf->Cell(70,5,'',0,1,'C', 1);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'GO (Externo)',0,0,'L');
	$pdf->Cell(64,5,'',0,0,'C', 1);
	$pdf->Cell(33,5,'Empresa (GO externo)',0,0,'R');
	$pdf->Cell(70,5,'',0,1,'C', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Contratista',0,0,'L');
	$pdf->Cell(70,5,'',0,0,'C', 1);
	$pdf->Cell(27,5,'Jefe Obra:',0,0,'R');
	$pdf->Cell(70,5,'',0,1,'C', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Subcontrata',0,0,'L');
	$pdf->Cell(70,5,'',0,1,'C', 1);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(23,5,'Empresa CSS',0,0,'L');
	$pdf->Cell(70,5,'',0,0,'C', 1);
	$pdf->Cell(27,5,'CSS',0,0,'R');
	$pdf->Cell(70,5,'',0,1,'C', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);
	$pdf->SetFillColor(255, 218, 179);
	$pdf->SetTextColor(128, 0, 0);
	$pdf->Cell(0,5,'DATOS técnicos de la obra',1,1,'L', 1);
	$pdf->SetFillColor(219, 228, 255);
	$pdf->SetTextColor(0);

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(33,5,'LMTA (/AT) (km):',0,0,'R');
	$pdf->Cell(30,5,'',0,0,'C', 1);
	$pdf->Cell(33,5,'RBTA (km):',0,0,'R');
	$pdf->Cell(30,5,'',0,0,'C', 1);	
	$pdf->Cell(33,5,'CT (kVA):',0,0,'R');
	$pdf->Cell(30,5,'',0,1,'C', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(33,5,'LMTS (/AT) (km):',0,0,'R');
	$pdf->Cell(30,5,'',0,0,'C', 1);
	$pdf->Cell(33,5,'RBTS (km):',0,0,'R');
	$pdf->Cell(30,5,'',0,0,'C', 1);	
	$pdf->Cell(33,5,'Fecha inicio de Obra:',0,0,'R');
	$pdf->Cell(30,5,$row['fechaInicio'],0,1,'C', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);

	$pdf->Cell(33,5,'Aér./Subt/Mixt',0,0,'R');
	$pdf->Cell(30,5,'',0,0,'C', 1);
	$pdf->Cell(33,5,'MT/BT/Mixto:',0,0,'R');
	$pdf->Cell(30,5,'',0,0,'C', 1);	
	$pdf->Cell(33,5,'Fecha Fin de Obra:',0,0,'R');
	$pdf->Cell(30,5,$row['fechaInicio'],0,1,'C', 1);	

	$posY = $posY + 6;
	$pdf->setY($posY);
	$pdf->SetFillColor(255, 218, 179);
	$pdf->SetTextColor(128, 0, 0);
	$pdf->Cell(0,5,'COMPROBACIONES ESPECIFICAS de red aérea',1,1,'L', 1);
	$pdf->SetFillColor(219, 228, 255);
	$pdf->SetTextColor(0);

	$pdf->Cell(0,30,'Alturas',1,1,'L');
	$pdf->Cell(0,30,'Distancias',1,1,'L');

	$posY = $posY + 70;
	$pdf->setY($posY);
	$pdf->SetFillColor(255, 218, 179);
	$pdf->SetTextColor(128, 0, 0);
	$pdf->Cell(0,5,'COMPROBACIONES ESPECIFICAS de red subterránea',1,1,'L', 1);
	$pdf->SetFillColor(219, 228, 255);
	$pdf->SetTextColor(0);

	$pdf->Cell(0,30,'Profundidades',1,1,'L');
	$pdf->Cell(0,30,'Distancias',1,1,'L');


	$sql = "SELECT 
				SPLIT_STR(confPuntosControl_Subgrupos.codigo, '.', 1) AS Categoria,
				CAST(SPLIT_STR(confPuntosControl_Subgrupos.codigo, '.', 2) AS UNSIGNED) AS SubCategoria,
				confPuntosControl_Subgrupos.codigoPadre,
				confPuntosControl_Grupos.Descripcion AS descPadre,
				confPuntosControl_Subgrupos.Criterio,
				confPuntosControl_Subgrupos.codigo,
				confPuntosControl_Subgrupos.Descripcion,
				confPuntosControl_Subgrupos.tipoDefecto,
				count(resultadoauditoria.Resultado) AS Cantidad
			FROM
				confPuntosControl_Subgrupos
				LEFT JOIN confPuntosControl_Grupos ON confPuntosControl_Subgrupos.codigoPadre = confPuntosControl_Grupos.codigo AND confPuntosControl_Subgrupos.Criterio = confPuntosControl_Grupos.Criterio
				LEFT JOIN resultadoauditoria ON confPuntosControl_Subgrupos.codigo = resultadoauditoria.codigoNC AND confPuntosControl_Subgrupos.Criterio = resultadoauditoria.Criterio
			WHERE
				confPuntosControl_Subgrupos.codigoPadre <> 0
				AND confPuntosControl_Subgrupos.Criterio = 'Calidad'
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

	$result = $link->query(utf8_encode($sql));
	
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

		$renglones = ceil(strlen($row['Descripcion'])/62);

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


		$pdf->Cell(53, (4 * $renglones), $renglones . "->" .$posY . "->". strlen($row['Descripcion']) ,1,0,'L');
		$pdf->Cell(22, (4 * $renglones), $row['tipoDefecto'],1,1,'L');
		$posY = $posY + (4 * $renglones);

		$pdf->Line(10, $posY, 200, $posY);

		if ($posY > 265)
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
	
