<?php

date_default_timezone_set("America/Bogota");

require("class.phpmailer.php");

	function Correo($Asunto, $Destinatario, $Mensaje)
	{
		$Asunto = utf8_decode($Asunto);
		$Remitente = "cerberus@wspcolombia.com";
		$Destinatario = "cerberus@wspcolombia.com, " . $Destinatario;

		$mail = new PHPMailer();

		$mail->SMTPAuth = true;
		$mail->Username = "cerberus@wspcolombia.com";
		$mail->Password = "holamundo.8"; 
		$mail->Host = "localhost";
		$mail->From = $Remitente;
		$mail->FromName = utf8_decode("Sistema de Información Cerberus");
		$mail->Subject = $Asunto;
		$mail->AddAddress($Destinatario);
		
		$mail->Body = utf8_decode($Mensaje . "<br><br><span style='font-size:1.5em; color:white;background:black;'><strong>Este mensaje ha sido generado de forma automática, y las respuestas a esta cuenta no serán revisadas.</strong></span>");
		$mail->IsHTML(true);
		$mail->Send();
		
		$msg = "Mensaje enviado correctamente";
		
	}

?>
