var Usuario = null;
var Markers = [];

$(document).ready(function() {
	aplicacion();
  Usuario = JSON.parse(localStorage.getItem('wsp_cerberus'));
  if (Usuario == null || Usuario == undefined)
  {
    cerrarSesion();
  } else
  {
    cargarDashboard();
  }
});
function aplicacion()
{
  $("#lblCerrarSesion").on("click", cerrarSesion);
    
	$(".lnkMenuBar_Item").on("click", function(evento)
    {
      evento.preventDefault();
      var titulo = $(this).find('span').text();
      var vinculo = $(this).attr("vinculo");

      if (vinculo != undefined)
      {
       	cargarModulo(vinculo, titulo);
      }
    });
  
  $(document).delegate(".btnVolverAlPanel", "click" ,function(evento)
    {
      evento.preventDefault();
      cargarModulo("obras/panel.html", "Panel de Obra");
    });
}

function cargarModulo(vinculo, titulo, callback)
{
	$("#txtCrearProyecto_idProyecto").val("");
  
  titulo = titulo || null;

  if (callback === undefined)
    {callback = function(){};}


	$(".Modulo").hide();
        var tds = "";
        var nomModulo = "modulo_" + vinculo.replace(/\s/g, "_");
        nomModulo = nomModulo.replace(/\./g, "_");
        nomModulo = nomModulo.replace(/\//g, "_");

        if ($('#' + nomModulo).length)
        {
          $('#' + nomModulo).show();
          if (titulo != null)
          {
            $('#' + nomModulo).find('.page-header').find(".page-title").text(titulo);
          }
          callback();
        } else
        {
          tds += '<div id="' + nomModulo + '" class="page Modulo">';
            tds += '<div class="page-header">';
              tds += '<h1 class="page-title">' + titulo + '</h1>';
            tds += '</div>';
            tds += '<div class="page-content">';
              tds += '<div class="panel">';
                tds += '<p>Cargando...</p>';
              tds += '</div>';
            tds += '</div>';
          tds += '</div>';

          $("#contenedorDeModulos").append(tds);
          $.get(vinculo + "?tmpId=" + obtenerPrefijo(), function(data) 
          {
            $("#" + nomModulo + " .panel").html(data);
            callback();
          });
        }
        $("#lblUbicacionModulo").text(titulo);
}
$.fn.generarDatosEnvio = function(restricciones, callback)
{
  if (callback === undefined)
    {callback = function(){};}

    var obj = $(this).find(".guardar");
  var datos = {};
  datos['idObra'] = 0;
  datos['Usuario'] = Usuario.id;

  $.each(obj, function(index, val) 
  {
    if ($(val).attr("id") != undefined)
    {
      if (!$(val).hasClass('tt-hint'))
      {
        if ($(val).attr("type") == "checkbox")
        {
          datos[$(val).attr("id").replace(restricciones, "")] = $(val).is(":checked");
        } else
        {
          datos[$(val).attr("id").replace(restricciones, "")] = $(val).val();
        }
      }
    }
  });
  datos = JSON.stringify(datos);  

  callback(datos);
}
function Mensaje(Titulo, Mensaje, Tipo)
{
  if (Tipo == undefined)
  {
    Tipo = "success";
  }
  switch (Tipo)
  {
    case "success":
        alertify.success(Mensaje);
      break;
    case "danger":
        alertify.error(Mensaje);
      break;
    default:
        alertify.log(Mensaje);
  }
}


$.fn.crearDataTable = function(tds, callback, tdc, sdom)
{
  if (callback === undefined)
    {callback = function(){};}

  if (tdc === undefined)
  {
    tdc = "";
  }

  if (sdom === undefined)
  {
    sdom = '<"dt-panelmenu clearfix"lf><"clear">Tt<"dt-panelfooter clearfix"ip>';
  }

  var dtSpanish = {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ registros",
    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Filtrar:",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "Primero",
        "sLast":     "Último",
        "sNext":     "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
  };

  var options = {
        "aoColumnDefs": [{
          'bSortable': false,
          'aTargets': [-1]
        }],
        "iDisplayLength": 10,
        "aLengthMenu": [
          [10, 25, 50, -1],
          [10, 25, 50, "Todos"]
        ],
        "sDom": sdom,
        "oTableTools": {
          "sSwfPath": "../assets/vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf"
        },
        "language" : dtSpanish
      };

      //"sDom": '<"dt-panelmenu clearfix"lTfr>t<"dt-panelfooter clearfix"ip>',

  var idObj = $(this).attr("id");
  if ($("#" + idObj + "_wrapper").length == 1)
    {
        $(this).dataTable().fnDestroy();
    } 

    if (tdc != undefined && tdc != "")
    {
      $(this).find("thead").find("tr").remove();
      $("#" + idObj + " thead").append(tdc); 
    }

    if (tds != undefined && tds != "")
    {
      $(this).find("tbody").find("tr").remove();
      $("#" + idObj + " tbody").append(tds);
    }

  $(this).DataTable(options);
  callback();
}
function cargarDashboard()
{
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

  $('[data-plugin="datepicker"]').datepicker({'autoclose' : true});


  $('#inicio_Map').vectorMap({map: 'co_mill', 
      backgroundColor: '#fff',
      zoomAnimate: true,
      zoomMin : 3,
      regionStyle: {
        initial: {
          fill: $.colors("primary", 100)
        },
        hover: {
          fill: $.colors("primary", 400)
        },
        selected: {
          fill: $.colors("primary", 800)
        },
        selectedHover: {
          fill: $.colors("primary", 500)
        }
      },
      markerStyle : {
        initial: {
          fill: 'red',
          stroke: '#505050',
          "fill-opacity": 1,
          "stroke-width": 1,
          "stroke-opacity": 1,
          r: 8
        }
      },
      series: {regions: [{scale: {
          red: '#ff0000',
          green: '#00ff00',
          blue : $.colors("primary", 600)
        },
        attribute: 'fill', values : 
          {
            'CO-BOY' : "blue", 
            'CO-COR' : "blue", 
            'CO-ATL' : "blue",
            'CO-SUC' : "blue",
            'CO-CHO' : "blue",
            'CO-MAG' : "blue",
            'CO-LAG' : "blue"
          }
        }]}
    });

  var objJVMap = $('#inicio_Map').vectorMap('get', 'mapObject');

  objJVMap.setFocus({regions : ['CO-BOY', 'CO-COR', 'CO-ATL', 'CO-SUC', 'CO-CHO', 'CO-MAG', 'CO-LAG']});
  $.post('../server/php/proyectos/dashboard/cargarDashboard_Mapa.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
  {
    if (data != 0)
    {
      var markers = [];
      $.each(data, function(index, val) 
      {
        markers.push({latLng: val.coordenadas.split(","), name: val.Nombre});
      });

      objJVMap.addMarkers(markers);
    }
    
  }, "json");

  $.post('../server/php/proyectos/dashboard/cargarNotificaciones.php', {Usuario: Usuario.id, Inicio : 0, Fin: 10}, function(data, textStatus, xhr) 
  {
    if (data != 0)
    {
      $("#lblInicio_Notificaciones").text(data.Cantidad)
      var tds = "";
      $.each(data, function(index, val) 
      {
        if (index != "Cantidad")
        {
          tds += '<li class="list-group-item">';
            tds += '<div class="media">';
              tds += '<div class="media-body">';
                tds += '<h4 class="media-heading">';
                  tds += '<small class="pull-right">' + calcularTiempoPublicacion(val.fechaCargue) + '</small>';
                  if (val.Nombre != "")
                  {
                    tds += '<a class="name">' + val.Nombre + '</a> envió un mensaje.<br>';  
                  }
                  tds += val.Mensaje;
                tds += '</h4>';
                tds += '<small>' + val.fechaCargue + '</small>';
                
              tds += '</div>';
            tds += '</div>';
          tds += '</li>';
        }
      });

      $("#cntInicio_Notificaciones").append(tds);
    }
  }, "json");
}
function cargarPostes()
{
  $("#lstPostes_Postes li").remove();
  $.post('../server/php/proyectos/cargarPostes.php', {idObra: $("#txtIdObra").val(), valor : "0, 1"}, 
    function(data, textStatus, xhr) 
    {
      $.each(data, function(index, val) 
      {
         agregarPoste(val.Codigo, "", val.Auditar);
      });
      $("#lblPostes_NoNodos").text($("#lstPostes_Postes li").size());
    }, "json");
}
function cargarPostesAuditoria()
{
  
  $.post('../server/php/proyectos/cargarPostes.php', {idObra: $("#txtIdObra").val(), valor : "1"}, 
    function(data, textStatus, xhr) 
    {
      $.each(data, function(index, val) 
      {
         agregarPosteAuditar(val.Codigo, "", val.Auditar, val.Tipo, val.Resultado);
      });
      
    }, "json");
}

function agregarPoste(Codigo, Direccion, valor)
{
  if (valor != "1") 
  {
    valor = "";
  } else
  {
    valor = "checked";
  }
  
  var idPoste = $("#lstPostes_Postes li").size();

  $("#lblPostes_NoHayPostes").hide();
  var tds = "";
  tds += '<li class="list-group-item col-md-4">';
    tds += '<div class="media">';
      tds += '<div class="media-left">';
        tds += '<div class="checkbox-custom checkbox-primary">';
          tds += '<input type="checkbox" id="chkPoste_' + idPoste + '" ' + valor + '>';
          tds += '<label for="chkPoste_' + idPoste + '"> ' + Codigo + '</label>';
        tds += '</div>';
      tds += '</div>';
      tds += '<div class="media-body">';
        tds += '<h4 class="media-heading">' + /*Codigo*/"" + '</h4>';
        tds += '<small>' + Direccion + '</small>';
        tds += '<button type="button" class="btn btn-icon btn-danger btn-round btnPostes_BorrarPoste"><i class="icon wb-trash" aria-hidden="true"></i></button>';
      tds += '</div>';
      tds += '<div class="media-right">';
      tds += '</div>';
    tds += '</div>';
  tds += '</li>';

  $("#lstPostes_Postes").append(tds);
  $("#lblPostes_NoNodos").text($("#lstPostes_Postes li").size());
}

function agregarPosteAuditar(Codigo, Direccion, valor, Tipo, Resultado)
{
  var idPoste = $("#lstAuditoria_Postes li").size();
  Resultado = Resultado || "";
  switch (Resultado) 
  {
    case "Cumple":
      Resultado = "success";
      break;
    case "No Cumple":
      Resultado = "danger";
      break;
    default:
      Resultado = "default";      
  }
  

  $("#lblAuditoria_NoHayPostes").hide();
  var tds = "";
  var ico = "fa-try";
  if (Tipo == "Persona")
  {
    ico = "fa-male";
  }
  else if (Tipo == "Vehículo")
  {
    ico = "fa-car";
  }
  tds += '<div class="col-md-6">';
  tds += '<li class="list-group-item col-md-12 margin-5">';
    tds += '<button type="button" Codigo="'+ Codigo + '" tipo="' + Tipo + '" class="btn btn-' + Resultado + ' btn-lg btn-block btnAuditar_Poste"><i class="icon ' + ico + '"></i>' + Codigo + '</button>';
  tds += '</li>';
  tds += '</div>';

  $("#lstAuditoria_Postes").append(tds);
}
function obtenerFecha()
{
  var f = new Date();
  return f.getFullYear() + "-" + CompletarConCero(f.getMonth() +1, 2) + "-" + CompletarConCero(f.getDate(), 2) + " " + CompletarConCero(f.getHours(), 2) + ":" + CompletarConCero(f.getMinutes(), 2) + ":" + CompletarConCero(f.getSeconds(), 2);
}
function obtenerPrefijo()
{
  var f = new Date();
  return f.getFullYear() + CompletarConCero(f.getMonth() +1, 2) + CompletarConCero(f.getDate(), 2) + CompletarConCero(f.getHours(), 2) + CompletarConCero(f.getMinutes(), 2) + CompletarConCero(f.getSeconds(), 2) + CompletarConCero(Usuario.id, 3);
}
function CompletarConCero(n, length)
{
   n = n.toString();
   while(n.length < length) n = "0" + n;
   return n;
}

function infBasica_ValidarFechas()
{
  if ($("#txtInformacionBasica_FechaIni").val() != "" && $("#txtInformacionBasica_FechaFin").val() != "")
  {
    var f1 = new Date($("#txtInformacionBasica_FechaIni").val());
    var f2 = new Date($("#txtInformacionBasica_FechaFin").val());
    if (f1 > f2)
    {
      f1 = $.datepicker.parseDate('yy-mm-dd', $("#txtInformacionBasica_FechaIni").val());
      Mensaje("Error", "La fecha final no puede ser menor a la inicial", "danger");
      $('#objInformacionBasica_FechaFin').datepicker('setDate', f1);
    } 
  }
}

  function informacionBasica()
   {
    
    var substringMatcher = function(strs) 
    {
      return function findMatches(q, cb) 
      {
      var matches, substringRegex;

      // an array that will be populated with substring matches
      matches = [];

      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');

      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });
      cb(matches);
      };
    };
    
    var Vigilantes = ['AGNER MANRIQUE', 'ALBERTO AYAZO', 'ALEX BENITEZ', 'ALEX CAMPO', 'ALEXANDER ARCHILA', 'ANTONIO MESTRA', 'ANTONY COAVAS', 'BERNARDO PEREZ', 'CARLOS FIGUEROA', 'Carlos Rodriguez', 'CHRISTIAN VILLAR', 'CRISTIAN VILLAR', 'DANILO DIAZ', 'David Diaz', 'DIEGO MARTINEZ', 'Domingo Espinosa', 'DULMAN ORTEGA', 'EDGADO VERGARA', 'EDGAR PEDROZA', 'EDGARDO VERGARA', 'EDILBERTO AGAMEZ', 'EDWIN CAÑATE', 'EDWIN PIMIENTA', 'EINAR MARTINEZ', 'ENDER VASQUEZ - MIGUEL LAMBRAÑO', 'ENRIQUE BARRIOS', 'ERICK HERNANDEZ', 'EUCLIDES FONTALVO', 'FRANCISCO VIOLA', 'FREIDETH VILLA', 'GIOVANNY TORRES', 'HEMER DIAZ', 'IVAN GOMEZ', 'IVAN ORTEGA', 'JHON PORTILLO', 'JHONNY HERNANDEZ', 'JORGE GONZALEZ', 'JORGE PARRA', 'JOSE  PACHECO', 'JOSE BETIN', 'JOSE IGUARAN', 'JUAN CARLOS SEGRERA', 'MANTENIMIENTO', 'MANUEL CORONADO', 'Marco Rumbo', 'MAURICIO TORRES', 'MIGUEL LAMBRAÑO', 'MONICA OSORIO ', 'NATALIA ORTEGA', 'NEVER SILGADO', 'OSCAR BALLESTEROS', 'OSCAR DIAZ', 'OSCAR PARDO', 'OSVALDO MORENO', 'RANDY MARTÍNEZ ', 'WALTER SALGADO', 'YEIMI HOLGUIN', 'YESICA BOHORQUEZ'];

    var Contratistas = ['AENCO S.A.S.', 'AENCO-SERVIENERGIA', 'BRIGADA PROPIA', 'COBRA S.A', 'Consorcio MSI', 'COSTANERA DE ENERGÍA', 'COSTANERA DE ENERGIA – SERVICER - PERSONAL PROPIO ', 'DELTEC S.A', 'ICC LTDA', 'ICC S.A.', 'INGENIERIA DE SERVICIOS DEL NORTE', 'MSI - UTSI ', 'MSI - UTSI -ELECTROMAC', 'SERVICER LTDA', 'SERVIENERGIA LTDA', 'SIA LTDA', 'UNIELECTRICOS', 'UT SEI'];

    $("#txtInformacionBasica_Contratista").typeahead(
    {
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      source: substringMatcher(Contratistas)
    });

    $("#txtInformacionBasica_Vigilante").typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  source: substringMatcher(Vigilantes)
});

  $("#btnInformacionBasica_AgregarContacto").on("click", function(evento)
    {
      evento.preventDefault();
      var tds = '<div class="col-md-12 margin-top-20 row">';
          tds += '<div class="form-group col-md-10 form-material">';
            tds += '<input type="text" class="form-control guardar">';
            tds += '<label class="floating-label">Nombre</label>';
          tds += '</div>';
          tds += '<div class="form-group col-md-2  form-material">';
            tds += '<button class="btn btn-danger btn-icon btn btn-round btnInformacionBasica_BorrarContacto"><i class="icon wb-trash"></i></button>';
          tds += '</div>';
          tds += '<div class="form-group col-md-4 form-material">';
            tds += '<input type="email" class="form-control guardar">';
            tds += '<label class="floating-label">Correo</label>';
          tds += '</div>';
          tds += '<div class="form-group col-md-4 form-material">';
            tds += '<input type="text" class="form-control guardar">';
            tds += '<label class="floating-label">Cargo</label>';
          tds += '</div>';
          tds += '<div class="form-group col-md-4 form-material">';
            tds += '<input type="text" class="form-control guardar">';
            tds += '<label class="floating-label">Empresa</label>';
          tds += '</div>';
        tds += '</div>';
      $("#cntInformacionBasica_Contactos").append(tds);
    });

    $(document).delegate('.btnInformacionBasica_BorrarContacto', 'click', function(event) 
    {
      event.preventDefault();
      $(this).parent("div").parent("div").remove();
    });


  $('#objInformacionBasica_FechaIni').datepicker({'autoclose' : true});
  $("#objInformacionBasica_FechaIni").on("changeDate", function(event) {
    $("#txtInformacionBasica_FechaIni").val($("#objInformacionBasica_FechaIni").datepicker('getFormattedDate'));
      infBasica_ValidarFechas();
  });

  $('#objInformacionBasica_FechaFin').datepicker({'autoclose' : true});
  $("#objInformacionBasica_FechaFin").on("changeDate", function(event) {
    $("#txtInformacionBasica_FechaFin").val($("#objInformacionBasica_FechaFin").datepicker('getFormattedDate'));
      infBasica_ValidarFechas();
  });

  $("#frmInformacionBasica").on("submit", function(evento)
    {
      evento.preventDefault();
      infBasica_Validar(function()
        {
          $("#frmInformacionBasica").generarDatosEnvio("txtInformacionBasica_", function(datos)
          {
            var contactos = {};
            var cntContactos = $("#cntInformacionBasica_Contactos .row");
            var controlesContactos = {};
            
            $.each(cntContactos, function(index, val) 
            {
               controlesContactos = $(val).find(".guardar");
               contactos[index] = {};
               contactos[index]['Nombre'] =  $(controlesContactos[0]).val();
               contactos[index]['Correo'] = $(controlesContactos[1]).val();
               contactos[index]['Cargo'] = $(controlesContactos[2]).val();
               contactos[index]['Empresa'] = $(controlesContactos[3]).val();
            });
            contactos = JSON.stringify(contactos);  

             $("#frmInforme_Complemento").generarDatosEnvio("txtInforme_", function(datos)
              {
                $.post('../server/php/proyectos/guardarCompInforme.php', {"datos" : datos, "idObra" : $("#txtIdObra").val()}, function(data, textStatus, xhr) 
                {

                });
              });

            $.post('../server/php/proyectos/guardarInfBasica.php', 
              {
                idObra : $("#txtIdObra").val(), 
                datos: datos, 
                contactos : contactos, 
                Usuario : Usuario.id
              }, function(data, textStatus, xhr) 
            {
              if (data == 1)
                {
                  Mensaje("Hey", "La información ha sido guardada");
                } else
                {
                  Mensaje("Error", "No se ha agregado ningún dato" + data);
                }
            });
          })
        });
    });
}
function infBasica_CargarDatos()
{
  $.post('../server/php/proyectos/cargarInformacionBasica.php', {idObra: $("#txtIdObra").val(), Usuario : Usuario.id}, 
    function(data, textStatus, xhr) 
    {
      $("#objInformacionBasica_FechaIni").val(data.fechaInicio);
      $("#txtInformacionBasica_FechaIni").val(data.fechaInicio);
      $("#objInformacionBasica_FechaFin").val(data.fechaFinalizacion);
      $("#txtInformacionBasica_FechaFin").val(data.fechaFinalizacion);
      $("#txtInformacionBasica_Contratista").val(data.Contratista);
      $("#txtInformacionBasica_Tipo").val(data.idTipoObra);
      $("#txtInformacionBasica_Estado").val(data.Estado);
      $("#txtInformacionBasica_Alcances").val(data.Alcances);
      $("#txtInformacionBasica_Direccion").val(data.Direccion);
      $("#txtInformacionBasica_Vigilante").val(data.Vigilante)
      $("#txtInformacionBasica_Comentarios").val(data.Observaciones)

      $("#cntInformacionBasica_Contactos .row").remove();

      if (data.Contactos != undefined)
      {
        $.each(data.Contactos, function(index, val) 
        {
          $("#btnInformacionBasica_AgregarContacto").trigger('click');
          $($("#cntInformacionBasica_Contactos .row .guardar")[4 * index]).val(val.Nombre);
          $($("#cntInformacionBasica_Contactos .row .guardar")[4 * index + 1] ).val(val.Correo);
          $($("#cntInformacionBasica_Contactos .row .guardar")[4 * index + 2] ).val(val.cargo);
          $($("#cntInformacionBasica_Contactos .row .guardar")[4 * index + 3] ).val(val.Empresa);
        });
      }

      $("#btnInformacionBasica_AgregarContacto").trigger('click');

    }, "json").fail(function()
    {
      Mensaje("Error", "No fue posible descargar los datos desde el Servidor Central");
    });
}

function infBasica_Validar(callback)
{
  if (callback === undefined)
  {callback = function(){};}

  var obj = $("#frmInformacionBasica .guardar");

  var Bandera = true;
  $.each(obj, function(index, val) 
  {
    if ($(val).val() == 0 || $(val).val() == "")
    {
      if (!$(val).hasClass('tt-hint'))
      {
        Mensaje("Error", "Este campo no debería estar vacío", "danger");
        $(val).focus();
        Bandera = false;
      }
    }
    return Bandera;
  });
  if (Bandera)
  {
    callback();
  }
}
//10.428175, -75.540919
function cargarNCMarcadas()
{
  var idPoste = $("#txtCodigoPoste").val();
  var idObj = "";
  $("#cntAuditoria_NoConformidades input[type='checkbox']").prop("checked", false);
  $("#cntAuditoria_PuntosDeControlNC div").remove();
  $.post('../server/php/proyectos/cargarNCMarcadas.php', {idObra: $("#txtIdObra").val(), idPoste : idPoste}, function(data, textStatus, xhr) 
  {
    var tds = "";
    if (typeof data == "object")
    {
      $.each(data, function(index, val) 
      {
        idObj = val.codigoNC.replace(/\./g, "_");
         tds += '<div class="alert alert-danger alert-dismissible" Criterio="' + val.Criterio + '" id="expAuditoria_NC_' + val.Criterio + "_" + idObj+ '" role="alert">';
            tds += '<button type="button" class="close chkAuditoria_EliminarNC" data-dismiss="alert" aria-label="Close">';
              tds += '<span aria-hidden="true">×</span>';
            tds += '</button>';
            tds += '<strong>' + val.Criterio + '</strong> '+ val.codigoNC + ' : ' + val.Descripcion;
          tds += '</div>';

          $("#chkPoste_" + idObj + "[Criterio=" + val.Criterio + "]").prop("checked", true);
      });
      $("#cntAuditoria_PuntosDeControlNC").append(tds);
    }
  }, "json");
}
function cerrarSesion()
{
  delete localStorage.wsp_cerberus;
  window.location.replace("../index.html");
}

function cargarEstadoObra(callback)
{
  $.post('../server/php/proyectos/cargarInformacionBasica.php', {idObra: $("#txtIdObra").val(), Usuario : Usuario.id}, 
    function(data, textStatus, xhr) 
    {
      if (data != 0)
      {
        if (callback === undefined)
        {callback = function(){};}     
      } else
      {
        Mensaje("Error", "No se ha diligenciado la Información Básica de la Obra");
        cargarModulo("obras/informacionBasica.html", 
            "Información Básica de " + $("#txtTituloObra").val(),
          function(){});
      }
    }).fail(function()
    {
      Mensaje("Error", "No hay información Disponible");
    });
}

function readURL(input, idObj) 
{
  var Nombre = input.value.replace("C:\\fakepath\\", "");
  
  if (input.files && input.files[0]) 
  {
      var reader = new FileReader();

      var tds = "";
      var tds2 = "";

      reader.onload = function (e) 
      {
        auditoria_AgregarSoporte(idObj, e.target.result, Nombre, 0);       
      }
      reader.readAsDataURL(input.files[0]);
  }
}

function guardarSoporte(foto, Observaciones)
{
  var campo = $(".lblAuditoria_GuardarSoporte").attr("codigoNC");
  $.post('../server/php/proyectos/guardarSoporte.php', {idObra: $("#txtIdObra").val(), codigoPoste : $("#txtCodigoPoste").val(), campo:campo, foto: foto, Observaciones : $("#txtAuditoria_Observaciones").val(), Criterio : $("#txtAuditoria_PuntosControl_Criterio").val(), Coordenadas : $("#txtCoordenadas").val()}, function(data, textStatus, xhr) 
  {
    
  });
}
function auditoria()
{
  setInterval(obtenerCoordenadas, 60000);
  for (var i = 5; i >= 0; i--) 
  {
    obtenerCoordenadas();
  }

  $("#btnAuditoria_AgregarElemento").on("click", function(evento)
    {
      if ($("#txtAuditoria_AgregarElemento_Codigo").val() != "")
      {
        $.post('../server/php/proyectos/agregarElementoAuditar.php', {Usuario: Usuario.id, idObra : $("#txtIdObra").val(), Elemento: $("#txtAuditoria_AgregarElemento_Codigo").val(), Tipo : $("#txtAuditoria_AgregarElemento_Tipo").val()}, function(data, textStatus, xhr) 
          {
            if (data == 1)
            {
              agregarPosteAuditar($("#txtAuditoria_AgregarElemento_Codigo").val(), "", "", $("#txtAuditoria_AgregarElemento_Tipo").val());
              $("#txtAuditoria_AgregarElemento_Codigo").val("");
            }
          }).fail(function()
          {
            Mensaje("Error", "No fue posible agregar el Elemento");
          })
      }
    });
  $("#txtAuditoria_AgregarElemento_Tipo").on("change", function()
  {
    if ($(this).val() == "Persona")
    {
      $("#lblAuditoria_AgregarElemento_Codigo").text("Nombre");
      $("#txtAuditoria_AgregarElemento_Codigo").attr("placeholder", "Nombre");
    }
    else if ($(this).val() == "Vehículo")
    {
      $("#lblAuditoria_AgregarElemento_Codigo").text("Placa");
      $("#txtAuditoria_AgregarElemento_Codigo").attr("placeholder", "Placa");
    } else
    {
      $("#lblAuditoria_AgregarElemento_Codigo").text("Código");
      $("#txtAuditoria_AgregarElemento_Codigo").attr("placeholder", "Código");
    }
  });
  
  $(".lblAuditoria_GuardarSoporte").on("click", function(evento)
    {
      evento.preventDefault();
      {
        var objs = $("#cntAuditoria_AistenteSoportes_Media input:checked");
        
        if (objs.length > 0)
        {
          $.each(objs, function(index, val) 
          {
            guardarSoporte($(val).attr("archivo"), $("txtAuditoria_Observaciones").val());
          });
        } else
        {
          Mensaje("Error", "La observación no quedará registrada si no selecciona un soporte para la misma");
        }
      }
    });
  $(".lblAuditoria_Guardar").on("click", function(evento)
    {
      evento.preventDefault();
      var objs = $("#cntAuditoria_PuntosDeControlNC div");
      var campos = "";
      var campo = "";
      var Criterio = "";
      $.each(objs, function(index, val) 
      {
         Criterio = $(val).attr("Criterio");
         campo = $(val).attr("id").replace("expAuditoria_NC_" + Criterio + "_" , "");
         if (campo != "0" && campo != "")
         {
          campos += campo.replace(/_/g, ".") + "#" + Criterio + ",";
         }
      });
      $.post('../server/php/proyectos/guardarAuditoria.php', {idObra: $("#txtIdObra").val(), idPoste: $("#txtCodigoPoste").val(), campos : campos, Coordenadas : $("#txtCoordenadas").val()}, function(data, textStatus, xhr) 
      {
        Mensaje("Ok", "La revisión ha sido guardada");

        var cumplimiento = $("#cntAuditoria_PuntosDeControlNC .alert").length;
        var objeto = $(".btnAuditar_Poste[Codigo=" + $("#lblAuditoria_Chequero_Auditado").text() + "]");
        
          $(objeto).removeClass('btn-danger');
          $(objeto).removeClass('btn-success');
          $(objeto).removeClass('btn-default');
        if (cumplimiento > 0)
        {
          $(objeto).addClass('btn-danger');
        } else
        {
          $(objeto).addClass('btn-success');
        }
      });
    });
  $("#txtAuditoria_Soporte").change(function(ev){
        var idObj = obtenerPrefijo();
        readURL(this, idObj);
        $("#txtAuditoria_Soporte_idObj").val(idObj);

        var contenedor = $("#frmAuditoria_Soportes");
        var barra = $(contenedor).find(".progress-bar");
        var percentVal = '0%';

        $(barra).width(percentVal);
        $(barra).text(percentVal);
        $(contenedor).trigger('submit');
    });
    
    
    $(document).delegate('.btnAuditoria_RemoverImagen', 'click', function(evento)
    {
      var obj = $(this).attr("objeto");
      var idSql = $("#cntAuditoria_" + obj + " object").attr("idSql");
      $.post('../server/php/proyectos/borrarSoporte.php', {idSQL: idSql}, function(data, textStatus, xhr) 
      {
        if (!isNaN(data))
        {
          if (data > 0)
          {
            $("#cntAuditoria_" + obj).remove();
            $("#cntAuditoria_AsociarSoporte_" + obj).remove();
          } 
        } else
        {
          Mensaje("Error", data);
        }
      });
    });

    $(document).delegate('#cntAuditoria_NoConformidades input', 'click', function(event) 
    {
        var idObj = $(this).attr("id").replace("chkPoste_", "");
        var Descripcion = $(this).parent("div").parent("div").find("p").text();
        var Cantidad = $(this).parent("div").parent("div").find(".ribbon-inner").text();


        var tds = "";
        if ($(this).is(":checked"))
        {
          $('#cntAuditoria_AistenteSoportes').modal('show');
          $("#txtAuditoria_Observaciones").val("");
          $("#cntAuditoria_AistenteSoportes input").prop("checked", false);

          var campo = idObj;
          campo = campo.replace(/_/g, ".");

          $(".lblAuditoria_GuardarSoporte").attr("codigoNC", campo);
          /*
          $('#cntAuditoria_AistenteSoportes').bPopup(
            {
              follow: [false, false], //x, y
              position: [0, 0] //x, y
            });*/
          tds += '<div class="alert alert-danger alert-dismissible" Criterio="' + $("#txtAuditoria_PuntosControl_Criterio").val() + '" id="expAuditoria_NC_' + $("#txtAuditoria_PuntosControl_Criterio").val() + "_" + idObj + '" role="alert">';
            tds += '<button type="button" class="close chkAuditoria_EliminarNC" data-dismiss="alert" aria-label="Close">';
              tds += '<span aria-hidden="true">×</span>';
            tds += '</button>';
            tds += '<strong>' + $("#txtAuditoria_PuntosControl_Criterio").val() + '</strong> '+ Cantidad + ' : ' + Descripcion;
          tds += '</div>';
          $("#cntAuditoria_PuntosDeControlNC").append(tds);

        } else
        {
          $("#expAuditoria_NC_" + $("#txtAuditoria_PuntosControl_Criterio").val() + "_" + idObj).remove();
        }
    });

    $(document).delegate('.chkAuditoria_EliminarNC', 'click', function(event) 
    {
      var Criterio = $(this).parent("div").attr("Criterio");
      var idObj = $(this).parent("div").attr("id").replace("expAuditoria_NC_" + Criterio + "_" , "");
      
      $("#chkPoste_" + idObj + '[Criterio=' + Criterio + ']').prop("checked", false);
      $.post('../server/php/proyectos/borrarNC.php', 
        {
          idObra : $("#txtIdObra").val(),
          Criterio : Criterio,
          codigoPoste : $("#txtCodigoPoste").val(),
          codigoNC : idObj.replace(/_/g, ".")
        }, function(data, textStatus, xhr) 
        {
        
        }).fail(function()
        {
          Mensaje("Error", "No es posible eliminar el Punto de Control en este momento, por favor intentelo mas tarde.");
          return false;
        });
    });

    $(document).delegate('.btnAuditar_Poste', 'click', function(evento)
    {
      evento.preventDefault();
      $("#frmAuditoria").hide();
      $("#cntAuditoria_Chequeo").removeClass('hide');
      $("#cntAuditoria_Chequeo").show();
      var codigoPoste = $(this).text();
      $("#lblAuditoria_Chequero_Auditado").text(codigoPoste);
      $("#txtCodigoPoste").val(codigoPoste);
      $("#frmAuditoria_Soportes").attr("action", "../server/php/subirArchivoDeSoporte.php?Ruta=Auditorias/" +  $("#txtIdObra").val() + "/" + codigoPoste);

      cargarMaterialesPoste();
      cargarNCMarcadas();
      cargarSoportes_Auditoria();
    });

    $(document).delegate('.btnAuditoria_IrACheck', 'click', function(evento)
    {
      evento.preventDefault();

      $(".btnAuditoria_IrACheck").addClass('btn-outline');
      $(this).removeClass('btn-outline');
      var obj = $(this).attr("Objeto");
      $(".contenedorCheck").hide();

      $("#txtAuditoria_PuntosControl_Criterio").val($(this).text());

      cargarPuntosDeControl({nivel : 1, Criterio : $("#txtAuditoria_PuntosControl_Criterio").val()})
    });

    $(document).delegate('.btnAuditoria_VolverNC', 'click', function(event) 
    {
        $(".contenedorCheck").hide();
        var codigoPadre = $(this).attr("codigoPadre");
        codigoPadre = codigoPadre.split("_");
        if (codigoPadre.length > 1)
        {
          codigoPadre = codigoPadre[0];
        } else
        {
          codigoPadre = "";
        }
        $('#cntAuditoria_Check_' + $("#txtAuditoria_PuntosControl_Criterio").val() + '_' + codigoPadre).show();
    });

    $("#btnAuditoria_VolverPostes").on("click", function(evento)
      {
        evento.preventDefault();
        $("#cntAuditoria_Chequeo").hide();
        $("#frmAuditoria").show();

        $(".lblAuditoria_Guardar").trigger('click');
      });

    $("#frmAuditoria_Soportes").ajaxForm(
    {
      beforeSend: function() 
      {
          var percentVal = '0%';
          var barra = $("#cntAuditoria_Barra_Soportes");
          $(barra).width(percentVal);
          $(barra).text(percentVal);
      },
      uploadProgress: function(event, position, total, percentComplete) {
          
          var percentVal = percentComplete + '%';
          var barra = $("#cntAuditoria_Barra_Soportes");
          $(barra).width(percentVal);
          $(barra).text(percentVal);
      },
      success: function() {
          var percentVal = '100%';
          var barra = $("#cntAuditoria_Barra_Soportes");
          $(barra).width(percentVal);
          $(barra).text(percentVal);
      },
      complete: function(xhr) {
        var respuesta = xhr.responseText;
        
        if (respuesta.substring(0, 11) == "../archivos")
            {
              respuesta = respuesta.replace(/\\/g, "/");
              var arrRespuesta = respuesta.split("$$");
              respuesta = arrRespuesta[0];
              var idObj = arrRespuesta[1];
              var arrArchivo = respuesta.split("/");
              var arrExt = arrArchivo[arrArchivo.length - 1].split(".");
              var nomArchivo = arrArchivo[arrArchivo.length - 1];

              var ext = arrExt[arrExt.length - 1];

              $.post('../server/php/manejoArchivos/soportesAuditoria.php', 
                {
                  archivo : nomArchivo,
                  extension : ext,
                  Usuario : Usuario.id,
                  idObra : $("#txtIdObra").val(),
                  Elemento : $("#txtCodigoPoste").val(),
                  Coordenadas : $("#txtCoordenadas").val(),
                  idObj : idObj
                }, 
                function(data, textStatus, xhr) 
                {
                  if (!isNaN(data))
                  {
                    $("#cntAuditoria_" + idObj + " object").attr("idSql", data);
                  } else
                  {
                    Mensaje("Error", data);
                  }

                }).fail(function()
                {
                  Mensaje("Error", "No fue posible almacenar el Archivo");
                });
            } else
            {
              Mensaje("Error","Hubo un Error, " + respuesta, "danger");
            }
       }
    });

    $(document) .delegate('.cntAuditoria_Grupo', 'click', function(event) 
    {
      var codigoPadre = $(this).attr("codigo");
        cargarPuntosDeControl({codigoPadre : codigoPadre, Criterio : $("#txtAuditoria_PuntosControl_Criterio").val()})
    });
 }
 function iniciarmagnificPopup(idObj)
 {
    $("#img_" + idObj).pinchzoomer();
    $('#cntAuditoria_ContenedorSoportes .' + idObj).magnificPopup(
    {
      type: 'image',
      closeOnContentClick: false,
      callbacks: 
      {
        open: function(item) 
        {
          //$(".mfp-img").pinchzoomer();
        }
      },
      mainClass: 'mfp-fade',
      gallery: 
      {
        enabled: true,
        navigateByImgClick: false,
        preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
        positionStyle: 'fixed'
      }
      
    });
 }

 function cargarMaterialesPoste()
 {
    $.post('../server/php/proyectos/cargarMateriales.php', {idObra: $("#txtIdObra").val(), codigoPoste : $("#txtCodigoPoste").val()}, 
      function(data, textStatus, xhr) 
      {
        $("#cntAuditoria_Materiales ul").remove();
        var tds = "";
        tds += '<ul id="cntAuditoria_MaterialesCheck1" class="bg-cyan-600">';
            tds += '<li class="list-group-item col-md-12">';
              tds += '<div class="media">';
                tds += '<div class="media-left">';
                    tds += '<h1>Cantidad</h1>';
                tds += '</div>';
                tds += '<div class="media-body">';
                  tds += '<h1 class="media-heading">Descripción</h1>';
                tds += '</div>';
                tds += '<div class="media-right">';
                  tds += '<h1>No Conformes</h1><small>Marque con una X las UUCC no conformes</small>';
                tds += '</div>';
              tds += '</div>';
              tds += "<hr>";
            tds += '</li>';
          tds += '</ul>';
          if (typeof data == "object")
          {
              $.each(data, function(index, val) 
              {
                tds += '<ul id="cntAuditoria_MaterialesCheck">';
                  tds += '<li class="list-group-item col-md-12">';
                    tds += '<div class="media">';
                      tds += '<div class="media-left">';
                          tds += '<h4>' + val.cantidad + '</h4>';
                      tds += '</div>';
                      tds += '<div class="media-body">';
                        tds += '<h4 class="media-heading">' + val.Descripcion + '</h4>';
                      tds += '</div>';
                      tds += '<div class="media-right">';
                        tds += '<div class="checkbox-custom checkbox-danger">';
                          tds += '<input type="checkbox" id="chkAuditoria_chkMaterial_' + val.codigoMaterial + '">';
                          tds += '<label for="chkAuditoria_chkMaterial_' + val.codigoMaterial + '"></label>';
                        tds += '</div>';
                      tds += '</div>';
                    tds += '</div>';
                    tds += "<hr>";
                  tds += '</li>';
                tds += '</ul>';
              });

            $("#cntAuditoria_Materiales").append(tds);

            $("#cntAuditoria_Materiales .checkbox-custom input").on("click", function()
              {
                var idObj = $(this).attr("id").replace("chkAuditoria_chkMaterial_", "");
                var Descripcion = $(this).parent("div").parent("div").parent("div").find(".media-heading").text();
                var Cantidad = $(this).parent("div").parent("div").parent("div").find(".media-left").find("h4").text();

                var tds = "";
                if ($(this).is(":checked"))
                {
                  tds += '<div class="alert alert-danger alert-dismissible" id="expAuditoria_Mat_' + idObj+ '" role="alert">';
                    tds += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
                      tds += '<span aria-hidden="true">×</span>';
                    tds += '</button>';
                    tds += Cantidad + ' : ' + Descripcion;
                  tds += '</div>';
                  $("#cntAuditoria_MaterialesNC").append(tds);
                  $("#expAuditoria_Mat_" + idObj + " .close").click(function(event) 
                  {
                    $("#chkAuditoria_chkMaterial_" + idObj).prop("checked", false);
                  });
                } else
                {
                  $("#expAuditoria_Mat_" + idObj).remove();
                }
              });
          }
        
      }, "json");
 }
 function cargarSoportes_Auditoria()
 {
  $("#cntAuditoria_ContenedorSoportes div").remove();
  $("#cntAuditoria_AistenteSoportes_Media div").remove();
  $.post('../server/php/proyectos/cargarSoportesElemento.php', 
    {
      idObra : $("#txtIdObra").val(),
      idPoste : $("#txtCodigoPoste").val() 
    }, function(data, textStatus, xhr) 
    {
      if (typeof data == "object")
      {
        $.each(data, function(index, val) 
        {
          auditoria_AgregarSoporte(val.idObjeto, "../server/archivos/Auditorias/" + val.idObra + "/"+ val.codigo + "/" + val.nomArchivo, val.nomArchivo, val.id);
        });
      }
    }, "json").fail(function()
    {
      Mensaje("Error", "No hay conexión con el servidor");
    });
 }

 function auditoria_AgregarSoporte(idObj, src, Nombre, idSql)
 {
    var tds = "";
    var tds2 = "";
    tds += '<div class="widget widget-shadow col-md-3" id="cntAuditoria_' + idObj + '">';
            tds += '<object idSql="' + idSql + '" width="245" height="230" class="overlay-figure overlay-scale" data="' + src + '"';
            tds += '></object>';
          tds += '<h4 class="widget-title"></h4>';
          tds += '<button type="button" class="btn btn-icon btn-danger btnAuditoria_RemoverImagen" objeto="' + idObj + '"><i class="icon wb-trash" aria-hidden="true"></i></button>';
        tds += '</div>';

        tds2 += '<div class="col-lg-4">'
          tds2 += '<div class="margin-5 col-md-12" id="cntAuditoria_AsociarSoporte_' + idObj + '">';
            tds2 += '<div class="col-lg-2">';
              tds2 += '<div class="checkbox-custom checkbox-success">';
                tds2 += '<input type="checkbox" archivo="' + Nombre + '">';
                tds2 += '<label></label>';
              tds2 += '</div>';
            tds2 += '</div>';
            tds2 += '<div class="col-lg-10">';
              tds2 += '<object class="" width="128" height="128" data="' + src +  '"></object>';
            tds2 += '<div>';
          tds2 += '</div>';
        tds2 += '</div>';

    $("#cntAuditoria_ContenedorSoportes").append(tds);
    $("#cntAuditoria_AistenteSoportes_Media").append(tds2);
 }

 function cargarPuntosDeControl(parametros)
 {
    parametros = parametros || {};

    parametros.id = parametros.id || "";
    parametros.codigo = parametros.codigo || "";
    parametros.Descripcion = parametros.Descripcion || "";
    parametros.Criterio = parametros.Criterio || "";
    parametros.codigoPadre = parametros.codigoPadre || "";
    parametros.nivel = parametros.nivel || "";

    $(".contenedorCheck").hide();
    if ($('#cntAuditoria_Check_' + parametros.Criterio + '_' + parametros.codigoPadre.replace(".", "_")).length)
    {
        $('#cntAuditoria_Check_' + parametros.Criterio + '_' + parametros.codigoPadre.replace(".", "_")).show();
    } else
    {
      //Hay que traerlo
      $.post('../server/php/proyectos/cargarPuntosDeControl.php', 
      {
          id : parametros.id,
          codigo : parametros.codigo,
          Descripcion : parametros.Descripcion,
          Criterio : parametros.Criterio,
          codigoPadre : parametros.codigoPadre,
          nivel : parametros.nivel,
          idObra : $("#txtIdObra").val(),
          codigoPoste : $("#txtCodigoPoste").val()
      }, function(data, textStatus, xhr) 
      {
          if (typeof data == "object")
          {
            var tds = "";
            var checked = "";
            tds += '<div id="cntAuditoria_Check_' + parametros.Criterio + '_' + parametros.codigoPadre.replace(".", "_") + '" class="contenedorCheck">';
            if (parametros.nivel != "1")
            {
              tds += '<div class="col-md-12">';
                tds += '<button type="button" class="btn btn-round btn-primary btn-pill-left btnAuditoria_VolverNC" codigoPadre="' + parametros.codigoPadre.replace(".", "_") + '" >Volver</button>';
              tds += '</div><br>';
            }
              
            $.each(data, function(index, val) 
            {
              val.codigoPadre = val.codigoPadre || "";
              var objTipo = "cntAuditoria_Grupo"
              if (val.Tipo === "Item")
              {
                objTipo = "";
              }
              if (val.Resultado == "No Cumple")
              {
                checked = 'checked="true"';
              } else
              {
                checked = "";
              }

              tds += '<div class="col-md-6 ' + objTipo + '" codigo="' + val.codigo + '">';
                tds += '<div class="example margin-5">';
                  tds += '<div class="ribbon ribbon-clip">';
                    tds += '<span class="ribbon-inner">' + val.codigo + '</span>';
                  tds += '</div>';
                  tds += '<p>' + val.Descripcion + '</p>';
                  if (val.Tipo == "Item")
                  {
                    tds += "<div class='checkbox-custom checkbox-danger'>";
                      tds += "<input type='checkbox' Criterio='" + val.Criterio + "' id='chkPoste_" + val.codigo.replace(/\./g, "_") + "' " + checked + ">";
                      tds += "<label for='chkPoste_" + val.codigo.replace(/\./g, "_") + "'> Marcar como NO conforme</label>";
                    tds += "</div>";
                  }
                tds += '</div>';
              tds += '</div>';
            });
            if (parametros.nivel != "1")
            {
              tds += '<div class="col-md-12">';
                tds += '<button type="button" class="btn btn-round btn-primary btn-pill-right pull-right btnAuditoria_VolverNC" codigoPadre="' + parametros.codigoPadre.replace(".", "_") + '">Volver</button>';
              tds += '</div>';
            }
            tds += '</div>';

            $("#ctnAuditoria_Categorias").append(tds);
          }
      }, "json").fail(function()
      {
        Mensaje("Error", "No es posible descargar los Puntos de Control en este momento");
      });
    }
 }

 function obtenerCoordenadas()
{
  if ($("#modulo_obras_auditoria_html").is(":visible"))
  {
    navigator.geolocation.getCurrentPosition(devCoordenads, errorMapa);
  } 
}

function devCoordenads(datos)
{
  var lat = datos.coords.latitude;
  var lon = datos.coords.longitude;
  $("#txtCoordenadas").val(lat + "," + lon);
}
function errorMapa()
{
  
}

function mesaDeCalidad()
{
  var defaults = $.components.getDefaults("wizard");
  var options = $.extend(true, {}, defaults, {
    autoFocus: false,
    buttonsAppendTo: '#cntMesaDeCalidad_Navegacion',
    buttonLabels: {
            next: 'Siguiente',
            back: 'Anterior',
            finish: 'Cerrar'
        },
    onBeforeChange: function(from, to)
        {
          if (from.index == 0)
          {
            mesaDeCalidad_Asistentes_Guardar();
          }
          if (from.index == 1)
          {
            cargarCompromisos();
          }
        }
  });

  $("#frmNoCoformidades_AgregarCompromiso").attr("etapa", "");

  var wizard = $("#cntMesaDeCalidad").wizard(options).data('wizard');
  function mesaDeCalidad_Asistentes_Guardar()
  {
    var Asistentes = {};
    var substringMatcher = function(strs) 
    {
      return function findMatches(q, cb) 
      {
      var matches, substringRegex;

      // an array that will be populated with substring matches
      matches = [];

      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');

      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });
      cb(matches);
      };
    };
    $("#frmNoConformidades_Asistentes").generarDatosEnvio("txtNoConformidades_Asistentes_", function(datos)
      {
        var contactos = {};
        var cntContactos = $("#cntNoConformidades_Contactos .row");
        var controlesContactos = {};
        
        var idx = 0;
        Asistentes = [];

        $.each(cntContactos, function(index, val) 
        {
           controlesContactos = $(val).find(".guardar");
           contactos[index] = {};
           contactos[index]['Nombre'] =  $(controlesContactos[0]).val();
           contactos[index]['Correo'] = $(controlesContactos[1]).val();
           contactos[index]['Cargo'] = $(controlesContactos[2]).val();
           contactos[index]['Empresa'] = $(controlesContactos[3]).val();
           Asistentes[index] = $(controlesContactos[0]).val();
        });
        
        contactos = JSON.stringify(contactos);  
        Asistentes[idx] = Usuario.nombre;

        $("#txtNoConformidades_CompromisoResponsable").typeahead(
        {
          hint: true,
          highlight: true,
          minLength: 1
        },
        {
          source: substringMatcher(Asistentes)
        });

        $.post('../server/php/proyectos/guardarMesaDeCalidad.php', 
          {
            idObra : $("#txtIdObra").val(), 
            datos: datos, 
            contactos : contactos, 
            Usuario : Usuario.id
          }, function(data, textStatus, xhr) 
        {
          if (data == 1)
            {
              Mensaje("Hey", "La información ha sido guardada");
            } else
            {
              if (data != 0)
              {
                Mensaje("Error", "No se ha agregado ningún dato" + data);
              }
            }
        });
      });
  }


  $("#btnNoConformidades_AgregarContacto").on("click", function(evento)
    {
      evento.preventDefault();

      var tds = '<div class="col-md-12 margin-top-20 row">';
          tds += '<div class="form-group col-md-10 form-material">';
            tds += '<input type="text" class="form-control guardar">';
            tds += '<label class="floating-label">Nombre</label>';
          tds += '</div>';
          tds += '<div class="form-group col-md-2  form-material">';
            tds += '<button class="btn btn-danger btn-icon btn btn-round btnNoConformidades_BorrarContacto"><i class="icon wb-trash"></i></button>';
          tds += '</div>';
          tds += '<div class="form-group col-md-4 form-material">';
            tds += '<input type="email" class="form-control guardar">';
            tds += '<label class="floating-label">Correo</label>';
          tds += '</div>';
          tds += '<div class="form-group col-md-4 form-material">';
            tds += '<input type="text" class="form-control guardar">';
            tds += '<label class="floating-label">Cargo</label>';
          tds += '</div>';
          tds += '<div class="form-group col-md-4 form-material">';
            tds += '<input type="text" class="form-control guardar">';
            tds += '<label class="floating-label">Empresa</label>';
          tds += '</div>';
        tds += '</div>';

      $("#cntNoConformidades_Contactos").append(tds);
    });

 
  $(document).delegate('.btnNoConformidades_BorrarContacto', 'click', function(event) 
    {
      event.preventDefault();
      $(this).parent("div").parent("div").remove();
    });

  $("#cntMesaDeCalidad [data-plugin=datepicker]").datepicker({'autoclose' : true});
  $("#txtNoConformidades_Asistentes_Hora").timepicker({ 'timeFormat': 'H:i:s',  'scrollDefault': 'now'  });

  $("#btnNoConformidades_AgregarCompromiso, #btnNoConformidades_AgregarCompromisoResumen").on("click", function(evento)
  {
    evento.preventDefault();
    $("#lblNoConformidades_AgregarCompromiso").text("Agregar Compromiso");
    
    $("#txtNoConformidades_Compromiso").val("");
    $("#txtNoConformidades_CompromisoFecha").val("");
    $("#txtNoConformidades_CompromisoResponsable").val("");

    $("#frmNoCoformidades_AgregarCompromiso").attr("idSQL", 0);

    $("#cntNoConformidades_AgregarCompromiso").modal('show');
    var etapa = $(this).attr("id").replace("btnNoConformidades_AgregarCompromiso", "");

    $("#frmNoCoformidades_AgregarCompromiso").attr("etapa", etapa);
  });

  $(document).delegate('.btnNoConformidades_EditarCompromiso', 'click', function(event) 
  {
    event.preventDefault();
    $("#lblNoConformidades_AgregarCompromiso").text("Editar Compromiso");

    var textos = $(this).parent("td").parent("tr").find('td');
    
    $("#txtNoConformidades_Compromiso").val($(textos[0]).text());
    $("#txtNoConformidades_CompromisoFecha").val($(textos[1]).text());
    $("#txtNoConformidades_CompromisoResponsable").val($(textos[2]).text());
    var idCompromiso = $(this).attr("idSQL");

    $("#frmNoCoformidades_AgregarCompromiso").attr("idSQL", idCompromiso);

    $("#cntNoConformidades_AgregarCompromiso").modal('show');
  });

  $(document).delegate('.btnNoConformidades_EliminarCompromiso', 'click', function(event) 
  {
    event.preventDefault();
    
    var idCompromiso = $(this).attr("idSQL");
    var objCnt = this;

    $.post("../server/php/proyectos/borrarCompromiso.php", {
          id : idCompromiso,
          Usuario : Usuario.id
        }, function(data)
        {
          if (data > 0)
          {
            Mensaje("Error", "Compromiso Borrado");
            $(objCnt).parent("td").parent("tr").remove();
          } 
        });
  });

  $("#frmNoCoformidades_AgregarCompromiso").on("submit", function(evento)
    {
      evento.preventDefault();
      var idCompromiso = $("#frmNoCoformidades_AgregarCompromiso").attr("idSQL");

      if ($("#frmNoCoformidades_AgregarCompromiso").attr("etapa") == "Resumen")
      {
        $("#lblNoConformidades_NodoEnPantalla").text("");
        $("#lblNoConformidades_AspectoEvaluadoCodigo").text("");
        $("#lblNoConformidades_Criterio").text("");
      }


      $.post('../server/php/proyectos/guardarCompromiso.php', 
        {
          id : idCompromiso,
          idObra : $("#txtIdObra").val(),
          codigoPoste : $("#lblNoConformidades_NodoEnPantalla").text(),
          codigoNC : $("#lblNoConformidades_AspectoEvaluadoCodigo").text(),
          Criterio : $("#lblNoConformidades_Criterio").text(),
          Compromiso : $("#txtNoConformidades_Compromiso").val(),
          Responsable : $("#txtNoConformidades_CompromisoResponsable").val(),
          fechaLimite : $("#txtNoConformidades_CompromisoFecha").val(),
          Usuario : Usuario.id
        }, 
      function(data, textStatus, xhr) 
      {
        if (data > 0)
        {
          Mensaje("Ok", "Compromiso Guardado");
          $("#cntNoConformidades_AgregarCompromiso").modal('hide');

          if (data != idCompromiso)
          {
            msc_AgregarCompromiso($("#txtNoConformidades_Compromiso").val(), $("#txtNoConformidades_CompromisoFecha").val(), $("#txtNoConformidades_CompromisoResponsable").val(), data);
          } else
          {
            var objBtn  = $(".btnNoConformidades_EditarCompromiso" + $("#frmNoCoformidades_AgregarCompromiso").attr("etapa") + "[idSQL='" + idCompromiso + "']");

            var fila = $(objBtn).parent("td").parent("tr").find("td");
            $(fila[0]).text($("#txtNoConformidades_Compromiso").val());
            $(fila[1]).text($("#txtNoConformidades_CompromisoFecha").val());
            $(fila[2]).text($("#txtNoConformidades_CompromisoResponsable").val());
          }
        }
      });
    });

  function msc_AgregarCompromiso(Compromiso, Fecha, Responsable, idSQL)
  {
    var tds = "";
    tds += '<tr>';
      tds += '<td>' + Compromiso + '</td>';
      tds += '<td>' + Fecha + '</td>';
      tds += '<td>' + Responsable + '</td>';
      tds += '<td><button class="btn btn-primary btnNoConformidades_EditarCompromiso" idSQL="' + idSQL + '"><i class="icon wb-edit"></i> Editar</button></td>';
      tds += '<td><button class="btn btn-danger btnNoConformidades_EliminarCompromiso" idSQL="' + idSQL + '"><i class="icon fa-trash"></i> Quitar</button></td>';
    tds += '</tr>';
    $("#tblNoConformidades_Compromisos" + $("#frmNoCoformidades_AgregarCompromiso").attr("etapa") + " tbody").append(tds);
  } 

  function cargarCompromisos()
  {
    $("#tblNoConformidades_CompromisosResumen tbody tr").remove();
    $.post('../server/php/proyectos/cargarCompromisos.php', {idObra: $("#txtIdObra").val(), codigoPoste: 0, codigoNC : 0, Criterio : 0}, function(data, textStatus, xhr) 
    {
      if (data != 0)
      {
        var tds = "";
        $.each(data, function(index, val) 
        {
          tds += '<tr>';
            tds += '<td>' + val.Compromiso + '</td>';
            tds += '<td>' + val.fechaLimite + '</td>';
            tds += '<td>' + val.Responsable + '</td>';
            tds += '<td><button class="btn btn-primary btnNoConformidades_EditarCompromiso" idSQL="' + val.id + '"><i class="icon wb-edit"></i> Editar</button></td>';
            tds += '<td><button class="btn btn-danger btnNoConformidades_EliminarCompromiso" idSQL="' + val.id + '"><i class="icon fa-trash"></i> Quitar</button></td>';
          tds += '</tr>';
        });
      }
        $("#tblNoConformidades_CompromisosResumen tbody").append(tds);
    }, "json");
  } 

  $(document).delegate('.btnNoConformidades_Ver', 'click', function(event) 
  {
    $("#listadoNC").hide();
    $("#MESA").show();
    $("#cntMesa_Imagenes div").remove();

    var codigoNC = $(this).attr("NC");
    var Criterio = $(this).attr("criterio");

    $("#lblNoConformidades_AspectoEvaluadoCodigo").text(codigoNC);
    $("#lblNoConformidades_Criterio").text(Criterio);
    $("#lblNoConformidades_AspectoEvaluadoDesc").text($(this).attr("Descripcion"));

    $.post('../server/php/proyectos/cargarPostesNC.php', {idObra: $("#txtIdObra").val(), codigoNC: codigoNC, Criterio : Criterio}, function
      (data, textStatus, xhr) 
      {
        $("#cntNoCoformidades_ContenedorPostes button").remove();
        $("#cntNoConformidades_Ubicacion").slideUp();
        $("#frmNoConformidades_Clasificacion").slideUp();
        $("#lblNoConformidades_NodoEnPantalla").text("Ninguno");
        var tds = "";
        $.each(data, function(index, val) 
        {
           tds += '<button type="button" class="btn btn-outline btn-warning margin-right-10 btnMASC_Ver" NC="' + codigoNC + '">' + val.codigoPoste + '</button>'  
        });

        $("#cntNoCoformidades_ContenedorPostes").append(tds);

        $(".btnMASC_Ver").on("click", function(evento)
        {
          evento.preventDefault();
          if ($("#cntMesa_Imagenes").hasClass("slick-slider"))
          {
            $("#cntMesa_Imagenes").slick('unslick');
            $("#cntMesa_Imagenes div").remove();
          }
          var codigoNC = $(this).attr("NC");
          var codigoPoste = $(this).text();

          $("#lblNoConformidades_NodoEnPantalla").text(codigoPoste);

          $.post('../server/php/proyectos/cargarSoportes.php', {
              idObra: $("#txtIdObra").val(), codigoNC: codigoNC, codigoPoste:codigoPoste, Criterio: $("#lblNoConformidades_Criterio").text()}, 
            function(data2, textStatus, xhr) 
            {  
              var tds = "";
              $.each(data2, function(index, val) 
              {
              
                tds += '<div>';  
                  tds += '<img class="width-full imgSoporte" src="../server/archivos/Auditorias/' + $("#txtIdObra").val() + "/" + codigoPoste + "/" + val.foto + '"/>';
                tds += '</div>';
                $("#lblMesa_Observaciones").text(val.observaciones);
                var tmpCoordenadas = val.coordenadas.split(",");
                iniciarMapa(tmpCoordenadas[0], tmpCoordenadas[1]);
                $("#frmNoConformidades_Clasificacion").slideDown('fast', function() 
                {
                  
                });
                $("#lnkNoConformidades_Coordenadas").attr("href", "https://www.google.com.co/maps/search/" + val.coordenadas + "/@" + val.coordenadas + ",17z?hl=es");
                $("#lnkNoConformidades_Coordenadas").text(val.coordenadas);
                $("#lnkNoConformidades_Direccion").attr("href", "https://www.google.com.co/maps/search/" + val.coordenadas + "/@" + val.coordenadas + ",17z?hl=es");
                $("#lnkNoConformidades_Direccion").text(val.Direccion);
                $("#txtNoConformidades_justificacion").val(val.justificacion);
                $("#txtNoConformidades_justificacionClasificacion").val(val.justificacionClasificacion);
                $("#cboNoConformidades_ClasificacionFinal").val(val.Clasificacion);

              });
              $("#cntMesa_Imagenes").append(tds);
              $("#cntMesa_Imagenes").slick({dots: true});
              $("#cntMesa_Imagenes .imgSoporte").pinchzoomer();

            }, "json");

          $("#tblNoConformidades_Compromisos tbody tr").remove();

          $.post("../server/php/proyectos/cargarCompromisos.php", 
            {
              idObra : $("#txtIdObra").val(), 
              codigoNC : codigoNC, 
              codigoPoste :codigoPoste, 
              Criterio : $("#lblNoConformidades_Criterio").text()
            },
            function (data3)
            {
              if (data != 0)
              {
                $.each(data3, function(index, val) 
                {
                  msc_AgregarCompromiso(val.Compromiso, val.fechaLimite, val.Responsable, val.id);
                });
              }
            },"json");
        });
      }, "json");
  });  

  $("#btnAuditoria_VolverNC").on("click", function(evento)
  {
    evento.preventDefault();
    $("#MESA").hide();   
    $("#listadoNC").show();
  });

  $("#frmNoConformidades_Clasificacion").on("submit", function(evento)
  {
    evento.preventDefault();
    $.post('../server/php/proyectos/guardarMSC.php', 
      {
        idObra : $("#txtIdObra").val(),
        codigoPoste : $("#lblNoConformidades_NodoEnPantalla").text(),
        Criterio : $("#lblNoConformidades_Criterio").text(),
        codigoNC : $("#lblNoConformidades_AspectoEvaluadoCodigo").text(),
        Clasificacion : $("#cboNoConformidades_ClasificacionFinal").val(),
        justificacionClasificacion : $("#txtNoConformidades_justificacionClasificacion").val(),
        justificacion : $("#txtNoConformidades_justificacion").val()
      }, function(data, textStatus, xhr) 
      {
        if (data == 1)
        {
          Mensaje("Ok", "Datos Guardados");
        } else
        {
          Mensaje("Error", data);
        }
      });

  });

  $("#btnNoConformidades_VerActa").on("click", function(evento)
  {
    evento.preventDefault();
    abrirURL("../server/formatos/generarActa.php?id=" + $("#txtIdObra").val());
  });

  $("#btnNoConformidades_VerRSeguridad").on("click", function(evento)
  {
    evento.preventDefault();
    abrirURL("../server/formatos/generarFormatoSeguridad.php?id=" + $("#txtIdObra").val());
  });

  $("#btnNoConformidades_VerRCalidad").on("click", function(evento)
  {
    evento.preventDefault();
    abrirURL("../server/formatos/generarFormatoCalidad.php?id=" + $("#txtIdObra").val())
    
  });

}

function abrirURL(url)
{
  var win = window.open(url, "_blank", "directories=no, location=no, menubar=no, resizable=yes, scrollbars=yes, statusbar=no, tittlebar=no");
  win.focus();
}
function cargarNCC()
{
  $.post('../server/php/proyectos/cargarResultado.php', {idObra: $("#txtIdObra").val()}, function(data, textStatus, xhr) 
  {
    $("#lstListadoNC div").remove();

    var tds = "";
    var numConformes = 0; 
    var numNoConformes = 0; 
    tds += '';//'<h4 class="list-group-item"> <i class="icon">*</i>Descripción de la NC (Numero de Postes que presentan la NC)</h4>';
    if (typeof data == "object")
    {
      $("#lblNoConformidades_ItemsEvaluados").text(data.ItemsRevisados);

      var clase = "";

      $.each(data, function(index, val) 
      {
        if (val.Codigo != undefined)
        {
          if (val.Codigo == 0)
          {
            numConformes = val.Cantidad;
          } else
          {
            numNoConformes++;
          }

          clase = "danger";
          if (val.Criterio == "General")
          {
            clase = "warning";
          }

          if (val.Criterio == "Calidad")
          {
            clase = "success";
          }

          tds += '<div class="col-md-6">';
            tds += '<div class="bg-blue-grey-100 padding-15 margin-5">';
              tds += '<h5><span class="badge badge-radius badge-dark">' + val.Codigo + '</span> ' + val.Descripcion + '</h5>';
              tds += '<h6>Se identificó en <span class="badge badge-danger">' + val.Cantidad + '</span> Items</h6>';
              tds += '<div class="text-right">';
                tds += '<div class="ribbon ribbon-clip ribbon-bottom ribbon-' + clase + '"><span class="ribbon-inner">' + val.Criterio + '</span></div>';
                  tds += '<button type="button" Criterio="' + val.Criterio + '" NC="' + val.Codigo + '" Descripcion="' + val.Descripcion + '" class="btn btn-info btn-icon margin-horizontal-20 btnNoConformidades_Ver">';
                  tds += '<i class="icon wb-eye" aria-hidden="true"></i> Ver</button>';
              tds += '</div>';
            tds += '</div>';
          tds += '</div>';
        }
        //tds += '<li NC=' + val.Codigo + ' class="">' + val.Codigo + '. ' + val.Descripcion + ' ('+ val.Cantidad+ ')</li>';
      });
    } else
    {
      $("#lblNoConformidades_ItemsEvaluados").text(0);
    }
    $("#lstListadoNC").append(tds);

    $("#lblNoConformidades_ItemsConformes").text(numConformes);
    $("#lblNoConformidades_ItemsNoConformes").text((data.ItemsRevisados - numConformes));
    $("#lblNoConformidades_AspectosNoConformes").text(numNoConformes);
  }, "json");

  mesaDeCalidad_CargarAsistentes();
  function mesaDeCalidad_CargarAsistentes()
  {
    $.post('../server/php/proyectos/cargarContactosObra.php', {idObra: $("#txtIdObra").val()}, function(data, textStatus, xhr) 
    {
      $("#cntNoConformidades_Contactos .row").remove();

      if (data.datos != 0)
      {
        var fDate = data.datos.Fecha.split(" ");
        $("#txtNoConformidades_Asistentes_Lugar").val(data.datos.Lugar);
        $("#txtNoConformidades_Asistentes_Fecha").val(fDate[0]);
        $("#txtNoConformidades_Asistentes_Hora").val(fDate[1]);
      }

      if (data.Contactos != 0)
      {
        $.each(data.Contactos, function(index, val) 
        {
          $("#btnNoConformidades_AgregarContacto").trigger('click');
          $($("#cntNoConformidades_Contactos .row .guardar")[4 * index]).val(val.Nombre);
          $($("#cntNoConformidades_Contactos .row .guardar")[4 * index + 1] ).val(val.Correo);
          $($("#cntNoConformidades_Contactos .row .guardar")[4 * index + 2] ).val(val.cargo);
          $($("#cntNoConformidades_Contactos .row .guardar")[4 * index + 3] ).val(val.Empresa);
        });
      }
    }, "json");

  }

}


function iniciarMapa(Lat, Lon)
{
  if (typeof GMaps == "undefined")
  {
    $("#cntNoConformidades_Ubicacion").slideUp();
  } else
  {
    if (Lat != undefined && Lon != undefined)
    {
      $("#cntNoConformidades_Ubicacion").slideDown();
      var map = new GMaps({
        el: '#customGmap',
        lat: Lat,
        lng: Lon,
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

      map.drawOverlay({
        lat: Lat,
        lng: Lon,
        content: '<i class="wb-map" style="font-size:40px;color:' + $.colors("red", 500) + ';"></i>',
      });

      map.addStyle({
        styledMapName: "Styled Map",
        styles: $.components.get('gmaps', 'styles'),
        mapTypeId: "map_style"
      });

      map.setStyle("map_style");
    }
  }
}

function documental()
{
  documental_cargar($("#frmDocumental_Archivos"), $("#cntDocumental_Archivos"), $("#txtIdObra").val());

  $("#btnInforme_VerActa").on("click", function(evento)
  {
    evento.preventDefault();
    abrirURL("../server/formatos/generarActa.php?id=" + $("#txtIdObra").val());
  });

  $("#btnInforme_VerRSeguridad").on("click", function(evento)
  {
    evento.preventDefault();
    abrirURL("../server/formatos/generarFormatoSeguridad.php?id=" + $("#txtIdObra").val());
  });

  $("#btnInforme_VerRCalidad").on("click", function(evento)
  {
    evento.preventDefault();
    abrirURL("../server/formatos/generarFormatoCalidad.php?id=" + $("#txtIdObra").val())
  });

  $("#btnInforme_ActaAnterior").on("click", function(evento)
  {
    evento.preventDefault();
    $.post('../server/php/proyectos/guardarActaAnterior.php', {Usuario: Usuario.id, idObra: $("#txtIdObra").val(), datos : $("#txtInforme_ActaAnterior").val()}, function(data, textStatus, xhr) 
    {
      Mensaje("Hey", "Dato enviado", "success");
    });
  });

  $("#frmDocumental_Archivos").ajaxForm(
  {
    beforeSend: function() 
    {
        var percentVal = '0%';
        $("#txtDocumental_ArchivoProgreso").width(percentVal);
        $("#txtDocumental_ArchivoProgreso").text(percentVal);
    },
    uploadProgress: function(event, position, total, percentComplete) {
        
        var percentVal = percentComplete + '%';
        $("#txtDocumental_ArchivoProgreso").width(percentVal);
        $("#txtDocumental_ArchivoProgreso").text(percentVal);
    },
    success: function() {
        var percentVal = '100%';
        $("#txtDocumental_ArchivoProgreso").width(percentVal);
        $("#txtDocumental_ArchivoProgreso").text(percentVal);
    },
    complete: function(xhr) {
      var respuesta = xhr.responseText;
      if (respuesta.substring(0, 11) == "../archivos")
          {
            var tds = "";
            arrNomArchivo = respuesta.split("$$");
            arrNomArchivo = arrNomArchivo[0];
            var arrArchivo = arrNomArchivo.split("/");
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
                      tds += '<a class="name" href="' + arrNomArchivo.replace("../", "../server/") + '" target="_blank">' + nomArchivo + '</a>';
                      tds += '<a class="btn btn-danger pull-right btnDocumental_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
                    tds += '</h4>';
                  tds += '</div>';
                tds += '</div>';
              tds += '</li>';

          $("#cntDocumental_Archivos").append(tds);
          } else
          {
            Mensaje("Error","Hubo un Error, " + respuesta, "danger");
          }
     }
  }); 
}

$(document).delegate('.btnDocumental_ArchivosEliminar', 'click', function(event) 
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

function documental_cargar(form, contenedor, pRuta)
{
  $(form).attr("action", "../server/php/subirArchivoDeSoporte.php?Ruta=Documental/" +  pRuta);
  $(form)[0].reset();
  $(contenedor).find("li").remove();

  $.post('../server/php/listarArchivos.php', {ruta: 'Documental/' + pRuta}, function(archivos) 
  {
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
                        tds2 += '<a class="name" href="' + Archivo.ruta.replace("../", "../server/") + "/" + Archivo.nomArchivo + '" target="_blank">' + Archivo.nomArchivo + '</a>';
                        tds2 += '<a class="btn btn-danger pull-right btnDocumental_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
                      tds2 += '</h4>';
                        tds2 += '<p class="list-group-item-text">';
                tds2 +='<small><i>' + Archivo.fecha + '</i></small>';
                        tds2 += '</p>';
                    tds2 += '</div>';
                  tds2 += '</div>';
                tds2 += '</li>';
        });
      });
      
      $(contenedor).append(tds2);
    } 
  }, "json");
}

function reportes()
{
  $('#frmReporte [data-plugin=datepicker]').datepicker({'autoclose' : true});

  var date = new Date();
  var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
  var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  $("#txtReporte_FechaIni").val(primerDia.getFullYear() + "-" + CompletarConCero(primerDia.getMonth() + 1, 2) + "-01");
  $("#txtReporte_FechaFin").val(ultimoDia.getFullYear() + "-" + CompletarConCero(ultimoDia.getMonth() + 1, 2) + "-" + CompletarConCero(ultimoDia.getDate(), 2));

  $(".lnkReporte_Opcion").on("click", function()
  {
    $("#cntReportes_Filtros").hide();
    $("#cntReportes_Opciones").hide();


    var idTabla = parseInt($(this).attr("idOpcion"));
    var filtro = {Usuario: Usuario.id, fechaIni : $("#txtReporte_FechaIni").val(), fechaFin : $("#txtReporte_FechaFin").val()};

    var table = {};
    switch (idTabla)
    {
      case 9:
        var tdc = "";

            tdc += "<tr>";
              tdc += '<th>Codigo Obra</th>';
              tdc += '<th>Descripción</th>';
              tdc += '<th>Area</th>';
              tdc += '<th>Fecha Inicio Real</th>';
              tdc += '<th>Fecha inicio Prev</th>';
              tdc += '<th>Fecha Fin Real</th>';
              tdc += '<th>Fecha Fin Prev</th>';
              tdc += '<th>Desc Fech-fin</th>';
              tdc += '<th>Tipo de Inspección</th>';
              tdc += '<th>Delegación</th>';
              tdc += '<th></th>';
            tdc += "</tr>";
        $("#tblReportes thead").append(tdc);

        $.post('../server/php/proyectos/reportes/obras/InspeccionesPorDelegaciones.php', filtro, function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var tds = "";
            
            $.each(data, function(index, val) 
            {
               tds += '<tr>';
                tds += '<td>' + val.codigoObra + '</td>';
                tds += '<td>' + val.Descipcion + '</td>';
                tds += '<td>' + val.Area + '</td>';
                tds += '<td>' + val.fechaInicio + '</td>';
                tds += '<td>' + val.fechaInicioPrev + '</td>';
                tds += '<td>' + val.fechaFinalizacion + '</td>';
                tds += '<td>' + val.fechaFinalizacionPrev + '</td>';
                tds += '<td>' + val.Desv + '</td>';
                tds += '<td>' + val.tipoInspeccion + '</td>';
                tds += '<td>' + val.Delegacion + '</td>';
                tds += '<td></td>';
               tds += '</tr>';
            });

            $("#tblReportes").crearDataTable(tds, function(){}, tdc);


          } else
          {
            Mensaje("No hay datos para Mostrar");
          }          
        }, "json");
      break;
      case 10:
        var tdc = "";

            tdc += "<tr>";
              tdc += '<th>Delegación</th>';
              tdc += '<th>Mes</th>';
              tdc += '<th>Previstas</th>';
              tdc += '<th>Ejecutadas</th>';
              tdc += '<th></th>';
            tdc += "</tr>";
        $("#tblReportes thead").append(tdc);

        $.post('../server/php/proyectos/reportes/obras/avancePlanDeTrabajo.php', filtro, function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var tds = "";
            
            $.each(data, function(index, val) 
            {
               tds += '<tr>';
                tds += '<td>' + val.mes + '</td>';
                tds += '<td>' + val.Delegacion + '</td>';
                tds += '<td>' + val.cantP + '</td>';
                tds += '<td>' + val.cantR + '</td>';
                tds += '<td></td>';
               tds += '</tr>';
            });

            $("#tblReportes").crearDataTable(tds, function(){}, tdc);


          } else
          {
            Mensaje("No hay datos para Mostrar");
          }          
        }, "json");
      break;
      case 1:
        var tdc = "";

            tdc += "<tr>";
              tdc += '<th>Resumen de Inspecciones de Seguridad en Obras</th>';
              tdc += '<th>Mes</th>';
              tdc += '<th>Cantidad</th>';
              tdc += '<th></th>';
            tdc += "</tr>";
        $("#tblReportes thead").append(tdc);

        $.post('../server/php/proyectos/reportes/obras/InspeccionesSeguridadObras.php', filtro, function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var tds = "";
            
            $.each(data, function(index, val) 
            {
               tds += '<tr>';
                tds += '<td>' + val.Mes + '</td>';
                tds += '<td>' + val.Concepto + '</td>';
                tds += '<td>' + val.cantidadInspeccionadas + '</td>';
                tds += '<td></td>';
               tds += '</tr>';
            });

            $("#tblReportes").crearDataTable(tds, function(){}, tdc);


          } else
          {
            Mensaje("No hay datos para Mostrar");
          }          
        }, "json");
      break;
      case 2:
        var tdc = "";

            tdc += "<tr>";
              tdc += '<th>Resumen de Inspecciones de Calidad en Obras</th>';
              tdc += '<th>Mes</th>';
              tdc += '<th>Cantidad</th>';
              tdc += '<th></th>';
            tdc += "</tr>";
        $("#tblReportes thead").append(tdc);

        $.post('../server/php/proyectos/reportes/obras/InspeccionesCalidadObras.php', filtro, function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var tds = "";
            
            $.each(data, function(index, val) 
            {
               tds += '<tr>';
                tds += '<td>' + val.Mes + '</td>';
                tds += '<td>' + val.Concepto + '</td>';
                tds += '<td>' + val.cantidadInspeccionadas + '</td>';
                tds += '<td></td>';
               tds += '</tr>';
            });

            $("#tblReportes").crearDataTable(tds, function(){}, tdc);


          } else
          {
            Mensaje("No hay datos para Mostrar");
          }          
        }, "json");
      break;
      case 3:
        var tdc = "";

            tdc += "<tr>";
              tdc += '<th>Mes</th>';
              tdc += '<th>Delegación</th>';
              tdc += '<th>Tipo de Obra</th>';
              tdc += '<th>Vigilante</th>';
              tdc += '<th>Criterio</th>';
              tdc += '<th>Resultado</th>';
              tdc += '<th>Tipo de Defecto</th>';
              tdc += '<th>Cantidad</th>';
              tdc += '<th></th>';
            tdc += "</tr>";
        $("#tblReportes thead").append(tdc);

        $.post('../server/php/proyectos/reportes/obras/ResumenObrasInspeccionadasSeguridad.php', filtro, function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var tds = "";
            
            $.each(data, function(index, val) 
            {
               tds += '<tr>';
                tds += '<td>' + val.Mes + '</td>';
                tds += '<td>' + val.Delegacion + '</td>';
                tds += '<td>' + val.TipoObra + '</td>';
                tds += '<td>' + val.Vigilante + '</td>';
                tds += '<td>' + val.Criterio + '</td>';
                tds += '<td>' + val.Resultado + '</td>';
                tds += '<td>' + val.tipoDefecto + '</td>';
                tds += '<td>' + val.Cantidad + '</td>';
                tds += '<td></td>';
               tds += '</tr>';
            });

            $("#tblReportes").crearDataTable(tds, function(){}, tdc);


          } else
          {
            Mensaje("No hay datos para Mostrar");
          }          
        }, "json");
      break;
      case 4:
        var tdc = "";

            tdc += "<tr>";
              tdc += '<th>Mes</th>';
              tdc += '<th>Delegación</th>';
              tdc += '<th>Tipo de Obra</th>';
              tdc += '<th>Vigilante</th>';
              tdc += '<th>Criterio</th>';
              tdc += '<th>Resultado</th>';
              tdc += '<th>Tipo de Defecto</th>';
              tdc += '<th>Cantidad</th>';
              tdc += '<th></th>';
            tdc += "</tr>";
        $("#tblReportes thead").append(tdc);

        $.post('../server/php/proyectos/reportes/obras/ResumenObrasInspeccionadasCalidad.php', filtro, function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var tds = "";
            
            $.each(data, function(index, val) 
            {
               tds += '<tr>';
                tds += '<td>' + val.Mes + '</td>';
                tds += '<td>' + val.Delegacion + '</td>';
                tds += '<td>' + val.TipoObra + '</td>';
                tds += '<td>' + val.Vigilante + '</td>';
                tds += '<td>' + val.Criterio + '</td>';
                tds += '<td>' + val.Resultado + '</td>';
                tds += '<td>' + val.tipoDefecto + '</td>';
                tds += '<td>' + val.Cantidad + '</td>';
                tds += '<td></td>';
               tds += '</tr>';
            });

            $("#tblReportes").crearDataTable(tds, function(){}, tdc);


          } else
          {
            Mensaje("No hay datos para Mostrar");
          }          
        }, "json");
      break;
    }

    $("#lblReportes_Titulo").text($(this).text());

    $("#cntReportes_Tablas img").hide();
    $("#imgReportes_" + idTabla).show();
  });

  $("#cntReportes_Opciones").width(0);

  $("#btnReportes_Opciones").on("click", function()
  {
    if ($("#cntReportes_Opciones").is(":visible"))
    {
      $("#cntReportes_Opciones").animate({
        width: 0},
        1000, function() 
        {
          $("#cntReportes_Opciones").hide();
        });
    } else
    {
      $("#cntReportes_Opciones").show();
      $("#cntReportes_Opciones").animate({
        width: "80%"},
        1000, function() 
        {
          $("#cntReportes_Filtros").hide();
        });
    }
  });

  $("#btnReportes_Opciones").trigger('click');

  $("#btnReportes_Filtros").on("click", function()
  {
    alert("-->");
    if ($("#cntReportes_Filtros").is(":visible"))
    {
      alert("si");
      //$("#cntReportes_Filtros").slideUp();
    } else
    {
      alert("sino");
      //$("#cntReportes_Filtros").slideDown();
    }
  });
}

function informe()
{
  $("#btnInforme_VerInforme").on("click", function(evento)
  {
    evento.preventDefault();
    abrirURL("../server/formatos/generarInformeObra.php?id=" + $("#txtIdObra").val())
  });

  $("#frmInforme_Complemento").on("submit", function(evento)
  {
    evento.preventDefault();

  })
}
function informe_TraerDatos()
{
  $("#txtInforme_Presupuesto").val("");
  $("#txtInforme_CosteRepTrabajo").val("");
  $("#txtInforme_CosteRealTrabajo").val("");

  $.post('../server/php/proyectos/cargarComplementoInforme.php', {idObra: $("#txtIdObra").val()}, 
    function(data, textStatus, xhr) 
    {
      if (data != 0)
      {
        $.each(data, function(index, val) 
        {
          $("#txtInforme_Presupuesto").val(val.Presupuesto);
          $("#txtInforme_CosteRepTrabajo").val(val.CosteRepTrabajo);
          $("#txtInforme_CosteRealTrabajo").val(val.CosteRealTrabajo);
        });
      }
    }, "json");
}

function poda_VerCircuitos()
{
  poda_CargarSectores();

  function poda_cargarCircuitos()
  {
    var valores = "";
    var obj = $("#cntPoda_VerCircuitos_ListaSectores input:checked");
    
    if (obj.length > 0)
    {
      $.each(obj, function(index, val) 
      {
        valores += $(val).attr("idSector") + ", ";
      });
      valores = valores.slice(0,valores.length-2);

      $.post('../server/php/proyectos/poda/cargarCircuitosPorSector.php', {Usuario : Usuario.id, Sectores: valores}, function(data, textStatus, xhr) 
      {
        if (data != 0)
        {
          var tds = "";
          $.each(data, function(index, val) 
          {
            tds += '<div class="col-md-4 cntPoda_VerCircuitos_Circuito" filtro="' + val.Nombre.toLowerCase() + '">';
              tds += '<div class="margin-5">';
                tds += '<button type="button" class="btn btn-labeled btn-block bg-blue-grey-500 white btnPoda_AbrirCircuito" idCircuito="' + val.idCircuito + '">';
                  tds += '<span class="btn-label bg-light-green-500"><i class="icon wb-chevron-right-mini" aria-hidden="true"></i></span>' + val.Nombre;
                tds += '</button>';
              tds += '</div>';
            tds += '</div>';
          });
          $(".cntPoda_VerCircuitos_Circuito").remove();
          $("#cntPoda_VerCircuitos_ListaCircuitos").append(tds);

        }
      }, "json");
    } else
    {
      valores = 0;
      $(".cntPoda_VerCircuitos_Circuito").remove();
    }
  }

  function poda_CargarSectores()
  {
    $.post('../server/php/proyectos/cargarSectores.php', {Usuario : Usuario.id}, function(data, textStatus, xhr) 
    {
      var tds = "";
      $("#cntPoda_VerCircuitos_ListaSectores div").remove();

      $.each(data, function(index, val) 
      {
        tds += '<div class="margin-left-15">';
          tds += '<div class="checkbox-custom checkbox-primary">';
            tds += '<input type="checkbox" id="txtPoda_VerCircuitos_SectorChk' + val.idSector + '" idSector="' + val.idSector + '">';
            tds += '<label for="txtPoda_VerCircuitos_SectorChk' + val.idSector + '">' + val.Nombre + '</label>';
          tds += '</div>';
        tds += '</div>';
      });

      $("#cntPoda_VerCircuitos_ListaSectores").prepend(tds);
    }, "json");
  }

  $("#btnPoda_VerCircuitos_OcultarSectores").on("click", function(event)
    {
      event.preventDefault();
      $("#cntPoda_VerCircuitos_Sectores").slideUp();
      $("#cntPoda_VerCircuitos_Circuitos").removeClass('col-md-9');
      $("#cntPoda_VerCircuitos_Circuitos").addClass('col-md-12');
      $("#btnPoda_VerCircuitos_MostrarSectores").show();
    });

  $("#btnPoda_VerCircuitos_MostrarSectores").on("click", function(event)
    {
      event.preventDefault();
      $("#cntPoda_VerCircuitos_Sectores").slideDown();
      $("#cntPoda_VerCircuitos_Circuitos").removeClass('col-md-12');
      $("#cntPoda_VerCircuitos_Circuitos").addClass('col-md-9');
      $("#btnPoda_VerCircuitos_MostrarSectores").hide();
    });

  $("#btnPoda_VerCircuitos_SectoresTodas").on("click", function(event)
    {
      event.preventDefault();
      $("#cntPoda_VerCircuitos_ListaSectores input").prop("checked", true);
      poda_cargarCircuitos();
    });

  $("#btnPoda_VerCircuitos_SectoresNinguna").on("click", function(event)
    {
      event.preventDefault();
      $("#cntPoda_VerCircuitos_ListaSectores input").prop("checked", false);
      poda_cargarCircuitos();
    });

  $(document).delegate("#cntPoda_VerCircuitos_ListaSectores input", 'click', function(event) 
  {
    poda_cargarCircuitos();
  });

  $("#txtPoda_VerCircuitos_Filtrar").on("change keyup paste", function()
  {
    var valor = $("#txtPoda_VerCircuitos_Filtrar").val();
    $(".cntPoda_VerCircuitos_Circuito").addClass('hide');
    if (valor != "")
    {
      var obj = $(".cntPoda_VerCircuitos_Circuito[filtro*=" + valor.toLowerCase() + "]");
      $(obj).removeClass('hide');

    } else
    {
      $(".cntPoda_VerCircuitos_Circuito").removeClass('hide');
    }
  });


  $(document).delegate('.btnPoda_AbrirCircuito', 'click', function(event) 
  {
    var titulo = $(this).text();
    var idCircuito = $(this).attr("idCircuito");

    cargarModulo("poda/panel.html", "Panel de Poda", function()
      {
        $("#modulo_poda_panel_html h1.page-title").text("Panel de Poda, Circuito " + titulo);
        $("#txtPoda_Circuito").val(idCircuito);
        $("#txtPoda_CircuitoNombre").val(titulo);

        $("#tblPoda_Panel_Ot tbody tr").remove();

        poda_Panel_CargarMunicipios();

        $.post('../server/php/proyectos/poda/cargarOTs.php', {Usuario: Usuario.id, Circuito : $("#txtPoda_Circuito").val()}, function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var tds = "";

            $.each(data, function(index, val) 
            {
              tds += '<tr>';
                tds += '<td><button class="btn btn-warning btnPoda_Panel_AbrirOT" title="Abrir OT" idOT="' + val.idOT + '"><i class="icon wb-eye"></i> </button></td>';
                tds += '<td>' + val.Prefijo + '</td>';
                tds += '<td>' + val.codigoOT + '</td>';
                tds += '<td>' + val.Observaciones + '</td>';
                tds += '<td>' + val.fechaCargue + '</td>';
              tds += '</tr>';   
            });

            $("#tblPoda_Panel_Ot tbody").append(tds);
          }
        }, "json");
      });
  });
  
}
function poda_Panel()
{
  $(".btnPoda_VolverABusqueda").on("click", function()
  {
    cargarModulo("poda/verCircuitos.html", "Circuitos");
    $("#txtPoda_Circuito").val(0);
  });

  $("#btnPoda_Panel_Circuito_Guardar").on("click", function()
    {
      $.post('../server/php/proyectos/poda/crearMunicipio_Circuito.php', {Usuario : Usuario.id, idMunicipio : $("#txtPoda_Panel_Circuito_Municipio").val(), idCircuito : $("#txtPoda_Circuito").val()},
      function(data)
      {
        if (data == 1)
        {
          Mensaje("Hey", "El municipio fue actualizado", "success");
        } else
        {
          Mensaje("Hey", "Hubo un error y los cambios no se guardaron", "danger");
        }
      });
    });

  $(document).delegate('.btnPoda_VolverAlPanelPoda', 'click', function(event) 
  {
    cargarModulo("poda/panelOT.html", "OT de Poda en Cicuito " + $("#txtPoda_CircuitoNombre").val());
  });

  $("#btnPoda_Panel_CrearOT").on("click", function()
  {
    var numInterno = obtenerPrefijo();
    $("#lblPoda_Panel_NumeroInterno").text(numInterno);
    $("#txtPoda_Panel_CrearOt_NumeroInterno").val(numInterno);
    $("#txtPoda_Panel_CrearOt_Numero").val("");
    $("#txtPoda_Panel_CrearOt_Observaciones").val("");
    $("#cntPoda_Panel_CrearOt").modal("show");
  });

  $("#frmPoda_CrearOT").on("submit", function(evento)
    {
      evento.preventDefault();
      $("#frmPoda_CrearOT").generarDatosEnvio("txtPoda_Panel_CrearOt_", function(datos)
      {
        $.post('../server/php/proyectos/poda/crearOT.php', {datos: datos, Usuario : Usuario.id, Circuito : $("#txtPoda_Circuito").val()}, function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var tds = "";
            datos = JSON.parse(datos);
            tds += '<tr>';
              tds += '<td><button class="btn btn-warning btnPoda_Panel_AbrirOT" title="Abrir OT" idOT="' + data + '"><i class="icon wb-eye"></i> </button></td>';
              tds += '<td>' + datos.NumeroInterno + '</td>';
              tds += '<td>' + datos.Numero + '</td>';
              tds += '<td>' + datos.Observaciones + '</td>';
              tds += '<td>' + obtenerFecha() + '</td>';
            tds += '</tr>';
            $("#tblPoda_Panel_Ot tbody").prepend(tds);
          } else
          {
            Mensaje("Error", data, "danger");
          }
          $("#cntPoda_Panel_CrearOt").modal("hide");
        }).fail(function()
        {
          $("#cntPoda_Panel_CrearOt").modal("hide");
        });
      });
    });

  $(document).delegate('.btnPoda_Panel_AbrirOT', 'click', function(event) 
  {
    var obj = this;
    var filas = $(obj).parent("td").parent("tr").find("td");
    cargarModulo("poda/panelOT.html", "OT de Poda en Circuito " + $("#txtPoda_CircuitoNombre").val() ,  function()
    {
      $("#txtPoda_PanelOT_CrearOt_idOT").val($(obj).attr("idOT"));
      $("#txtPoda_PanelOT_CrearOt_NumeroInterno").val($(filas[1]).text());

      $("#lblPoda_PanelOT_NumeroInterno").html($(filas[1]).text());
      $("#txtPoda_PanelOT_CrearOt_Numero").val($(filas[2]).text());
      $("#txtPoda_PanelOT_CrearOt_Observaciones").val($(filas[3]).text());
    })
  });

  $(document).delegate(".btnPoda_VolverAlPanel", "click", function()
  {
    cargarModulo("poda/panel.html", "Panel de Poda, Circuito " + $("#txtPoda_CircuitoNombre").val());
  });
}

function poda_Panel_CargarMunicipios()
{
  $("#txtPoda_Panel_Circuito_Municipio option").remove();
  var tds = '<option value="0">Seleccione una opción</option>';
  var idOpcion = 0;
  $.post('../server/php/proyectos/poda/cargarMunicipios_Circuito.php', {Usuario: Usuario.id, idCircuito : $("#txtPoda_Circuito").val()}, function(data, textStatus, xhr) 
    {
      if (data != 0)
      {
        $.each(data, function(index, val) 
        {
           tds += '<option value="' + val.id + '">' + val.Nombre + '</option>';
           idOpcion = val.idMunicipio;
        });
      }
      $("#txtPoda_Panel_Circuito_Municipio").append(tds);
      $("#txtPoda_Panel_Circuito_Municipio").val(idOpcion);
    }, "json");
}

var podaMap = null;

function poda_LimpiarMapa()
{
  podaMap.removeMarkers();
  
  var t = $("#tblPoda_Programacion").DataTable();
  t.rows().remove().draw( false );  

  $("#cntPoda_CapaForestal_Capas input[type='checkbox']").prop("checked", false);
  $("#cntPoda_Programacion_Capas input[type=checkbox]").prop("checked", false);
  Markers = [];
}
function poda_capaForestal()
{
  poda_iniciarMapa();

  function poda_Mapa_AgregarMarcador(datos)
  {
    if (datos === undefined)
    {
      datos = {};
    }
    var nombre_comun = datos.nombre_comun || "";
    var matricula = datos.matricula || "";
    var familia = datos.familia || "";
    var especie = datos.especie || "";

    var diametro_ap = datos.diametro_ap || "";
    var diametro_copa = datos.diametro_copa || "";
    var altura = datos.altura || "";
    var estado_fisico = datos.estado_fisico || "";
    var estado_fito = datos.estado_fito || "";
    var tratamiento = datos.tratmiento || "";
    var nivel_afectacion = datos.nivel_afectacion || "";
    var tension = datos.tension || "";
    var lat = datos.latitud || "";
    var lon = datos.longitud || "";

    if (lat != "" && lon != "")
    {
      lat = lat.replace(",", ".");
      lon = lon.replace(",", ".");
      
      var contenido = "";
      contenido += '<div>';
        contenido += '<h4><strong>' + nombre_comun + '</strong> <small>(' +  matricula + ')</small></h4>';
        contenido += '<h5><small>' +  familia + '</small></h5>';
        contenido += '<h6><small>Especie:</small> <strong>' + especie + '</strong></h6>';
        contenido += '<div class="col-md-12">';
          contenido += '<div class="col-md-6">';
            contenido += '<h6><small>Diametro Ap:</small> <strong>' + diametro_ap + '</strong></h6>';
            contenido += '<h6><small>Diametro Copa:</small> <strong>' + diametro_copa + '</strong></h6>';
            contenido += '<h6><small>Altura:</small> <strong>' + altura + '</strong></h6>';
            contenido += '<h6><small>Estado Fisico:</small> <strong>' + estado_fisico + '</strong></h6>';
          contenido += '</div>';
          contenido += '<div class="col-md-6">';
            contenido += '<h6><small>Estado Fitologico:</small> <strong>' + estado_fito + '</strong></h6>';
            contenido += '<h6><small>Tratamiento:</small> <strong>' + tratamiento+ '</strong></h6>';
            contenido += '<h6><small>Nivel Afectación:</small> <strong>' + nivel_afectacion + '</strong></h6>';
            contenido += '<h6><small>Tensión:</small> <strong>' + tension + '</strong></h6>';
          contenido += '</div>';
        contenido += '</div>';
      contenido += '</div>';

      podaMap.addMarker({
          lat: lat,
          lng: lon,
          icon : '../assets/images/icons/tree_green.png',
          infoWindow: {
            content: contenido
          }
        });
        
    }
  }

  $("#btnPoda_CapaForestal_LimpiarMapa").on("click", function()
    {
       podaMap.removeMarkers();
       $("#cntPoda_CapaForestal_Capas input[type=checkbox]").prop("checked", false);
    });

  
  $(document).delegate('.icoMapa', 'click', function(event) 
  {
    alert("algo");
  });

  $(document).delegate('#cntPoda_CapaForestal_Capas input', 'click', function(event) 
  {
    var fecha = $(this).attr("fecha");
    if ($(this).is(":checked"))
    {
      $.post('../server/php/proyectos/poda/cargarPoda_Arboles.php', {Usuario: Usuario.id, idCircuito : $("#txtPoda_Circuito").val(), idOT: 0, fecha : fecha}, 
        function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var idx = 0;
            $.each(data, function(index, val) 
            {
              idx = 0;
              poda_Mapa_AgregarMarcador(val);
            });
            if (data[idx].latitud != "" && data[idx].longitud != "")
            {
              podaMap.setCenter(data[idx].latitud.replace(",", "."), data[idx].longitud.replace(",", "."));
              podaMap.setZoom(15);
            }
          }
        }, "json");
    } else
    {
      return false;
    }
  });

}
function poda_iniciarMapa(Lat, Lon, contenedor)
{
  if (typeof GMaps == "undefined")
  {
    $("#cntNoConformidades_Ubicacion").slideUp();
  } else
  {
    Lat = 10.97575;
    Lon = -74.7893333333333;

    if (contenedor === undefined)
    {
      contenedor = '#cntPoda_CapaForestal_Mapa';
    }
    if (Lat != undefined && Lon != undefined)
    {
      podaMap = new GMaps({
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

      podaMap.addStyle({
        styledMapName: "Styled Map",
        styles: $.components.get('gmaps', 'styles'),
        mapTypeId: "map_style"
      });

      podaMap.setStyle("map_style");
    }
  }
}


function poda_Documental()
{
  //documental_cargar($("#frmDocumental_Archivos"), $("#cntDocumental_Archivos"), "poda/" + $("#txtPoda_Circuito").val() + "/" + $("#txtPoda_PanelOT_CrearOt_NumeroInterno").val());

  $("#frmPoda_Documental_Archivos").ajaxForm(
  {
    beforeSend: function() 
    {
        var percentVal = '0%';
        $("#txtPoda_Documental_ArchivoProgreso").width(percentVal);
        $("#txtPoda_Documental_ArchivoProgreso").text(percentVal);
    },
    uploadProgress: function(event, position, total, percentComplete) {
        
        var percentVal = percentComplete + '%';
        $("#txtPoda_Documental_ArchivoProgreso").width(percentVal);
        $("#txtPoda_Documental_ArchivoProgreso").text(percentVal);
    },
    success: function() {
        var percentVal = '100%';
        $("#txtPoda_Documental_ArchivoProgreso").width(percentVal);
        $("#txtPoda_Documental_ArchivoProgreso").text(percentVal);
    },
    complete: function(xhr) {
      var respuesta = xhr.responseText;
      if (respuesta.substring(0, 11) == "../archivos")
          {
            var tds = "";
            arrNomArchivo = respuesta.split("$$");
            arrNomArchivo = arrNomArchivo[0];
            var arrArchivo = arrNomArchivo.split("/");
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
                      tds += '<a class="name" href="' + arrNomArchivo.replace("../", "../server/") + '" target="_blank">' + nomArchivo + '</a>';
                      tds += '<a class="btn btn-danger pull-right btnDocumental_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
                    tds += '</h4>';
                  tds += '</div>';
                tds += '</div>';
              tds += '</li>';

            $("#cntPoda_Documental_Archivos").append(tds);
          } else
          {
            Mensaje("Error","Hubo un Error, " + respuesta, "danger");
          }
     }
  }); 
}

function poda_PanelOT()
{
  $("#btnPanelPoda_Documental").on("click", function()
  {
    var titulo = "Documentos Cargados de OT " + $("#txtPoda_PanelOT_CrearOt_NumeroInterno").val() + " en Circuito " + $("#txtPoda_CircuitoNombre").val();
    cargarModulo("poda/documental.html", titulo, function()
    {
      documental_cargar($("#frmPoda_Documental_Archivos"), $("#cntPoda_Documental_Archivos"), "poda/" + $("#txtPoda_Circuito").val() + "/" + $("#txtPoda_PanelOT_CrearOt_NumeroInterno").val());     
    });
  })

  $("#btnPanelPoda_Programacion").on("click", function()
  {
    $("#txtPoda_Programacion_Programados").val("");
    var titulo = "OT " + $("#txtPoda_PanelOT_CrearOt_NumeroInterno").val() + " en Circuito " + $("#txtPoda_CircuitoNombre").val();
    cargarModulo("poda/programacion.html", titulo, function()
    {
        var objMenu = $("#toggleMenubar").find("i.unfolded");
        if (objMenu.length > 0)
        {
          $("#toggleMenubar a").trigger('click');
        }

      $("#modulo_poda_programacion_html .page-header").remove();
      var altoModulo = $("#modulo_poda_programacion_html").height();
      var altoMapa = $("#cntPoda_Programacion_Mapa").height();
      if (altoMapa <= 0)
      {
        $("#cntPoda_Programacion_Mapa").css("height", altoModulo);
        $("#cntPoda_Programacion_MapaOpciones").css("height", altoModulo);
      }

      poda_iniciarMapa(null, null, "#cntPoda_Programacion_Mapa");

      $("#cntPoda_Programacion_Capas div").remove();
        poda_LimpiarMapa();

        $.post('../server/php/proyectos/poda/cargarCapasPoda.php', {Usuario : Usuario.id, idCircuito :  $("#txtPoda_Circuito").val()}, function(data, textStatus, xhr) 
        {
          var tds = "";
          if (data != 0)
          {
            tds = "<div><h5>Capas Cargadas</h5></div>"
            $.each(data, function(index, val) 
            {
              tds += '<div class="col-md-4">';
                tds += '<div class="checkbox-custom checkbox-success">';
                  tds += '<input type="checkbox" id="txtPoda_Programacion_lChk' + val.fecha_levanta + '" fecha="' + val.fecha_levanta + '">';
                  tds += '<label for="txtPoda_Programacion_lChk' + val.fecha_levanta + '">' + val.fecha_levanta + ' (' + val.Cantidad + ' Arboles)</label>';
                tds += '</div>';
              tds += '</div>';
            });
          } else
          {
            tds = '<div><h5>No hay capas cargadas al sistema</h5></div>';
          }
          $("#cntPoda_Programacion_Capas").prepend(tds);
        }, "json");
    });
  })

  $("#btnPanelPoda_VisitaPlanificacion").on("click", function()
  {
    poda_PuntosDeControl_AbrirVisita("Planificación", "VISITA DE PLANIFICACIÓN");
  });

  $("#btnPanelPoda_VisitaEjecucion").on("click", function()
  {
    poda_PuntosDeControl_AbrirVisita("Ejecución", "VISITA DE EJECUCIÓN");
  });

  $("#btnPanelPoda_VisitaEjecutados").on("click", function()
  {
    poda_PuntosDeControl_AbrirVisita("Ejecutados", "VISITA DE EJECUTADOS");
  });

  $("#btnPanelPoda_VisitaAcInstalacion").on("click", function()
  {
    poda_PuntosDeControl_AbrirVisita("AC Instalación", "VISITA AC INSTALACIÓN");
  });

  $("#btnPanelPoda_VisitaAcOperadores").on("click", function()
  {
    poda_PuntosDeControl_AbrirVisita("AC Operadores", "VISITA AC OPERADORES");
  });

  $("#btnPanelPoda_VisitaEjecucionAC").on("click", function()
  {
    poda_PuntosDeControl_AbrirVisita("Ejecución AC", "VISITA EJECUCIÓN AC");
  });

  $(document).delegate(".btnPoda_VolverAlPanelOT", "click", function()
  {
    cargarModulo("poda/panelOT.html", "OT de Poda en Circuito " + $("#txtPoda_CircuitoNombre").val());
  });
}

function poda_PuntosDeControl()
{
  $("#txtPoda_PuntosDeControl_Fecha").datepicker({'autoclose' : true});
  
  $("#txtPoda_PuntosDeControl_HoraInicio").timepicker({ 'scrollDefault': 'now' , 'step': 15, 'timeFormat': 'H:i:s' });
  $("#txtPoda_PuntosDeControl_HoraFin").timepicker({ 'scrollDefault': 'now' , 'step': 15, 'timeFormat': 'H:i:s' });
  
  $("#frmPoda_PuntosDeControl").on("submit", function(evento)
    {
      evento.preventDefault(); 
      $("#frmPoda_PuntosDeControl").generarDatosEnvio("txtPoda_PuntosDeControl_", function(datos)
        {
          var objItems = $("#tblPoda_PuntosDeControl_Items input[type=radio]:checked");

            var datosItems = {};

            $.each(objItems, function(index, val) 
            {
              datosItems[$(val).attr("idItem")] = {};
              datosItems[$(val).attr("idItem")]['Resultado'] = $(val).val();
              datosItems[$(val).attr("idItem")]['Observaciones'] = $("#txtPoda_PuntosDeControl_Observaciones_Item_" + $(val).attr("idItem")).val();
            });
            datosItems = JSON.stringify(datosItems);  

            $.post('../server/php/proyectos/poda/crearPoda_PuntosDeControl.php', {Usuario : Usuario.id, datos : datos, items : datosItems}, 
              function(data, textStatus, xhr) 
              {
                
              });
        });
    });
}

function poda_PuntosDeControl_AbrirVisita(Etapa, Titulo)
{
  var titulo = "OT " + $("#txtPoda_PanelOT_CrearOt_NumeroInterno").val() + " en Circuito " + $("#txtPoda_CircuitoNombre").val();
    cargarModulo("poda/puntosDeControl.html", titulo, function()
    {
      var fecha = obtenerFecha();
      $("#frmPoda_PuntosDeControl")[0].reset();
      $("#txtPoda_PuntosDeControl_Fecha").val(fecha.substr(0, 10));
      $("#txtPoda_PuntosDeControl_HoraInicio").val(fecha.substr(11, 10));
      $("#txtPoda_PuntosDeControl_HoraFin").val(fecha.substr(11, 10));
      $("#txtPoda_PuntosDeControl_idOt").val($("#txtPoda_PanelOT_CrearOt_idOT").val());
      $("#txtPoda_PuntosDeControl_Prefijo").val(obtenerPrefijo());
      $("#txtPoda_PuntosDeControl_Etapa").val(Etapa);
      $("#lblPoda_PuntosDeControl_Titulo").text(Titulo);
      poda_PuntosDeControl_CargarFormulario($("#txtPoda_PuntosDeControl_Etapa").val());
    });
}
function poda_PuntosDeControl_CargarFormulario(Etapa)
{
  $.post('../server/php/proyectos/poda/cargarPuntosDeControl.php', {Usuario : Usuario.id, Categoria :  Etapa}, function(data, textStatus, xhr) 
  {
    $("#tblPoda_PuntosDeControl_Items tbody tr").remove();
    if (typeof(data) == "object")
    {
        var tds = "";

        $.each(data, function(index, val) 
        {
           tds += '<tr>';
            tds += '<td>' + val.Codigo + '</td>'; 
            tds += '<td>' + val.Nombre + '</td>'; 
            tds += '<td class="bg-blue-grey-300 text-center">'; 
              tds += '<div class="radio-custom radio-primary">';
                tds += '<input type="radio" id="optPoda_PuntosDeControl' + val.Codigo +'_Si" idItem="' + val.id + '" value="Cumple" name="optPoda_PuntosDeControl' + val.Codigo + '">';
                tds += '<label for="optPoda_PuntosDeControl' + val.Codigo +'_Si"></label>';
              tds += '</div>';
            tds += '</td>'; 
            tds += '<td class="bg-blue-grey-300 text-center">'; 
              tds += '<div class="radio-custom radio-primary">';
                tds += '<input type="radio" id="optPoda_PuntosDeControl' + val.Codigo +'_No" idItem="' + val.id + '" value="No Cumple" name="optPoda_PuntosDeControl' + val.Codigo + '">';
                tds += '<label for="optPoda_PuntosDeControl' + val.Codigo +'_No"></label>';
              tds += '</div>';
            tds += '</td>'; 
            tds += '<td class="bg-blue-grey-300 text-center">'; 
              tds += '<div class="radio-custom radio-primary">';
                tds += '<input type="radio" id="optPoda_PuntosDeControl' + val.Codigo +'_NA" idItem="' + val.id + '" value="No Aplica" name="optPoda_PuntosDeControl' + val.Codigo + '" checked>';
                tds += '<label for="optPoda_PuntosDeControl' + val.Codigo +'_NA"></label>';
              tds += '</div>';
            tds += '</td>'; 
            tds += '<td><input id="txtPoda_PuntosDeControl_Observaciones_Item_' + val.id + '" type="text" class="form-control col-md-12 guardar"></td>'; 
           tds += '</tr>';
        });

        $("#tblPoda_PuntosDeControl_Items tbody").append(tds);

        $.post('../server/php/proyectos/poda/cargarPuntosDeControl_Diligenciados.php', {Usuario : Usuario.id, idOt : $("#txtPoda_PuntosDeControl_idOt").val(), Etapa : Etapa }, 
          function(data, textStatus, xhr) 
          {
             if (typeof(data) == "object")
              {
                var tds = "";

                $.each(data.datos, function(index, val) 
                {
                  if ($("#txtPoda_PuntosDeControl_" + index).length > 0)
                  {
                    $("#txtPoda_PuntosDeControl_" + index).val(val);
                  }
                });              

                var objItems = {};
                $.each(data.items, function(index, val) 
                {
                  objItems = $("#tblPoda_PuntosDeControl_Items input[type=radio][idItem=" + val.idPuntoControl + "][value='" + val.Resultado + "']");
                  $(objItems).trigger('click');
                  $("#txtPoda_PuntosDeControl_Observaciones_Item_" + val.idPuntoControl).val(val.Observaciones);
                });
              } else
              {
                if (data != 0)
                {
                  Mensaje("Error", data, "danger");
                } 
              }
          }, "json");
    } else
    {
      if (data != 0)
      {
        Mensaje("Error", data, "danger");
      } else
      {
        Mensaje("Error", "No hay especies configuradas", "danger");
      }
    }
  }, "json");
}

function poda_Programacion()
{
  poda_Programacion_AgregarMarcador();

  $("#tblPoda_Programacion").crearDataTable("");

  $(document).delegate('.btnPoda_VolverAProgramacion', 'click', function(event) 
  {
    var titulo = "OT " + $("#txtPoda_PanelOT_CrearOt_NumeroInterno").val() + " en Circuito " + $("#txtPoda_CircuitoNombre").val();
    cargarModulo("poda/programacion.html", titulo); 
  });

  $("#btnPoda_Programacion_AgregarArbol").on("click", function()
  {
    var tmpTexto = $("#lblUbicacionModulo").text();
    cargarModulo("poda/agregarArbol.html", tmpTexto, function()
      {
        $("#frmPoda_AgregarArbol")[0].reset();
        $("#txtPoda_AgregarArbol_idArbol").val(0);
        $("#txtPoda_AgregarArbol_btnVolver_Vinculo").val("poda/programacion.html");
        $("#txtPoda_AgregarArbol_btnVolver_Texto").val(tmpTexto);

        GMaps.geolocate(
        {
          success: function(position)
          {
            podaAgregarArbol_Map.setCenter(position.coords.latitude, position.coords.longitude);
            if (podaAgregarArbol_Marker == null)
            {
              podaAgregarArbol_Marker = podaAgregarArbol_Map.addMarker({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                 draggable:true,
                 dragend: function(e) {
                  $("#txtPoda_AgregarArbol_Longitud").val(e.latLng.lng());
                  $("#txtPoda_AgregarArbol_Latitud").val(e.latLng.lat());
                }
              });
            } else
            {
              podaAgregarArbol_Marker.setPosition({lat : position.coords.latitude, lng : position.coords.longitude});
            }
            $("#txtPoda_AgregarArbol_Longitud").val(position.coords.longitude);
            $("#txtPoda_AgregarArbol_Latitud").val(position.coords.latitude);
          },
          error: function(error){
            alert('Geolocation failed: ' + error.message);
          },
          not_supported: function(){
            alert("Your browser does not support geolocation");
          }
        });
      });
  });

  $("#btnPoda_Programacion_EditarArbol").on("click", function()
  {
    var tmpTexto = $("#lblUbicacionModulo").text();
    var idArbol = $(this).attr("idArbol");

    cargarModulo("poda/agregarArbol.html", tmpTexto, function()
      {
        $("#txtPoda_AgregarArbol_btnVolver_Vinculo").val("poda/programacion.html");
        $("#txtPoda_AgregarArbol_btnVolver_Texto").val(tmpTexto);
        
        $.post('../server/php/proyectos/poda/cargarPoda_Arbol.php', {Usuario: Usuario.id, idArbol : idArbol}, function(data, textStatus, xhr) 
        {
          var tLat = 0;
          var tLng = 0;
          $.each(data, function(index, val) 
          {
            tLat = parseFloat(val.latitud.replace(",", "."));
            tLng = parseFloat(val.longitud.replace(",", "."));
             $("#txtPoda_AgregarArbol_idArbol").val(val.idArbol);
             $("#txtPoda_AgregarArbol_Corregimiento").val(val.correg);
             $("#txtPoda_AgregarArbol_Matricula").val(val.matricula);
             $("#txtPoda_AgregarArbol_NombreComun").val(val.nombre_comun);
             $("#txtPoda_AgregarArbol_Especie").val(val.especie);
             $("#txtPoda_AgregarArbol_Familia").val(val.familia);
             
             $("#txtPoda_AgregarArbol_Longitud").val(tLng);
             $("#txtPoda_AgregarArbol_Latitud").val(tLat);

             $("#txtPoda_AgregarArbol_Ubicacion").val(val.ubicacion);

              if (podaAgregarArbol_Marker == null)
              {
                podaAgregarArbol_Marker = podaAgregarArbol_Map.addMarker({
                  lat: tLat,
                  lng: tLng,
                   draggable:true,
                   dragend: function(e) {
                    $("#txtPoda_AgregarArbol_Longitud").val(e.latLng.lng());
                    $("#txtPoda_AgregarArbol_Latitud").val(e.latLng.lat());
                  }
                });
              } else
              {
                podaAgregarArbol_Marker.setPosition({lat : tLat, lng : tLng});
              }
              podaAgregarArbol_Map.setCenter(tLat, tLng);
              podaAgregarArbol_Map.setZoom(17);


             $("#txtPoda_AgregarArbol_circunf_cap").val(val.diametro_ap);
             $("#txtPoda_AgregarArbol_DiametroCopa").val(val.diametro_copa);
             $("#txtPoda_AgregarArbol_Altura").val(val.altura);
             $("#txtPoda_AgregarArbol_EstadoFisico").val(val.estado_fisico);
             $("#txtPoda_AgregarArbol_EstadoFito").val(val.estado_fito);
             $("#txtPoda_AgregarArbol_Tratamiento").val(val.tratmiento);
             $("#txtPoda_AgregarArbol_NivelAfectacion").val(val.nivel_afectacion);
             $("#txtPoda_AgregarArbol_Tension").val(val.tension);
             $("#txtPoda_AgregarArbol_Observaciones").val(val.observacion);

          });
        }, "json");
      });
  });

  $("#btnPoda_Programacion_VisitaPrevia").on("click", function()
  {
    var idArbol = $(this).attr("idArbol");
    var tmpTexto = $("#lblUbicacionModulo").text();
    cargarModulo("poda/visitaPrevia.html", tmpTexto, function()
      {
        $("#frmPoda_VisitaPrevia_Programacion_Formato")[0].reset();
        $("#txtPoda_VisitaPrevia_Programacion_idArbol").val(idArbol);
        $("#txtPoda_VisitaPrevia_Programacion_idOt").val($("#txtPoda_PanelOT_CrearOt_idOT").val());
        $("#txtPoda_AgregarArbol_btnVolver_Vinculo").val("poda/programacion.html");
        $("#txtPoda_AgregarArbol_btnVolver_Texto").val(tmpTexto);
        var pPrefijo = obtenerPrefijo();
        $("#txtPoda_VisitaPrevia_Programacion_NumeroInterno").val(pPrefijo);
        $("#lblPoda_VisitaPrevia_Programacion_NumeroInterno").text(pPrefijo);
        documental_cargar($("#frmPoda_VisitaPrevia_Archivos"), $("#cntPoda_VisitaPrevia_Archivos"), "poda/" + $("#txtPoda_Circuito").val() + "/"  + $("#txtPoda_PanelOT_CrearOt_NumeroInterno").val() + "/Visita_Previa/" + $("#txtPoda_VisitaPrevia_Programacion_idArbol").val());

        $.post('../server/php/proyectos/poda/cargarDatoVisitaPrevia.php', {Usuario: Usuario.id, idArbol : idArbol, idOt: $("#txtPoda_PanelOT_CrearOt_idOT").val()}, function(data, textStatus, xhr) 
        {
          if (typeof(data) == "object")
          {
              var tds = "<option value=''>Seleccione una </option>";

              $.each(data, function(index, val) 
              {
                 $("#lblPoda_VisitaPrevia_Programacion_NumeroInterno").text(val.Prefijo);
                 $("#txtPoda_VisitaPrevia_Programacion_NumeroInterno").val(val.Prefijo);

                 $.each(val, function(indice, dato) 
                 {
                    if ($("#txtPoda_VisitaPrevia_Programacion_" + indice).length > 0)
                    {
                      $("#txtPoda_VisitaPrevia_Programacion_" + indice).val(dato);
                      if ($("#txtPoda_VisitaPrevia_Programacion_" + indice).attr("type") == "checkbox")
                      {
                        $("#txtPoda_VisitaPrevia_Programacion_" + indice).prop("checked", dato);
                      }
                    }
                 });

              });

              $("#txtPoda_VisitaPrevia_Programacion_TipoEspecie").append(tds);
            
          } else
          {
            if (data != 0)
            {
              Mensaje("Error", data, "danger");
            }
          }
        }, "json");
      });
  });

  
  
  $("#btnPoda_Programacion_LimpiarMapa").on("click", function()
    {
      poda_LimpiarMapa();      
    });

  $(document).delegate('.btnPoda_Programacion_VerMarker', 'click', function(event) 
  {
    var id = $(this).attr("idArbol");
     $(".btnPoda_Programacion_VerMarker").removeClass('btn-warning');
     $(this).addClass('btn-warning');
     $("#cntPoda_Programacion_MapaOpciones").show();

     $("#btnPoda_Programacion_EditarArbol").attr("idArbol", id);
     $("#btnPoda_Programacion_VisitaPrevia").attr("idArbol", id);
     $("#btnPoda_Programacion_Observaciones").attr("idArbol", id);

     var objFila = $(this).parent("td").parent("tr").find("td");
     $("#lblPoda_Programacion_MapaOpciones_NombreComun").text($(objFila[4]).text());
     $("#lblPoda_Programacion_MapaOpciones_Matricula").text($(objFila[3]).text());
     $("#lblPoda_Programacion_MapaOpciones_fechaLevantamiento").text($(objFila[6]).text());
     $("#lblPoda_Programacion_MapaOpciones_Especie").text($(objFila[5]).text());
     $("#lblPoda_Programacion_MapaOpciones_Estado").text($(objFila[15]).text());

    podaMap.setCenter(Markers[id].getPosition().lat(), Markers[id].getPosition().lng(), function()
      {
        if (Markers[0] == null)
        {
            Markers[0] = podaMap.addMarker({
              lat: Markers[id].getPosition().lat(),
              lng: Markers[id].getPosition().lng(),
              icon : '../assets/images/icons/tree_Selected.png'
            });
        } else
        {
          Markers[0].setPosition({lat : Markers[id].getPosition().lat(), lng: Markers[id].getPosition().lng()});
        }

        
        var tmpIcon = "";

        if (typeof(Markers[id].icon) == "object")
        {
          tmpIcon = Markers[id].icon.url;
        } else
        {
          tmpIcon = Markers[id].icon;
        }
        
        $("#imgPoda_Programacion_MapaOpciones_Icono").attr("src", tmpIcon);
        
        $('#modulo_poda_Programacion_html .page-title').ScrollTo();
        podaMap.setZoom(18);
      });

    
  });

  $("#cnt_Poda_Programacion_OpcionesMapa button").on("click", function()
  {
    $("#cnt_Poda_Programacion_OpcionesMapa button").removeClass('btn-primary');
    $(this).addClass('btn-primary');
  });

  $(document).delegate('.btnPoda_Programacion_Seleccionar', 'change', function(event) 
  {
      var id = $(this).attr("idArbol");
      var url = "../assets/images/icons/tree_green.png";
      if ($(this).is(":checked"))
      {
        url = "../assets/images/icons/tree_Programado.png";
        $("#txtPoda_Programacion_Programados").val($("#txtPoda_Programacion_Programados").val() + "-" + id + ", ");
      } else
      {
        $("#txtPoda_Programacion_Programados").val($("#txtPoda_Programacion_Programados").val().replace(new RegExp("-" + id + ", ", 'g'), ""));
      }

      podaMap.setCenter(Markers[id].getPosition().lat(), Markers[id].getPosition().lng(), function()
      {
        Markers[id].setIcon({url : url});
      });
  });

  $("[name=tblPoda_Programacion_length]").on("change", function () 
  {
    iniciarSwitchery();
  });

  $("#tblPoda_Programacion_filter input").on("change", function () 
  {
    iniciarSwitchery();
  });

  $("#btnPoda_Programacion_ProgramarTodos").on("click", function()
  {
    $(".btnPoda_Programacion_Seleccionar").prop("checked", false);
    $(".btnPoda_Programacion_Seleccionar").trigger('click');
  });

  $("#btnPoda_Programacion_DescartarTodos").on("click", function()
  {
    $(".btnPoda_Programacion_Seleccionar").prop("checked", true);
    $(".btnPoda_Programacion_Seleccionar").trigger('click');
  });

  $("#btnPoda_Programacion_Guardar").on("click", function()
  {
      $.post('../server/php/proyectos/poda/crearProgramacion.php', {Usuario : Usuario.id, idOt : $("#txtPoda_PanelOT_CrearOt_idOT").val(), Arboles: $("#txtPoda_Programacion_Programados").val() }, 
        function(data, textStatus, xhr) 
        {
          if (data == 1)
          {
            Mensaje("Hey", "Los cambios han sido guardados", "success");
          } else
          {
            Mensaje("Error", "Hubo un error " + data, "danger");   
          }
        }).fail(function()
        {
          Mensaje("Error", "Hubo un error de conexión", "danger");
        });
  })

  $('#tblPoda_Programacion_paginate').click(function () 
  {
    iniciarSwitchery();
  });


  $(document).delegate('#cntPoda_Programacion_Capas input', 'click', function(event) 
  {
    var fecha = $(this).attr("fecha");
    if ($(this).is(":checked"))
    {
      $.post('../server/php/proyectos/poda/cargarPoda_Arboles.php', {Usuario: Usuario.id, idCircuito : $("#txtPoda_Circuito").val(), idOT : $("#txtPoda_PanelOT_CrearOt_idOT").val(), fecha : fecha, idVisita : 0}, 
        function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var idx = 0;
            var t = $("#tblPoda_Programacion").DataTable();
            var tds = [];
            var checked = "";
            
            $.each(data, function(index, val) 
            {
              idx = 0;
              if (parseInt(val.idEstado) > 1)
              {
                checked = "checked='true'";
                $("#txtPoda_Programacion_Programados").val($("#txtPoda_Programacion_Programados").val() + "-" + val.idArbol + ", ");
              } else
              {
                checked = "";
              }

              poda_Programacion_AgregarMarcador(val);

                tds.push([
                        val.idArbol,
                        '<input type="checkbox" idArbol="' + val.idArbol + '"class="newSwitchery btnPoda_Programacion_Seleccionar" ' + checked + ' data-plugin="switchery" data-color="#3aa99e"></div> <div class="col-xs-6 margin-5">',
                        '<button idArbol="' + val.idArbol + '" class="btn btn-info btnPoda_Programacion_VerMarker"><i class="icon wb-eye"></i> </button>',
                        val.matricula,
                        val.nombre_comun,
                        val.especie,
                        val.fecha_levanta,
                        val.familia,
                        val.longitud,
                        val.latitud,
                        val.diametro_ap,
                        val.diametro_copa,
                        val.altura,
                        val.estado_fisico,
                        val.estado_fito,
                        val.Estado
                      ]);

            });
              t.rows.add(tds).draw( false );

              $("#tblPoda_Programacion_length").remove();
              $("#tblPoda_Programacion_filter").remove();
              $("#tblPoda_Programacion_wrapper .DTTT").remove();

              iniciarSwitchery();

            if (data[idx].latitud != "" && data[idx].longitud != "")
            {
              podaMap.setCenter(data[idx].latitud.replace(",", "."), data[idx].longitud.replace(",", "."));
              podaMap.setZoom(15);
            }
          }
        }, "json");
    } else
    {
      return false;
    }
  });


}

function poda_Programacion_AgregarMarcador(datos)
{
  if (datos === undefined)
  {
    datos = {};
  }
  var idArbol = datos.idArbol || 0;
  var fecha_levanta = datos.fecha_levanta || 0;

  var nombre_comun = datos.nombre_comun || "";
  var matricula = datos.matricula || "";
  var familia = datos.familia || "";
  var especie = datos.especie || "";

  var diametro_ap = datos.diametro_ap || "";
  var diametro_copa = datos.diametro_copa || "";
  var altura = datos.altura || "";
  var estado_fisico = datos.estado_fisico || "";
  var estado_fito = datos.estado_fito || "";
  var tratamiento = datos.tratmiento || "";
  var nivel_afectacion = datos.nivel_afectacion || "";
  var tension = datos.tension || "";
  var lat = datos.latitud || "";
  var lon = datos.longitud || "";

  if (lat != "" && lon != "")
  {
    lat = lat.replace(",", ".");
    lon = lon.replace(",", ".");
    
    var contenido = "";
    contenido += '<div idArbol="' + idArbol + '" levantamiento="' + fecha_levanta + '" class="cntPoda_Programacion_DialogMarker">';
      contenido += '<h4><strong>' + nombre_comun + '</strong> <small>(' +  matricula + ')</small></h4>';
      contenido += '<h5><small>' +  familia + '</small></h5>';
      contenido += '<h6><small>Especie:</small> <strong>' + especie + '</strong></h6>';
      contenido += '<div class="col-md-12">';
        contenido += '<div class="col-md-6">';
          contenido += '<h6><small>Diametro Ap:</small> <strong>' + diametro_ap + '</strong></h6>';
          contenido += '<h6><small>Diametro Copa:</small> <strong>' + diametro_copa + '</strong></h6>';
          contenido += '<h6><small>Altura:</small> <strong>' + altura + '</strong></h6>';
          contenido += '<h6><small>Estado Fisico:</small> <strong>' + estado_fisico + '</strong></h6>';
        contenido += '</div>';
        contenido += '<div class="col-md-6">';
          contenido += '<h6><small>Estado Fitologico:</small> <strong>' + estado_fito + '</strong></h6>';
          contenido += '<h6><small>Tratamiento:</small> <strong>' + tratamiento+ '</strong></h6>';
          contenido += '<h6><small>Nivel Afectación:</small> <strong>' + nivel_afectacion + '</strong></h6>';
          contenido += '<h6><small>Tensión:</small> <strong>' + tension + '</strong></h6>';
        contenido += '</div>';
      contenido += '</div>';
            /*contenido += '<div class="col-md-12 margin-5">';
              contenido += '<button class="btn btn-success margin-5" title="obj"> <i class="icon glyphicon-ok-sign"></i> Programar</button>';
              contenido += '<button class="btn btn-warning margin-5"> <i class="icon glyphicon-remove"></i> Desagendar</button>';
              contenido += '<button class="btn btn-danger margin-5"> <i class="icon glyphicon-trash"></i> Borrar</button>';
            contenido += '</div>';*/
    contenido += '</div>';

    var iconosArbol = ["tree_green.png", "tree_green.png", "tree_Programado.png", "tree_Visitado.png", "tree_Intervenido.png", "tree_Revisado.png", "tree_Conforme.png", "tree_NoConforme.png", "tree_Liquidado.png"];;

    if (datos.idEstado == "" || datos.idEstado < 2)
    {
      datos.idEstado = 0;
    }

    Markers[idArbol] = podaMap.addMarker({
        lat: lat,
        lng: lon,
        icon : '../assets/images/icons/' + iconosArbol[datos.idEstado],
        infoWindow: {
          content: contenido
        }
      });


      
  }
}

function iniciarSwitchery(callback)
{
  if (callback === undefined)
  {
    callback = function(){};
  }
  var elems = Array.prototype.slice.call(document.querySelectorAll('.newSwitchery'));

  elems.forEach(function(html) {
    var switchery = new Switchery(html);
  });

  $('.newSwitchery').removeClass('newSwitchery');
  callback();
}

function poda_PanelVisita()
{
  poda_PanelVisita_CargarVisitas();

  $(document).delegate('.btnPoda_PanelVisitaPrevia_Editar', 'click', function(evento) 
  {
    evento.preventDefault();
    var idVisita = $(this).attr("idVisita");
    
    $("#frmPoda_CrearOT")[0].reset();

    var fila = $(this).parent("td").parent("tr").find("td");
    var numInterno = $(fila[1]).text();
    $("#lblPoda_PanelVisitaPrevia_NumeroInterno").text(numInterno);
    $("#txtPoda_PanelVisitaPrevia_CrearOt_NumeroInterno").val(numInterno);
    $("#txtPoda_PanelVisitaPrevia_CrearOt_id").val(idVisita);

    $("#txtPoda_PanelVisitaPrevia_CrearOt_Fecha").val($(fila[2]).text());
    $("#txtPoda_PanelVisitaPrevia_CrearOt_Subestacion").val($(fila[3]).text());
    $("#txtPoda_PanelVisitaPrevia_CrearOt_Brigada").val($(fila[4]).text());
    $("#txtPoda_PanelVisitaPrevia_CrearOt_Descargo").val($(fila[5]).text());
    $("#txtPoda_PanelVisitaPrevia_CrearOt_RefInicio").val($(fila[6]).text());
    $("#txtPoda_PanelVisitaPrevia_CrearOt_RefFin").val($(fila[7]).text());
    $("#cntPoda_PanelVisitaPrevia_CrearOt").modal("show");
  });

  $(document).delegate('.btnVisitaPrevia_AbrirVisita', 'click', function(event) 
  {
    var idVisita = $(this).attr("idVisita");
    $("#txtPoda_VisitaPrevia_Programacion_idVisita").val(idVisita);

    cargarModulo("poda/VisitaPrevia_Programacion.html", $("#txtPoda_CircuitoNombre").val(), function()
      {
        $.post('../server/php/proyectos/poda/cargarPoda_Arboles.php', {Usuario: Usuario.id, idCircuito : $("#txtPoda_Circuito").val(), idOT: $("#txtPoda_PanelOT_CrearOt_idOT").val(), fecha : 0, idVisita : idVisita}, 
        function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var idx = 0;
            $.each(data, function(index, val) 
            {
              idx = 0;
              vAgregarMarcador(val, map_Poda_VisitaPrevia, marcadores_Poda_VisitaPrevia, function()
                {
                  $("#frmPoda_VisitaPrevia_Programacion_Formato")[0].reset();
                  $("#txtPoda_PanelVisitaPrevia_CrearOt_Fecha").focus();
                });
            });
            if (data[idx].latitud != "" && data[idx].longitud != "")
            {
              map_Poda_VisitaPrevia.setCenter(data[idx].latitud.replace(",", "."), data[idx].longitud.replace(",", "."));
              map_Poda_VisitaPrevia.setZoom(15);
            }
          }
        }, "json");          
      });
  });


  $("#txtPoda_PanelVisitaPrevia_CrearOt_Fecha").datepicker({autoclose:true});

  $("#btnPoda_PanelVisitaPrevia_CrearOT").on("click", function(evento)
    {
      evento.preventDefault();
      $("#frmPoda_CrearOT")[0].reset();
      var numInterno = obtenerPrefijo();
      $("#lblPoda_PanelVisitaPrevia_NumeroInterno").text(numInterno);
      $("#txtPoda_PanelVisitaPrevia_CrearOt_NumeroInterno").val(numInterno);
      $("#txtPoda_PanelVisitaPrevia_CrearOt_id").val(0);

      $("#txtPoda_PanelVisitaPrevia_CrearOt_Fecha").val(obtenerFecha().substr(0, 10));
      $("#cntPoda_PanelVisitaPrevia_CrearOt").modal("show");
    });

  $("#frmPodaVisitaPrevia_CrearOT").on("submit", function(evento)
    {
      evento.preventDefault();
      $("#frmPodaVisitaPrevia_CrearOT").generarDatosEnvio("txtPoda_PanelVisitaPrevia_CrearOt_", function(datos)
        {
          $.post('../server/php/proyectos/poda/crearVisitaPrevia.php', {idOT: $("#txtPoda_PanelOT_CrearOt_idOT").val(), datos: datos}, function(data, textStatus, xhr) 
          {
            if (parseInt(data) >= 0)
            {
              poda_PanelVisita_CargarVisitas();
              $("#cntPoda_PanelVisitaPrevia_CrearOt").modal("hide");
            } else
            {
              Mensaje("", data);
            }
          }).fail(function()
          {
            Mensaje("Error", "Hubo un error en la Conexión", "danger");
          });
        });
    });
}

function poda_PanelVisita_CargarVisitas()
{
  $("#tblPoda_PanelVisitaPrevia_Ot tbody tr").remove();
  $.post('../server/php/proyectos/poda/cargarVisitasPrevias.php', {idOT: $("#txtPoda_PanelOT_CrearOt_idOT").val()}, function(data, textStatus, xhr) 
  {
     if (data != 0)
     {
      var tds = "";
      $.each(data, function(index, val) 
      {
        tds += '<tr>';
          tds += '<td><button class="btn btn-warning btnVisitaPrevia_AbrirVisita" title="Abrir Visita" idVisita="' + val.id + '"><i class="icon wb-eye"></i> </button><button class="btn btn-info btnPoda_PanelVisitaPrevia_Editar" title="Editar Visita" idVisita="' + val.id + '"><i class="icon wb-edit"></i> </button></td>';
          tds += '<td>' + val.Prefijo + '</td>';
          tds += '<td>' + val.Fecha + '</td>';
          tds += '<td>' + val.Subestacion + '</td>';
          tds += '<td>' + val.Brigada + '</td>';
          tds += '<td>' + val.Descargo + '</td>';
          tds += '<td>' + val.refInicio + '</td>';
          tds += '<td>' + val.refFin + '</td>';
        tds += '</tr>';
      });

      $("#tblPoda_PanelVisitaPrevia_Ot tbody").append(tds);
     }
   }, "json"); 
}

var map_Poda_VisitaPrevia = null;
var marcadores_Poda_VisitaPrevia = [];

function poda_VisitaPrevia_Programacion()
{
  $.post('../server/php/proyectos/poda/cargarUnidadesConstrucctivas.php', {Usuario : Usuario.id}, function(data, textStatus, xhr) 
  {
    $("#txtPoda_VisitaPrevia_Programacion_UUCC option").remove();
    if (typeof(data) == "object")
    {
        var tds = "<option value=''>Seleccione una </option>";

        $.each(data, function(index, val) 
        {
           tds += '<option value="' + val.id + '">' + val.Nombre + '</option>';
        });

        $("#txtPoda_VisitaPrevia_Programacion_UUCC").append(tds);
      
    } else
    {
      if (data != 0)
      {
        Mensaje("Error", data, "danger");
      } else
      {
        Mensaje("Error", "No hay especies configuradas", "danger");
      }
    }
  }, "json");

  $.post('../server/php/proyectos/poda/cargarEspecies.php', {Usuario : Usuario.id}, function(data, textStatus, xhr) 
  {
    $("#txtPoda_VisitaPrevia_Programacion_TipoEspecie option").remove();
    if (typeof(data) == "object")
    {
        var tds = "<option value=''>Seleccione una </option>";

        $.each(data, function(index, val) 
        {
           tds += '<option value="' + val.Nombre + '">' + val.Nombre + '</option>';
        });

        $("#txtPoda_VisitaPrevia_Programacion_TipoEspecie").append(tds);
      
    } else
    {
      if (data != 0)
      {
        Mensaje("Error", data, "danger");
      } else
      {
        Mensaje("Error", "No hay especies configuradas", "danger");
      }
    }
  }, "json");
  $("#frmPoda_VisitaPrevia_Archivos").ajaxForm(
  {
    beforeSend: function() 
    {
        var percentVal = '0%';
        $("#txtPoda_VisitaPrevia_ArchivosProgreso").width(percentVal);
        $("#txtPoda_VisitaPrevia_ArchivosProgreso").text(percentVal);
    },
    uploadProgress: function(event, position, total, percentComplete) {
        
        var percentVal = percentComplete + '%';
        $("#txtPoda_VisitaPrevia_ArchivosProgreso").width(percentVal);
        $("#txtPoda_VisitaPrevia_ArchivosProgreso").text(percentVal);
    },
    success: function() {
        var percentVal = '100%';
        $("#txtPoda_VisitaPrevia_ArchivosProgreso").width(percentVal);
        $("#txtPoda_VisitaPrevia_ArchivosProgreso").text(percentVal);
    },
    complete: function(xhr) {
      var respuesta = xhr.responseText;
      if (respuesta.substring(0, 11) == "../archivos")
          {
            var tds = "";
            arrNomArchivo = respuesta.split("$$");
            arrNomArchivo = arrNomArchivo[0];
            var arrArchivo = arrNomArchivo.split("/");
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
                      tds += '<a class="name" href="' + arrNomArchivo.replace("../", "../server/") + '" target="_blank">' + nomArchivo + '</a>';
                      tds += '<a class="btn btn-danger pull-right btnDocumental_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
                    tds += '</h4>';
                  tds += '</div>';
                tds += '</div>';
              tds += '</li>';

            $("#cntPoda_VisitaPrevia_Archivos").append(tds);
          } else
          {
            Mensaje("Error","Hubo un Error, " + respuesta, "danger");
          }
     }
  }); 
  
  $("#frmPoda_VisitaPrevia_Programacion_Formato").on("submit", function(evento)
  {
    evento.preventDefault();
    $("#frmPoda_VisitaPrevia_Programacion_Formato").generarDatosEnvio("txtPoda_VisitaPrevia_Programacion_", function(datos)
      {
        $.post('../server/php/proyectos/poda/crearVisitaPrevia_Dato.php', {datos : datos}, function(data, textStatus, xhr) 
        {
          if (isNaN(data))
          {
            Mensaje("Error", data, "danger");
          } else
          {
            Mensaje("Hey", "Los datos de han sido ingresados", "success");
            url = "../assets/images/icons/tree_Visitado.png";
            if (!$(".btnPoda_Programacion_Seleccionar[idArbol=" + $("#txtPoda_VisitaPrevia_Programacion_idArbol").val() + "]").is(":checked"))
            {
              $(".btnPoda_Programacion_Seleccionar[idArbol=" + $("#txtPoda_VisitaPrevia_Programacion_idArbol").val() + "]").trigger('click');
            }
            Markers[$("#txtPoda_VisitaPrevia_Programacion_idArbol").val()].setIcon({url : url});
            $(".btnPoda_Programacion_VerMarker[idArbol=" + $("#txtPoda_VisitaPrevia_Programacion_idArbol").val() + "]").trigger('click');
          } 
        });
      });
  });
}
function vIniciarMapa(Lat, Lon, contenedor, fClick)
{
  var objMapa = null;
  if (fClick === undefined)
  {
    fClick = function(){};
  }
  if (typeof GMaps == "undefined")
  {
    $("#cntNoConformidades_Ubicacion").slideUp();
  } else
  {
    Lat = 10.97575;
    Lon = -74.7893333333333;

    if (contenedor === undefined)
    {
      contenedor = '#cntPoda_Visitaprevia_Programacion_Mapa';
    }
    if (Lat != undefined && Lon != undefined)
    {
      objMapa = new GMaps({
        el: contenedor,
        lat : Lat,
        lng : Lon,
        click : fClick,
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

      objMapa.addStyle({
        styledMapName: "Styled Map",
        styles: $.components.get('gmaps', 'styles'),
        mapTypeId: "map_style"
      });

      objMapa.setStyle("map_style");
    }
    return objMapa;
  }
  return false;
}

function vAgregarMarcador(datos, mapa, Marcadores, funcionClickMarcador)
{
  if (datos === undefined)
  {
    datos = {};
  }

  if (funcionClickMarcador === undefined)
  {
    funcionClickMarcador = function(){};
  }

  var lat = datos.latitud || "";
  var lon = datos.longitud || "";

  if (lat != "" && lon != "")
  {
    lat = lat.replace(",", ".");
    lon = lon.replace(",", ".");
    
   
    var iconosArbol = ["tree_green.png", "tree_green.png", "tree_Programado.png", "tree_Visitado.png", "tree_Intervenido.png", "tree_Revisado.png", "tree_Conforme.png", "tree_NoConforme.png", "tree_Liquidado.png"];;

    if (datos.idEstado == "" || datos.idEstado < 2)
    {
      datos.idEstado = 0;
    }

    Marcadores[datos.idArbol] = mapa.addMarker({
        lat: lat,
        lng: lon,
        icon : '../assets/images/icons/' + iconosArbol[datos.idEstado],
        click : funcionClickMarcador          
      });

  }
}


function jsCrearUsuario()
{
  $("#txtCrearUsuario_perfil option").remove();
  $.post('../server/php/proyectos/configuracion/cargarPerfiles.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
  {
    if (data != 0 )
    {
      var tds = "";
      $.each(data, function(index, val) 
      {
         tds += '<option value="' + val.id + '">' + val.Nombre + '</option>';
      });
      $("#txtCrearUsuario_perfil").append(tds);
    }
  }, "json");

  $("#cntCrearUsuario_Zonas div").remove();
  $.post('../server/php/proyectos/configuracion/cargarDelegaciones.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
  {
    if (data != 0 )
    {
      var tds = "";
      $.each(data, function(index, val) 
      {
        tds += '<div class="col-md-4">';
         tds += '<div class="checkbox-custom checkbox-primary">';
            tds += '<input type="checkbox" idDelegacion="' + val.id + '"id="chkCrearUsuario_' + val.id + '">';
            tds += '<label for="chkCrearUsuario_' + val.id + '">' + val.Nombre + '</label>';
          tds += '</div>';
        tds += '</div>';
      });
      $("#cntCrearUsuario_Zonas").append(tds);
    }
  }, "json");

  $("#btnCrearUsuario_ZonasNinguna").on("click", function()
    {
      $("#cntCrearUsuario_Zonas input[type=checkbox]").prop("checked", false);
    });

  $("#btnCrearUsuario_ZonasTodas").on("click", function()
    {
      $("#cntCrearUsuario_Zonas input[type=checkbox]").prop("checked", true);
    });
}

function calcularTiempoPublicacion(fecha)
{
    fecha = new Date(fecha.replace(" ", "T") + "Z");
    var fechaActual = new Date();
    
    var tiempo = fecha.getTime();
    var tiempoActual = fechaActual.getTime();

    var diferencia = tiempoActual-tiempo;

    diferencia = parseInt(((diferencia/1000)/60)-300);

    var respuesta = "";
    if (diferencia < 2)
    {
      respuesta = "hace un momento";
    } else
    {
      if (diferencia < 60)
      {
        respuesta = "hace " + diferencia + " minutos";
      } else
      {
          if (diferencia < 120)
          {
            respuesta = "hace " + 1 + " hora";
          } else
          {
            if (diferencia < 1440)
            {
              respuesta = "hace " + parseInt(diferencia/60) + " horas";
            } else
            {
              if (diferencia < 43200)
              {
                respuesta = "hace " + parseInt(diferencia/60/24) + " dias";
              } else
              {
                respuesta = "hace " + parseInt(diferencia/60/24/30) + " meses";
              }
            }
          }
      }
    }

    return respuesta;
}

var podaAgregarArbol_Map = null;
var podaAgregarArbol_Marker = null;
function poda_AgregarArbol()
{
  $(".btnPoda_AgregarArbol_Volver").on("click", function()
  {
    cargarModulo($("#txtPoda_AgregarArbol_btnVolver_Vinculo").val(), $("#txtPoda_AgregarArbol_btnVolver_Texto").val());
  });

  podaAgregarArbol_Map = vIniciarMapa("", "", "#cntAgregarArbol_Mapa", function(e)
    {
      podaAgregarArbol_Marker.setPosition({lat : e.latLng.lat(), lng: e.latLng.lng()});
      $("#txtPoda_AgregarArbol_Longitud").val(e.latLng.lng());
      $("#txtPoda_AgregarArbol_Latitud").val(e.latLng.lat());
    });

  $("#frmPoda_AgregarArbol").on("submit", function(evento)
    {
      evento.preventDefault();
      $("#frmPoda_AgregarArbol").generarDatosEnvio("txtPoda_AgregarArbol_", function(datos)
      {
        $.post('../server/php/proyectos/poda/crearArbol.php', {Usuario : Usuario.id, idCircuito : $("#txtPoda_Circuito").val(),  datos: datos}, function(data, textStatus, xhr) 
        {
          if (isNaN(data))
          {
            Mensaje("Error", data, "danger");
          } else
          {
            if (data != 0)
            {
              if (data != $("#txtPoda_AgregarArbol_idArbol").val())
              {
                $("#txtPoda_AgregarArbol_idArbol").val(data);
                var fecha_levanta = obtenerFecha().substr(0, 10).replace(/-/g, "");
                if ($("#txtPoda_Programacion_lChk" + fecha_levanta).length == 0)
                {
                  var tds = '<div class="col-md-4">';
                    tds += '<div class="checkbox-custom checkbox-success">';
                      tds += '<input type="checkbox" id="txtPoda_Programacion_lChk' + fecha_levanta + '" fecha="' + fecha_levanta + '">';
                      tds += '<label for="txtPoda_Programacion_lChk' + fecha_levanta + '">' + fecha_levanta + ' (' + 1 + ' Arboles)</label>';
                    tds += '</div>';
                  tds += '</div>';
                  $("#cntPoda_Programacion_Capas").append(tds);
                } else
                {
                  var objFila = $('#txtPoda_Programacion_lChk' + fecha_levanta).parent("div").find("label");
                  var objNumero = $(objFila).text().replace(fecha_levanta + ' (', "");
                  objNumero = objNumero.replace(' Arboles)', "");
                  objNumero = parseInt(objNumero) + 1;
                  $(objFila).text(fecha_levanta + ' (' + objNumero + ' Arboles)');

                  if ($('#txtPoda_Programacion_lChk' + fecha_levanta).is(":checked"))
                  {
                    var t = $("#tblPoda_Programacion").DataTable();
                    var tds = [];

                    datos = JSON.parse(datos);
                    var objVal = {idArbol : data, matricula : datos['Matricula'], nombre_comun : datos.NombreComun, especie : datos.Especie, fecha_levanta : fecha_levanta, familia : datos.Familia, longitud : datos.Longitud, latitud : datos.Latitud, diametro_ap : datos.circunf_cap, diametro_copa : datos.DiametroCopa, altura: datos.Altura, estado_fisico : datos.EstadoFisico, estado_fito : datos.EstadoFito, idEstado : 0, tratamiento : datos.Tratamiento, nivel_afectacion : datos.NivelAfectacion, tension : datos.Tension};

                    poda_Programacion_AgregarMarcador(objVal);

                    tds.push([
                            objVal.idArbol,
                            '<input type="checkbox" idArbol="' + data + '"class="newSwitchery btnPoda_Programacion_Seleccionar" data-plugin="switchery" data-color="#3aa99e"></div> <div class="col-xs-6 margin-5">',
                            '<button idArbol="' + data + '" class="btn btn-info btnPoda_Programacion_VerMarker"><i class="icon wb-eye"></i> </button>',
                            objVal.matricula,
                            objVal.nombre_comun,
                            objVal.especie,
                            objVal.fecha_levanta,
                            objVal.familia,
                            objVal.longitud,
                            objVal.latitud,
                            objVal.diametro_ap,
                            objVal.diametro_copa,
                            objVal.altura,
                            objVal.estado_fisico,
                            objVal.estado_fito,
                            ""
                          ]);

                    t.rows.add(tds).draw( false );
                    iniciarSwitchery();
                  }
                }

              } 
            }
            Mensaje("Hey", "Los datos del Arbol han sido ingresados", "success");
          }
        });
      }); 
    });
}