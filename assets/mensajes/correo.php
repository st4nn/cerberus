<?php
require("class.phpmailer.php");

function EnviarCorreo($Destinatario, $Asunto, $Mensaje)
{
	
	
	$mail = new PHPMailer();
	$Destinatario .= ", cerberus@wspcolombia.com";
	$mail->SMTPAuth = true;
	$mail->Username = "cerberus@wspcolombia.com";
	$mail->Password = "holamundo"; 
	$mail->Host = "localhost";
	$mail->From = "cerberus@wspcolombia.com";
	$mail->FromName = utf8_decode("Sistema de Información Cerberus");
	$mail->Subject = utf8_decode($Asunto);
	$mail->AddAddress($Destinatario . ", cerberus@wspcolombia.com");
	
	$mail->Body = "<img src='http://wspsiso.com/css/imagenes/Logo.png' /><br />" . utf8_decode($Mensaje . "<br /><br /><span style='font-size:1.5em; color:white;background:black;'><strong>Este mensaje ha sido generado de forma automática, y las respuestas a esta cuenta no serán revisadas.</strong></span>");
	$mail->IsHTML(true);
	$mail->Send();
}	
?>
