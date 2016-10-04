var repMap = null;
var Markers = null;
var tmpLastMarker = null;

function Inicio()
{
  cargarModulo("Inicio.html", "Trabajo Programado", inicio_ActualizarProyectos);
  $("#lblNombreUsuario").text(Usuario.nombre);
  sincronizarRecoleccion();
  setInterval(sincronizarRecoleccion, 900000);
}

$.fn.llenarCombo = function(data, callback)
{
  if (callback === undefined)
    {callback = function(){};}

  var elemento = $(this);
      var tds = "";
      $.each(data, function(index, val) 
      {
         tds += '<option value="' + val.id + '">' + val.Nombre + '</option>';
      });
  elemento.append(tds);
  callback();
}

cargarDatosConf = function(Pagina, callback, datos)
{
  if (callback === undefined)
    {callback = function(){};}

  datos = datos || {Usuario: Usuario.id};

  $.post('../server/php/proyecto/' + Pagina + '.php', datos, function(data, textStatus, xhr) 
  {
    if (data != 0)
    {
      callback(data);
    }
  }, "json").fail(function()
  {
    Mensaje("Error", "No hay conexión al Servidor, por favor actualice la página", "danger");
  });
}


function Levantamiento()
{
  $("#btnFormLevantamiento_TomarCoordenadas").on("click", function(evento)
  {
    evento.preventDefault();
    textObtenerCoordenadas(function(lat, lon, calidad)
    {
      $("#txtLevantamiento_CoordX").val(lat);
      $("#txtLevantamiento_CoordY").val(lon);
      $("#txtLevantamiento_CoordQ").val(calidad);

      if (calidad > 5)
      {
        Mensaje("Hey", calidad + " no es una muy buena calidad, es recomendable intentarlo nuevamente" ,"danger");
      }

    })
  });

  $("#btnLevantamiento_Foto").on("click", function()
  {
    abrirCamara();
  });

  $("#btnLevantamiento_Galeria").on("click", function()
  {
    abrirCamara(0, function(uri)
      {
        console.log("uri");
      });
  });

  $("#frmLevantamiento").on("submit", function(evento)
  {
    evento.preventDefault();
    levantamiento_Guardar();
  });

  $("#btnLevantamiento_NuevoProducto").on("click", function(evento)
    {
      evento.preventDefault();
      levantamiento_Guardar(function()
      {
        $("#frmLevantamiento")[0].reset();
        $("#lblLevantamiento_TramoAnterior").text("");
        $("#txtLevantamiento_Tramo").val("");
        levantamiento_NuevoCodigo();
        window.scrollTo(0, 0);
      });
    });

  $("#btnLevantamiento_Tramo").on("click", function(evento)
        {
          evento.preventDefault();
          var dato = parseInt($("#lblLevantamiento_CodPunto").text()) - 1;
          var r = prompt("Ingrese el codigo del Punto anterior", CompletarConCero(dato, 3));
          $("#lblLevantamiento_TramoAnterior").text(r);
          $("#txtLevantamiento_Tramo").val(r);
        });
}

function crearProyecto()
{
  $("#frmCrearProyecto").on("submit", function(evento)
  {
    evento.preventDefault();
    $("#txtCrearProyecto_idProyecto").val(obtenerPrefijo());
    $("#frmCrearProyecto").generarDatosEnvio("txtCrearProyecto_", function(datos)
      {
        //datos = JSON.parse(datos);
        
        $.post('../server/php/proyecto/crearProyecto.php', {datos: datos, Usuario: Usuario.id}, function(data, textStatus, xhr) 
        {
          if (parseInt(data) == 1)
          {
            Mensaje("", "El proyecto ha sido guardado");
            $("#frmCrearProyecto")[0].reset();
          } else
          {
            Mensaje("", data);
          }
        }).fail(function()
        {
          Mensaje("Error", "No se puede guardar el proyecto, No hay conexión al servidor", "danger");
        });
      });
  });

  if ($(window).width() > 767)
  {
    $("#frmCrearProyecto .datepicker").datepicker({'autoclose' : true});
  }

  cargarDatosConf("cargarUsuarios", function(data)
    {
      $("#txtCrearProyecto_Responsable").llenarCombo(data, function()
        {
          $("#txtCrearProyecto_Responsable").val(Usuario.id) ;
        });
    });

  cargarDatosConf("cargarZonas", function(data)
    {
      $("#txtCrearProyecto_Zona").llenarCombo(data);  
    });

  cargarDatosConf("cargarEmpresas", function(data)
    {
      $("#txtCrearProyecto_Empresa").llenarCombo(data);  
    });

  cargarDatosConf("cargarUnitarios", function(data)
    {
      $("#txtCrearProyecto_Item").llenarCombo(data);  
    });

  
}

function modInicio()
{
  modInicio_CargarGraficas();
  $("#btnInicio_Actualizar").on("click", function()
  {
    modInicio_CargarGraficas();
  });

}
function modInicio_CargarGraficas()
{
  $("#imgInicio_Cargando").show();
  var fecha = obtenerFecha().substr(0, 10);
  $.post('../server/php/proyecto/cargarProyectosDia.php', {Usuario : Usuario.id, Fecha:fecha}, function(data, textStatus, xhr) 
  {
    var Postes = 0;
    var Fotos = 0;
    var arrObj = [];
    var arrLabels = [];
    $.each(data, function(index, val) 
    {
       Postes += parseInt(val.Postes);
      Fotos += parseInt(val.Fotos);

       arrLabels.push(index + 1);
       arrObj.push(parseInt(val.Postes));

       $("#lblInicio_Proyectos").text(val.Proyectos);
    });

       new Chartist.Line("#widgetLinepoint .ct-chart", {
      labels: arrLabels,
      series: [
        arrObj
        ]
      }, {
          low: 0,
          showArea: true,
          showPoint: true,
          showLine: true,
          fullWidth: true,
          lineSmooth: true,
          chartPadding: {
            top: 10,
            right: 0,
            bottom: 10,
            left: 0
          },
          axisX: {
            showLabel: false,
            showGrid: false,
            offset: 0
          },
          axisY: {
            showLabel: false,
            showGrid: false,
            offset: 0
          },
          plugins: [
            Chartist.plugins.tooltip()
          ]
        });


    $("#lblInicio_Postes").text(Postes);
    $("#lblInicio_Fotos").text(Fotos);
  }, "json");

  $.post('../server/php/proyecto/cargarProyectosSemana.php', {Usuario : Usuario.id, Fecha:fecha}, function(data, textStatus, xhr) 
  {
    var Postes = 0;
    var Fotos = 0;
    var Proyectos = 0;
    var arrObj = [];
    var arrLabels = [];
    $.each(data, function(index, val) 
    {
       Postes += parseInt(val.Postes);
        Fotos += parseInt(val.Fotos);

       arrLabels.push(val.Dia);
       arrObj.push(parseInt(val.Postes));

       $("#lblInicio_ProyectosM").text(val.Proyectos);
    });

       new Chartist.Bar("#widgetSaleBar .ct-chart", {
          labels: arrLabels,
          series: [
            arrObj
          ]
        }, {
          low: 0,
          fullWidth: true,
          chartPadding: {
            top: 0,
            right: 20,
            bottom: 30,
            left: 20
          },
          axisX: {
            showLabel: false,
            showGrid: false,
            offset: 0
          },
          axisY: {
            showLabel: false,
            showGrid: false,
            offset: 0
          },
          plugins: [
            Chartist.plugins.tooltip()
          ]
        });
    

    $("#lblInicio_PostesM").text(Postes);
    $("#lblInicio_FotosM").text(Fotos);
    $("#imgInicio_Cargando").hide();
  }, "json");
}
function inicio_ActualizarProyectos()
{
  ejecutarSQL("SELECT * FROM Proyectos", [], function(fila)
        {
          if (fila.length > 0)
          {
            $("#cntInicio_Proyectos li").remove();
            tds = "";
            $.each(fila, function(index, val) 
            {
                tds += '<li class="list-group-item height-50 btnInicio_Proyecto btn text-left" Filtro="' + val.Nombre + '" id="' + val.idProyecto + '">';
                  tds += '<span class=""><i class="icon wb-chevron-right-mini" aria-hidden="true"></i></span>' + val.Nombre;
                tds += '</li>';
            });
            $("#cntInicio_Proyectos").append(tds);
          } else
          {
            Mensaje("Ok", "No hay proyectos para mostrar", "danger");
          }
        });
}

function levantamiento_Guardar(callback)
{
  if (callback === undefined)
  { callback = function(){};}

  if ($("#txtLevantamiento_CoordX").val() == "")
  {
    Mensaje("Error", "Las coordenadas no pueden estar vacías", "danger");
    $("#txtLevantamiento_CoordX").focus();
  } else
  {
    $("#frmLevantamiento").generarDatosEnvio("txtLevantamiento_", function(datos)
      {
        var idProyecto = $("#txtLevantamiento_idProyecto").val();
        var CodPoste = $("#txtLevantamiento_CodPoste").val();
        var Coordenadas = $("#txtLevantamiento_CoordX").val() + "#" + $("#txtLevantamiento_CoordY").val() + "#" + $("#txtLevantamiento_CoordQ").val()
          var jDatos = JSON.parse(datos);
          ejecutarSQL("SELECT * FROM Levantamiento WHERE idProyecto = ? AND codPoste = ?", [idProyecto, CodPoste], 
            function(Levantamientos)
            {
              var Prefijo = obtenerPrefijo();
              var Fecha = obtenerFecha();

              if (Levantamientos.length > 0)
              {
                ejecutarInsert("UPDATE Levantamiento SET coordenadas = ?, Usuario = ?, fecha = ?, Sincronizacion = ?, Datos = ? WHERE idProyecto = ? AND codPoste = ?", 
                  [Coordenadas, Usuario.id, Fecha, "Enviar", datos, idProyecto, CodPoste], function()
                  {
                    Mensaje("Hey", "Registro Actualizado", "success");
                    callback();
                  });
              } else
              {
                ejecutarInsert("INSERT INTO Levantamiento (Prefijo, idProyecto, codPoste, coordenadas, Usuario, fecha, Sincronizacion, Datos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                  [Prefijo, idProyecto, CodPoste, Coordenadas, Usuario.id, Fecha, "Enviar", datos], function()
                  {
                    Mensaje("Hey", "Registro ingresado", "success");
                    callback();
                  });
              }
            });
      });
  }
}

function levantamiento_NuevoCodigo()
{
  ejecutarSQL("SELECT COUNT(*) AS Cantidad FROM Levantamiento WHERE idProyecto = ?", [$("#txtLevantamiento_idProyecto").val()], function(dato)
    {
      dato = dato[0].Cantidad;
      $("#lblLevantamiento_CodPunto").text( CompletarConCero((dato + 1), 3));
      $("#txtLevantamiento_CodPoste").val( CompletarConCero((dato + 1), 3));
    });
}



function sincronizarRecoleccion()
{
  ejecutarSQL("SELECT * FROM Levantamiento WHERE Sincronizacion = ?", ["Enviar"], function(Lev)
    {
      if (Lev.length > 0)
      {
        $.each(Lev, function(index, val) 
        {
          $.post("http://orion.wsppb-latam.com/server/php/movil/crearLevantamiento.php", {datos: val}, function(data, textStatus, xhr) 
          {
            if (data == 1)
            {
              ejecutarInsert("UPDATE Levantamiento SET Sincronizacion = ? WHERE Prefijo = ?", ["Enviado", val.Prefijo]);
            }
          }).fail(function()
          {

          });
        });
      }
    });

  ejecutarSQL("SELECT * FROM Proyectos WHERE Sincronizacion = ?", ["Enviar"], function(Lev)
    {
      if (Lev.length > 0)
      {
        $.each(Lev, function(index, val) 
        {
          $.post("http://orion.wsppb-latam.com/server/php/movil/crearProyecto.php", {datos: val}, function(data, textStatus, xhr) 
          {
            if (data == 1)
            {
              ejecutarInsert("UPDATE Proyectos SET Sincronizacion = ? WHERE idProyecto = ?", ["Enviado", val.idProyecto]);
            }
          }).fail(function()
          {
            
          });
        });
      }
    });
}

function reportes_Basico()
{
  $("#txtReportes_Desde").val(sumarFecha(obtenerFecha().replace(" ", "T") + "Z", -7));
  $("#txtReportes_Desde, #txtReportes_Hasta").datepicker({'autoclose' : true});
  reportes_Basico_cargarProyectos();

  $("#btnReportes_Actualizar").on("click", function(evento)
  {
    evento.preventDefault();
    reportes_Basico_cargarProyectos();
  });

  $("#txtReportes_Filtrar").on("change keyup paste", function()
  {
    var valor = $("#txtReportes_Filtrar").val().replace(/ /gi, "\\ ");
    $(".btnReporte_Proyecto").addClass('hide');
    if (valor != "")
    {
      var obj = $(".btnReporte_Proyecto[filtro*=" + valor.toLowerCase() + "]");
      $(obj).removeClass('hide');

    } else
    {
      $(".btnReporte_Proyecto").removeClass('hide');
    }
  });

  $(document).delegate('.btnReporte_Proyecto', 'click', function(event) 
  {
    var titulo = $(this).find("nombre").text();
    var idProyecto = $(this).attr("id");
    var NomProyecto = $(this).attr("Filtro");
    
    cargarModulo("reportes/repLevantamiento.html", titulo, function()
      {
        $("#lblNomProyecto").text(NomProyecto);
        $("#lblReporte_NomProyecto").text(titulo);
        $("#txtReporte_idProyecto").val(idProyecto);

        $.post('../server/php/proyecto/cargarProyecto.php', {idProyecto: idProyecto, Usuario : Usuario.id}, function(data, textStatus, xhr) 
        {
          $("#lblReporte_ProyectoNombre").text(data.Nombre);
          $("#lblReporte_ProyectoCodigo").text(data.Codigo);
          $("#lblReporte_ProyectoDescripcion").text(data.Descripcion);
          $("#lblReporte_ProyectoUnitario").text(data.Unitario);

          $("#lblReporte_ProyectoCreador").text(data.NomCreador);
          $("#lblReporte_ProyectoResponsable").text(data.NomResponsable);

          $("#lblReporte_ProyectoPostes").text(data.Postes);
          $("#lblReporte_ProyectoFotos").text(data.Fotos);

          $("#lblReporte_ProyectoFechaCreacion").text(data.Fecha);
          if (data.fechaEntrega == "")
          {
            $("#lblReporte_ProyectoFechaEntrega").text("(Prevista): " + data.fechaPrevEntrega);
          } else
          {
            $("#lblReporte_ProyectoFechaEntrega").text(": " + data.fechaEntrega);
          }

        }, "json");
        repLevantamiento();
      });  
  });

  $(document).delegate('.btnReporte_Volver', 'click', function(event) 
  {
    $("#bntReporte_AbrirMapa").trigger('click');
    cargarModulo("reportes/basico.html", "Reporte");
  });

}

function reportes_Basico_cargarProyectos()
{
  $("#imgReportes_Cargando").show();
  $("#cntReportes_Proyectos div").remove();
  
  fechaIni = $("#txtReportes_Desde").val();
  fechaFin = $("#txtReportes_Hasta").val();

  $.post('../server/php/proyecto/cargarProyectos.php', {Usuario : Usuario.id, fechaIni : fechaIni, fechaFin : fechaFin}, function(data, textStatus, xhr) 
  {
    if (data.length > 0)
    {
      var tds = "";

      var rojoPostes = "";
      var rojoFotos = "";
      var par = "";
      $.each(data, function(index, val) 
      {
        par = "";
        rojoFotos = "";
        rojoPostes = "";

        if (index%2 > 0)
        {
          par = "par";
        }

        if (val.Postes == 0)
        {
          rojoPostes = "red-600";
        }

        if (val.Fotos == 0)
        {
          rojoFotos = "red-600";
        }

        tds += '<div class="col-md-6 btnReporte_Proyecto row text-left ' + par + '" Filtro="' + val.Nombre.toLowerCase() + ' ' + val.Descripcion.toLowerCase() + '" id="' + val.idProyecto + '">';
          tds += '<div class="col-xs-8 col-md-6"';
            tds += '<span class=""><i class="icon wb-chevron-right-mini" aria-hidden="true"></i></span><strong><nombre>' + val.Nombre + '</nombre></strong>';
            tds += '<br><i>' + val.Descripcion + '</i>';
            tds += '<br><b> ' + val.NomCreador + ' </b><small><i> (' + val.Fecha + ') </i></small>';
          tds += '</div>';
          tds += '<div class="col-xs-4 col-md-6 row">';
            tds += '<div class="col-xs-6 col-md-6">';
              tds += '<div class="widget">';
                tds += '<div class="widget-content padding-25 bg-white">';
                  tds += '<div class="counter counter-lg">';
                    tds += '<span class="counter-number ' + rojoPostes + '">' + val.Postes + '</span>';
                    tds += '<div class="counter-label text-uppercase">Postes</div>';
                  tds += '</div>';
                tds += '</div>';
              tds += '</div>';
            tds += '</div>';
            tds += '<div class="col-xs-6 col-md-6">';
              tds += '<div class="widget">';
                tds += '<div class="widget-content padding-25 bg-white">';
                  tds += '<div class="counter counter-lg">';
                    tds += '<span class="counter-number ' + rojoFotos + '">' + val.Fotos + '</span>';
                    tds += '<div class="counter-label text-uppercase">Fotos</div>';
                  tds += '</div>';
                tds += '</div>';
              tds += '</div>';
            tds += '</div>';
          tds += '</div>';
        tds += '</div>';
      });
      $("#cntReportes_Proyectos").append(tds);
      $("#txtReportes_Filtrar").trigger('change');
      $("#imgReportes_Cargando").hide();
    } else
    {
      $("#imgReportes_Cargando").hide();
      Mensaje("Hey", "No hay datos para mostrar", "danger");
      
    }
  }, "json");
}
function modRepLevantamiento()
{
  $('#bntReporte_AbrirTabla').on("click", function()
  {
    $("#cntReporte_Tabla table").crearDataTable("");
    
  });

  $("#btnReporte_Archivos_DescargarTodos").on("click", function(evento)
  {
     evento.preventDefault();
     $("#imgReporte_Archivos_Cargando").show();
    $.post('../server/php/proyecto/crearZIP.php', {idProyecto: $("#txtReporte_idProyecto").val()}, function(data, textStatus, xhr) 
    {
      $("#imgReporte_Archivos_Cargando").hide();
      console.log(textStatus);
      console.log(xhr);
      if (data != 0)
      {
        document.location=data;
      } else
      {
        Mensaje("Error", "Hubo un error en la descarga: " + data, "danger");
      }
    }).fail(function()
    {
      $("#imgReporte_Archivos_Cargando").hide();
    });
  });

  $("#btnReporte_DescargarKML").on("click", function(evento)
  {
    evento.preventDefault();
    $.post('../server/php/proyecto/crearKML.php', {idProyecto: $("#txtReporte_idProyecto").val()}, function(data, textStatus, xhr) 
    {
      if (data != 0)
      {
        //abrirURL(data);
        document.location=data;
      } else
      {
        Mensaje("Error", "Hubo un error en la descarga", "danger");
      }
    });
  });

  $(document).delegate('.btnReporte_ArchivosEliminar', 'click', function(event) 
  {
    event.preventDefault();

    var obj = this;

    alertify.set({"labels" : {"ok" : "Si, Borrar", "cancel" : "No, Volver"}});
    alertify.confirm("Confirma que desea borrar este elemento?", function (ev) 
    {
      if (ev)
      {
        var ruta = $(obj).parent("h4").find("[href]");
        ruta = $(ruta).attr("href");
        
        $.post("../server/php/eliminarArchivo.php", {ruta: ruta}, function(data)
        {
          if (data == 1)
          {
            $(obj).parent("h4").parent("div").parent("div").parent("li").remove();
          } else
          {
            Mensaje("Error", data);
          }

        })
      } 
    });
  });

  $(document).delegate(".inputControl", "change" ,function()
    {
      var contenedor = $(this).parent("span").parent("span").parent("div");
      var texto = $(contenedor).find(".inputText");
      var archivo = $(this).val();
      archivo = archivo.split("\\");
      archivo = archivo[(archivo.length - 1)];
      $(texto).val(archivo);
      var barra = $(contenedor).parent("form").find(".progress-bar");
      var percentVal = '0%';
      $(barra).width(percentVal);
      $(barra).text(percentVal);
    });

  $("#frmReporte_Archivos").ajaxForm(
  {
    beforeSend: function() 
    {
        var percentVal = '0%';
        $("#txtReporte_ArchivoProgreso").width(percentVal);
        $("#txtReporte_ArchivoProgreso").text(percentVal);
    },
    uploadProgress: function(event, position, total, percentComplete) {
        
        var percentVal = percentComplete + '%';
        $("#txtReporte_ArchivoProgreso").width(percentVal);
        $("#txtReporte_ArchivoProgreso").text(percentVal);
    },
    success: function() {
        var percentVal = '100%';
        $("#txtReporte_ArchivoProgreso").width(percentVal);
        $("#txtReporte_ArchivoProgreso").text(percentVal);
    },
    complete: function(xhr) {
      var respuesta = xhr.responseText;
      if (respuesta.substring(0, 8) == "Archivos")
          {
            var tds = "";
            var arrArchivo = respuesta.split("/");
            var arrExt = arrArchivo[arrArchivo.length - 1].split(".");
            var nomArchivo = arrArchivo[arrArchivo.length - 1];
            var ext = arrExt[arrExt.length - 1];

              tds += '<li class="list-group-item">';
                tds += '<div class="media">';
                  tds += '<div class="media-left">';
                    tds += '<a class="avatar" href="javascript:void(0)">';
                      tds += '<img src="../assets/images/fileIcons/' + ext.toLowerCase() + '.png" alt=""></a>';
                  tds += '</div>';
                  tds += '<div class="media-body">';
                    tds += '<h4 class="media-heading">';
                      tds += '<a class="name" href="../server/php/' + respuesta + '" target="_blank">' + nomArchivo + '</a>';
                      tds += '<a class="btn btn-danger pull-right btnReporte_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
                    tds += '</h4>';
                  tds += '</div>';
                tds += '</div>';
              tds += '</li>';

            $("#cntReporte_Archivos").prepend(tds);
          } else
          {
            Mensaje("Error","Hubo un Error, " + respuesta, "danger");
          }
     }
  }); 

}
function repLevantamiento()
{
  
  if (repMap != null)
  {
    repMap.removeMarkers();
  }

  $("#cntReporte_Tabla table").remove();
  $("#cntReporte_Tabla div").remove();
  $("#cntReporte_btnPostes div").remove();
  $("#cntReporte_Fotos li").remove();

  iniciarMapa();

  var tmpContador = "";

  $.post('../server/php/proyecto/cargarFotos.php', {Usuario : Usuario.id, idProyecto : $("#txtReporte_idProyecto").val(), codPoste :  ""}, 
    function(fotos, textStatus, xhr) 
    {
      tds = "";
      var idx = 0;

      if (fotos != 0)
      {
        $.each(fotos, function(index, val) 
        {
          if (tmpContador != val.idRecurso)
          {
            $("#cntReporte_Fotos_" + tmpContador).magnificPopup(
            {
              delegate: 'a', 
              type: 'image', 
              gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] 
            }});

            tmpContador = val.idRecurso;
            idx = 0;

            tds = '<li class="list-group-item">';
              tds += '<div class="media">';
                tds += '<div class="media-body">';
                  tds += '<h4 class="media-heading">' + val.nomUsuario;
                    tds += '<span> <span id="lblReporte_CantFotos_' + val.idRecurso + '" class="badge badge-radius badge-info">0</span> fotos del ' + val.idRecurso + '</span>';
                  tds += '</h4>';
                  tds += '<small id="id="lblReporte_Fecha_' + val.idRecurso + '">' + val.fechaCargue + '</small>';
                  tds += '<div id="cntReporte_Fotos_' + val.idRecurso + '" class="col-md-12">';
                  tds += '</div>';
                tds += '</div>';
              tds += '</div>';
            tds += '</li>';

            $("#cntReporte_Fotos").append(tds);
          }
          idx++;

          $("#lblReporte_CantFotos_" + val.idRecurso).text(idx);
          $("#lblReporte_Fecha_" + val.idRecurso).text(val.fechaCargue);
            tds = '<a class="inline-block margin-5" href="../server/php/Archivos/' + val.Ruta + '">';
              tds += '<img class="img-responsive margin-top-5 imgReporte_FotoZoomIn" style="border-radius: 5px;" src="../server/php/Archivos/' + val.Ruta.replace("Panama", "Panama/thumbnails") + '" alt="...">';
            tds += '</a>';
          $("#cntReporte_Fotos_"  + val.idRecurso).append(tds);
        });

        $("#cntReporte_Fotos_" + tmpContador).magnificPopup(
            {
              delegate: 'a', 
              type: 'image', 
              gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] 
            }});

        //$(".mfp-img").pinchzoomer({ imageOptions:{ preloaderUrl:"../assets/preloader.gif"} });
      }
    }, "json");

  $.post('../server/php/proyecto/cargarLevantamiento.php', {Usuario : Usuario.id, idProyecto : $("#txtReporte_idProyecto").val()}, function(data, textStatus, xhr) 
  {
    Markers = {};
    tmpLastMarker = null;
    if (data.length > 0)
    {
      var arrCoord = {};
      var tds = "";
      var tds2 = "";
      var idx = -1;
      var idTabla = obtenerPrefijo();
      var tmpData = {};

      var objPostes = {};
      var tmpJSON = {};
      var tmpPath = {};
      console.log(data);
      $.each(data, function(index, val) 
      {
        if (index == 0)
        {
          tds += '<table id="tblReporte_' + idTabla + '" class="table table-hover" style="display: block;overflow-x: auto;"><thead><tr>';
            $.each(val, function(indexI, valI) 
            {
               if (indexI == "Datos")
               {
                  tmpData = JSON.parse(valI);
                $.each(tmpData, function(indexK, valK) 
                {
                    tds += '<th>' + indexK + '</th>';
                });
               } else
               {
                  tds += '<th>' + indexI + '</th>';
               }
            });
          tds += '</tr></thead><tbody>';
        }

        tmpJSON = JSON.parse(val['Datos']);

        tds2 += '<div class="col-md-4 col-xs-6"><div class="margin-5"><button class="btn btn-outline btnReporte_Marker btn-block btn-warning ">' + tmpJSON.CodPoste + '</button></div></div>';

        tds += '<tr class="rowLevantamiento" codPoste="' + tmpJSON.CodPoste + '">';
        $.each(val, function(indexO, valO) 
        {
           if (indexO == "Datos")
               {
                  tmpData = JSON.parse(valO);
                $.each(tmpData, function(indexK, valK) 
                {
                    tds += '<td>' + valK.replace("'", '"') + '</td>';
                });
               } else
               {
                  tds += '<td>' + valO.replace("'", '"') + '</td>';
               }
        });
        tds += '</tr>';
        
        
        if (val.coordenadas != "" && val.coordenadas.length > 7)
        {
          var vArrCoord = val.coordenadas.split("#");
          if (!isNaN(vArrCoord[0]))
          {
            idx++;
            objPostes[tmpJSON.CodPoste] = [tmpJSON.CoordX, tmpJSON.CoordY];
            repMapa_AgregarMarcador(val);
          }
        }
        if (tmpJSON.Tramo != null && tmpJSON.Tramo != "" && tmpJSON != "null")
        {
          tmpPath = [objPostes[tmpJSON.Tramo], objPostes[tmpJSON.CodPoste]];
          
          repMapa_AgregarLinea(tmpPath);
        }
      });

      if (idx >= 0)
      {
        var arrCoord = data[idx].coordenadas.split("#");

        
        $("#tblReporte_" + idTabla).crearDataTable("");

        repMap.setCenter(arrCoord[0].replace(",", "."), arrCoord[1].replace(",", "."));
        repMap.setZoom(15);
      } else
      {
        Mensaje("Error", "No se encontró niguna coordenada Válida en el Proyecto", "danger");
      }
        tds += '</tbody></table>';
      $("#cntReporte_Tabla").append(tds);

    }
  }, "json");

  $.post('../server/php/listarArchivos.php', {ruta: 'Panama/' + $("#txtReporte_idProyecto").val()}, function(archivos) 
      {
        $("#cntReporte_Archivos li").remove();
        $("#btnReporte_Archivos_DescargarTodos").attr("idProyecto", $("#txtReporte_idProyecto").val());
        $("#frmReporte_Archivos").attr("action", "../server/php/subirArchivo.php?Ruta=Panama/" + $("#txtReporte_idProyecto").val());
        if (archivos.error === undefined)
        {
          var ext = "";
          var arrExt;
          var tmpDirectorio = "";
          var regDirectorio = "";
          var tds2 = "";
          $.each(archivos, function(nomDirectorio, cntDirectorio) 
          {
            if (regDirectorio != nomDirectorio)
            {
              regDirectorio = nomDirectorio;
              tds2 += '<li class="list-group-item">';
              if (regDirectorio != "raiz")
              {

                      tds2 += '<h4 class="example-title">' + regDirectorio + '</h4>';
              } else
              {
                tds2 += '<h4 class="example-title"></h4>';
              }
                    tds2 += '</li>';
            }

            
            $.each(cntDirectorio, function(idx, Archivo) 
            {
              arrExt = Archivo.nomArchivo.split(".");
              ext = arrExt[arrExt.length - 1];

              tds2 += '<li class="list-group-item">';
                      tds2 += '<div class="media">';
                        tds2 += '<div class="media-left">';
                          tds2 += '<a class="avatar" href="javascript:void(0)">';
                            tds2 += '<img src="../assets/images/fileIcons/' + ext.toLowerCase() + '.png" alt=""></a>';
                        tds2 += '</div>';
                        tds2 += '<div class="media-body">';
                          tds2 += '<h4 class="media-heading">';
                            tds2 += '<a class="name" href="../server/php/' + Archivo.ruta + "/" + Archivo.nomArchivo + '" target="_blank">' + Archivo.nomArchivo + '</a>';
                            tds2 += '<a class="btn btn-danger pull-right btnReporte_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
                          tds2 += '</h4>';
                          tds2 += '<p class="list-group-item-text">';
                            tds2 +='<small><i>' + Archivo.fecha + '</i></small>';
                          tds2 += '</p>';
                        tds2 += '</div>';
                      tds2 += '</div>';
                    tds2 += '</li>';
            });
          });
          
          $("#cntReporte_Archivos").append(tds2);
        } 
      }, "json");
}
function seleccionarMarker(codPoste, callback)
{
  if (callback === undefined)
  {    callback = function(){};  }

  if (tmpLastMarker != null)
  {
    Markers[tmpLastMarker].setIcon({url : "../assets/images/icons/poste.png"});
  }
  tmpLastMarker = codPoste;
  repMap.setCenter({lat : Markers[codPoste].getPosition().lat(), lng : Markers[codPoste].getPosition().lng()});
  repMap.setZoom(19);
  Markers[codPoste].setIcon({url : "../assets/images/icons/poste_selected.png"});
  callback();
}

function iniciarMapa(Lat, Lon, contenedor)
{
  if (typeof GMaps == "undefined")
  {
    
  } else
  {
    Lat = 10.97575;
    Lon = -74.7893333333333;

    if (contenedor === undefined)
    {
      contenedor = '#cntReporte_Mapa';
    }
    if (Lat != undefined && Lon != undefined)
    {
      repMap = new GMaps({
        el: contenedor,
        lat : Lat,
        lng : Lon,
        zoomControl: true,
        zoomControlOpt: {
          style: "SMALL",
          position: "TOP_LEFT"
        },
        panControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        overviewMapControl: true

      });

      repMap.addStyle({
        styledMapName: "Styled Map",
        styles: $.components.get('gmaps', 'styles'),
        mapTypeId: "map_style"
      });

      repMap.setStyle("map_style");
      
    }
  }
}

function repMapa_AgregarMarcador(datos)
  {
    if (datos === undefined)
    {
      datos = {};
    }
    var arrCoord = datos.coordenadas.split("#");
    var lat = arrCoord[0];
    var lon = arrCoord[1];

    if (lat != "" && lon != "")
    {
      lat = lat.replace(",", ".");
      lon = lon.replace(",", ".");
      
      var contenido = "";
      datos.Datos = JSON.parse(datos.Datos);
      
      contenido += '<div>';
        contenido += '<h4><strong>' + datos.Datos.CodPoste + '</strong></h4>';
        contenido += '<div class="col-md-12">';
        
        $.each(datos.Datos, function(index, val) 
        {
          contenido += '<div class="col-md-6">';
            contenido += '<h6><small>' + index + ':</small> <strong>' + val + '</strong></h6>';
          contenido += '</div>';
        });
        contenido += '</div>';
      contenido += '</div>';

      Markers[datos.Datos.CodPoste] = repMap.addMarker({
          lat: lat,
          lng: lon,
          title : datos.Datos.CodPoste,
          icon : '../assets/images/icons/poste.png',
          infoWindow: {
            content: contenido
          },
          click : function(e)
          {
            seleccionarMarker(datos.Datos.CodPoste);
          }
        });

      repMap.drawOverlay({
        lat: lat,
        lng: lon,
        content: '<div class="badge badge-info badge-sm">' + datos.Datos.CodPoste + '</div>'
      });
        
    }
  }
function repMapa_AgregarLinea(path)
{
  repMap.drawPolyline({
  path: path,
  strokeColor: '#715146',
  strokeOpacity: 0.6,
  strokeWeight: 5
});
}

function SQL()
{

}

function SQL_armarTabla(data)
{
  $.each(data, function(index, val) 
  {
    if (index == 0)
    {
      tds += '<table id="tblSQL_' + idTabla + '" class="table" style="display: block;overflow-x: auto;"><thead><tr>';
        $.each(val, function(indexI, valI) 
        {
           if (indexI == "Datos")
           {
              tmpData = JSON.parse(valI);
            $.each(tmpData, function(indexK, valK) 
            {
                tds += '<th>' + indexK + '</th>';
            });
           } else
           {
              tds += '<th>' + indexI + '</th>';
           }
        });
      tds += '</tr></thead><tbody classs="table-hover">';
    }
    tds += '<tr>';
    $.each(val, function(indexO, valO) 
    {
       if (indexO == "Datos")
           {
              tmpData = JSON.parse(valO);
            $.each(tmpData, function(indexK, valK) 
            {
                tds += '<td>' + valK + '</td>';
            });
           } else
           {
              tds += '<td>' + valO + '</td>';
           }
    });
    tds += '</tr>';
  });

        tds += '</tbody></table>';

        $("#cntReporte_Tabla").append(tds);

        $("#tblReporte_" + idTabla).crearDataTable("");
}