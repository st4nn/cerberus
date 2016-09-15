ready_login();

function ready_login()
{
  $("#btnEntrar").on("click", frmLogin_submit);
  $("#frmLogin").on("submit", frmLogin_submit);

  /**
   * Fragmento para controlar si la sesión está activa
  **/

  var Usuario = JSON.parse(localStorage.getItem('wsp_cerberus'));  

  var objDate = 16;
  if (Usuario == null)
  {
    sessionFlag = false;
  } else
  {
    var objUser = JSON.parse(localStorage.getItem('wsp_cerberus'));
    var cDate = new Date();
    var sessionFlag = true;
  
    var pDate = new Date(objUser.cDate);
  
    objDate = cDate - pDate;  
  }

  
  if (Math.round((objDate/1000)/60) < 60 && sessionFlag)
  {
    objUser.cDate = cDate;
    localStorage.setItem("wsp_cerberus", JSON.stringify(objUser));    
    window.location.replace("aplicacion/index.html");
  } else
  {
    delete localStorage.wsp_cerberus;    
  }
}
/**
 * Evento que se llama cuando el usuario hace submit para Iniciar Sesión
**/
function frmLogin_submit(event)
{
  event.preventDefault();
  var cDate = new Date();

  $.post("server/php/proyectos/validarUsuario.php", 
    {
      pUsuario : $("#txtLogin_Usuario").val(),
      pClave : $("#txtLogin_Clave").val(),
      pFecha : cDate
    }, function (data)
    {
      if (data != 0)
      {
        localStorage.setItem("wsp_cerberus", JSON.stringify(data));  
        window.location.replace("aplicacion/index.html");
      } else
      {
        $(".alert").html("<strong>Error!</strong> Acceso denegado.");
        $(".alert").fadeIn(300).delay(2600).fadeOut(600);
      }
    }, 'json').fail(function()
    {
      $(".alert").html("<strong>Error!</strong> No hay acceso al Servidor, por favor revisa tu conexión a red.");
      $(".alert").fadeIn(300).delay(2600).fadeOut(600);
    });
}