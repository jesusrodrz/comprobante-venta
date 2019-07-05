var locale = window.navigator.userLanguage || window.navigator.language;
$(function () {
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
    });

    /*Funcion para cargar calendario*/
    $('.calendar-form').on('click', function (e) {
        e.preventDefault();
        $(this).datetimepicker({
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            locale: locale,
            format: "DD/MM/YYYY"
        });
    });
    $(document).on('click', '.calendar-form', function (e) {
        $(this).datetimepicker({
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            locale: locale,
            format: "DD/MM/YYYY"
        });
        e.preventDefault();
    });
    /*Funcion para cargar calendario y hora*/
    $(document).on('click', '.calendartimer-form', function (e) {
        $(this).datetimepicker({
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            locale: locale,
            format: "DD/MM/YYYY HH:mm:ss"
        });
        e.preventDefault();
    });
    /*Funcion para mantener el filtro en pantalla*/
    $('.filter-main').on('click', function (e) {
        e.stopPropagation();
    });
    /*Funcion para agregar clase a una fila de la tabla*/
    $('.table-main').on('click', 'tr', function (e) {
        $('tr.selected-row').removeClass('selected-row').removeAttr("style");
        $(this).addClass('selected-row').css("cssText", 'background-color : #41b3f9 !important');
    });

    swalConfirm = function (sTitle, sText, callback) {
        swal({
            title: sTitle,
            text: sText,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            cancelButtonColor: "#C1C1C1",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm : callback
        });
    };

    swalEliminarFila = function (callback) {
        swal({
            title: "Est\u00e1 seguro de eliminar esta fila?",
            text: "Eliminar Fila",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            cancelButtonColor: "#C1C1C1",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm : callback
        });
    };
});

/**
 * Funcion Cargar Modal
 * @param {string} UrlModal url para cargar modal.
 * @param {string} IdModal Url Modal.
 * @param {string} InfoModal Contenedor donde se mostrar el html.
 */
function CargarModal(UrlModal, IdModal, InfoModal) {
    $.get(UrlModal, function (data) {
        $("#" + InfoModal).html(data);
        $("#" + IdModal).modal('show');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0) {
            MostrarErrores(textStatus + " Sin conexi\u00f3n verifque");
        } else if (jqXHR.status === 400) {
            MostrarErrores(textStatus + " error pagina no encontrada [400], nombre de error " + errorThrown);
        } else if (jqXHR.status === 404) {
            MostrarErrores(textStatus + " error pagina no encontrada [404], nombre de error " + errorThrown);
        } else if (jqXHR.status === 500) {
            MostrarErrores(textStatus + " Interno [500], nombre de error " + errorThrown);
        }
    });
}

/**
 * Funcion para Cargar Select anidados para departamento,provincia,distrito
 * @param {int} ValueSelect Valor select principal
 * @param {string} Url para cargar los datos dentro del select
 * @param {string} IdSelectAnidado Id select anidado departamento
 */
function CargarSelectDPD(ValueSelect,Url,IdSelectAnidado) {
    let UrlSelect = Url + '?id=' + ValueSelect;

    $.get(UrlSelect, function (data) {
        let options = $("#" + IdSelectAnidado);

        options
            .find('option')
            .remove()
            .end()
            .append('<option value="">---Seleccionar---</option>')
            .val('');

        $.each(data, function (key, val) {
            options.append(new Option(val.Text, val.Value));
        });
    });
}

/* Funcion para limpiar Modal */
function ClearModal(modal, content) {
    $("#" + modal + "").modal('hide');
    $("#" + content + "").html('');
}
/**
 * Funcion para mostrar mensajes de error en los formularios
 * @param {Msj} Msj Msj Mensaje a mostrar
 */
function MostrarErrores(Msj) {
    $('.alerttop').find('small').append(Msj);
    var test = $('.alerttop').fadeToggle(350).css({ 'z-index': '10005' });
}

/**
 * Funcion Cargar Panel
 * @param TitlePanel Titulo Panel
 * @param ThemePanel Thema Panel
 * @param {string} Url.
 * @returns {string} Panel.
 */
function CargarPanel(TitlePanel,ThemePanel,Url,Width = 850,Height = 600) {
    var Panel = $.jsPanel({
        closeOnEscape: true,
        position: 'center-top 0 60',
        show: 'animated fadeInDownBig',
        headerTitle: TitlePanel,
        theme: ThemePanel,
        contentOverflow: {
            horizontal: 'hidden',
            vertical: 'scroll'
        },
        container: document.body,
        contentSize: {
            width: function () { return Math.min(Width, window.innerWidth * 0.9); },
            height: function () { return Math.min(Height, window.innerHeight * 0.9); }
        },
        content: '<div class="text-center m-t-10"><i class="fa fa-circle-o-notch fa-spin fa-4x fa-fw"></i><span class="sr-only">Cargando...</span></div>',
        callback: function (panel) {
            $.get(Url, function (data) {
                $(panel.content).html(data);
                switch (data.accion) {
                    case "error":
                        MostrarMensaje('Error de operaci\u00f3nn', data.Msj, "error");
                        panel.close();
                        break;
                    default:
                        $(panel.content).html(data);
                        break;
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 0) {
                    MostrarErrores(textStatus + " Sin conexi\u00f3n verifque");
                } else if (jqXHR.status === 400) {
                    MostrarErrores(textStatus + " error pagina no encontrada [400], nombre de error " + errorThrown);
                } else if (jqXHR.status === 404) {
                    MostrarErrores(textStatus + " error pagina no encontrada [404], nombre de error " + errorThrown);
                } else if (jqXHR.status === 500) {
                    MostrarErrores(textStatus + " Interno [500], nombre de error " + errorThrown);
                }
            });
        },
        onwindowresize: false
    }).css({ 'z-index': 9999 });

    return Panel;
}

/**
 * Funcion Cargar Tipo de Cambio
 * @param {string} IdSelect
 * @param {datetimepicker} FechaInput
 * @param {TipoCambioInput} TipoCambioInput
 * @param {IdTipoCambioInput} IdTipoCambioInput
*/
function CargarTipoCambio(IdSelect, FechaInput, TipoCambioInput, IdTipoCambioInput ) {
        
    $.ajax({
        type: "POST",
        url: '/General/TipoCambio/CargarTipoCambio',
        dataType: 'json',
        data: {
            IdMoneda: $(IdSelect).val(),
            Fecha: $(FechaInput).val()
        }
    }).done(function (data) {
        switch (data.accion) {
            case "succes":
                $(TipoCambioInput).val(data.TipoCambio).blur();
                $(IdTipoCambioInput).val(data.IdTipoCambio);
                break;
            case "error":
                $(TipoCambioInput).val('0.00').blur();
                $(IdTipoCambioInput).val('').blur();
                MostrarMensaje('Error de operaci\u00f3n', data.Msj, 'error');
                break;
        }
    });
}

function CargarTipoCambioDolares(FechaInput, TipoCambioInput, IdTipoCambioInput ) {
        
    $.ajax({
        type: "POST",
        url: '/General/TipoCambio/CargarTipoCambio',
        dataType: 'json',
        data: {
            IdMoneda: "2",
            Fecha: $(FechaInput).val()
        }
    }).done(function (data) {
        switch (data.accion) {
            case "succes":
                $(TipoCambioInput).val(data.TipoCambio);
                $(IdTipoCambioInput).val(data.IdTipoCambio);
                $(TipoCambioInput).blur();
                break;
            case "error":
                $(TipoCambioInput).val('0.00');
                $(IdTipoCambioInput).val('');
                MostrarMensaje('Error de operaci\u00f3n', data.Msj, 'error');
                break;
        }
    });
}

/**
 * Funcion Buscar Persona por Numero de Documento
*/
function BuscarPersonaContactoPorNumeroDocumento(campo, inputIdPersona, inputRuc, inputRazonSocial, inputIdContacto, inputContactoNombre) {
    $(campo).click(function (e) {
        let sNroRuc = $(inputRuc).val();
        if (sNroRuc === '') {
            MostrarMensaje("Aviso", "Ingrese un Ruc valido.");
            return;
        }

        $.ajax({
            type: "GET",
            url: '/General/Persona/BuscarPersonaContactoPorNroDocumento',
            dataType: 'json',
            data: { nroDocumento: sNroRuc }
        }).done(function (data) {

            switch (data.accion) {
                case "success":
                    var datos = {};
                    $(inputIdPersona).val(data.IdPersona);
                    $(inputRazonSocial).val(data.NombreCompleto);
                    $(inputIdContacto).val(data.IdContacto);
                    $(inputContactoNombre).val(data.NombreContacto);
                    break;
                case "validation":
                    MostrarMensaje('Aviso', data.Msj, 'error');
                    break;
                case "error":
                    MostrarMensaje('Error de operaci\u00f3n', data.Msj, 'error');
                    break;
            }
        });
    });
}

/* Calcular Total Comprobante de Venta*/
function CalcularTotal(IdTabla, IdIgvInput, IdCantidadInput, IdMontoUnitarioInput, IdMontoSubTotalInput, MontoVenta, Igv, MontoTotal) {
    var $tblrows = $("#"+IdTabla + " tbody tr");
    var valorIgv = $("#"+IdIgvInput).val();
    var montoSubTotal = 0;
    var montoIgv = 0;
    var montoTotal = 0;
    var igv = ConvertToDecimal(valorIgv, 2) / 100.00;
    
    $tblrows.each(function (index) {
        var $tblrow = $(this);
        
        var cantidad = ConvertToDecimal($tblrow.find("[id=" + IdCantidadInput + "]").val());
        var precio = ConvertToDecimal($tblrow.find("[id=" + IdMontoUnitarioInput +"]").val());
        var total = cantidad * precio;
        
        total = ConvertToDecimal(total, 2);
        $tblrow.find("[id=" + IdMontoSubTotalInput + "]").val(ConvertToString(total, 2));
        montoSubTotal += total;
    });
    
    montoIgv = ConvertToDecimal(montoSubTotal * igv, 2);
    montoTotal = ConvertToDecimal(montoSubTotal + montoIgv, 2);
    $("#" + MontoVenta).text(ConvertToString(montoSubTotal, 2));
    $("#" + Igv).text(ConvertToString(montoIgv, 2));
    $("#" + MontoTotal).text(ConvertToString(montoTotal, 2));
}

function ConvertToDecimal(numero, decimales) {
    if (numero === undefined || numero === '') numero = '0.00';
    else numero = numero.toString().split(',').join('');
    if (typeof decimales === 'undefined') return parseFloat(numero); 
    else return redondear(numero, decimales);
}

function redondear(cantidad, decimales) {
    var cantidad = parseFloat(cantidad);
    var decimales = parseFloat(decimales);
    decimales = (!decimales ? 2 : decimales);
    return Math.round(cantidad * Math.pow(10, decimales)) / Math.pow(10, decimales);
} 

function ConvertToString(monto, nroDecimales) {
    if (monto === undefined) return '0.00';
    var i = 0;
    var pos;
    var decimales = '';
    var valor = monto.toString();
    var max = valor.length;
    for (var j = 0; j < max; j++) {
        if (valor.charAt(j) === '.') {
            pos = j;
            break;
        }
    }
    var monto_redondeo = redondear(monto, nroDecimales);
        
    valor = monto_redondeo.toString();
    pos = parseInt(pos);
    if (pos > 0) {
        decimales = valor.substring(pos + 1, valor.length);
        decimales = Rellena_Ceros(decimales, nroDecimales - decimales.length);
    }
    else
        decimales = Rellena_Ceros(decimales, nroDecimales);

    //if (decimales == '') decimales = '00';
    var entero = parseInt(monto_redondeo);
    var tmp = parseInt(entero / 1000);
    var miles;
    var centenas;
    var total_miles;
    if (tmp > 0) {
        total_miles = tmp.toString().length;
    }
    else
        total_miles = 0;

    if (total_miles > 0) {
        miles = entero.toString().substring(0, total_miles);
        centenas = entero % 1000;
        centenas = centenas.toString()
        var cen = centenas.length;
        if (cen === 1)
            centenas = '00' + centenas;
        else if (cen === 2)
            centenas = '0' + centenas;

        resultado = miles + ',' + centenas;
    }
    else
        resultado = entero;

    resultado = resultado + '.' + decimales;
    return resultado;
}

    function Rellena_Ceros(cadena, N)  // Funcion que antepone ceros a una cadena hasta alcazar
    {                                 // una longitud N. Si N es menor que la longitud, no pone ninguno.
        var k = 0;
        var resultado = cadena.toString();
        for (k; k < N; k++)
            resultado = resultado.toString() + "0";
        return resultado;
    }

    function ComparaFecha(fechainicio,fechafin,flag){ 
        comp1 	= fechainicio.substr(6,4) + '' + fechainicio.substr(3,2) + '' + fechainicio.substr(0,2);
        comp2 	= fechafin.substr(6,4) + '' + fechafin.substr(3,2) + '' + fechafin.substr(0,2);
        if (flag === '0')
        {		
            if 	((comp1) > (comp2)){			
                return false;
            }							
        }
        if (flag === '1'){		
            if 	((comp1) >= (comp2)){			
                return false;
            }							
        }
        return true;
    }

    /*Cerrar Alerta*/
    $(".myadmin-alert .closed").click(function (event) {
        $(this).parents(".myadmin-alert").find('small').text('');
        $(this).parents(".myadmin-alert").fadeToggle(350);
        return false;
    });

function MostrarMensaje(sTitle, sText, sType) {
    swal({
        title: sTitle,
        text: sText,
        type: sType,
        confirmButtonText: "OK"
    });
}

function MostrarMensajeValidacion(sMsj) {
    swal({
        title: "Existen datos que faltan validar",
        text: sMsj,
        type: "warning"
    });
}

function MostrarMensajeError(sMsj) {
    swal({
        title: "Error de operaci\u00f3n",
        text: sMsj,
        type: "error"
    });
}

function MostrarMensajeSuccess(sMsj, sTitle, callback) {
    swal({
        title: sMsj,
        text: sTitle,
        type: "success"
    }).then( callback );
}

/**
* Fecha Actual
* @returns {DateNow} DateNow
*/
function FechaActual() {
    var today = new Date();
    var Dia = today.getDate();
    var Mes = today.getMonth() + 1;
    var Ano = today.getFullYear();
    if (Dia < 10) Dia = '0' + Dia;
    if (Mes < 9) Mes = '0' + Mes;
    return DateNow = Dia + '/' + Mes + '/' + Ano;
}

    /*
     * Gets the data table height based upon the browser page
     * height and the data table vertical position.
     * 
     * @return  Data table height, in pixels.
     */
    function jsGetDataTableHeightPx(idTabla, pHeight) {
        // set default return height
        var retHeightPx = 270;

        // no nada if there is no dataTable (container) element
        var dataTable = document.getElementById(idTabla);
        
        if (!dataTable) {
            return retHeightPx;
        }

        // do nada if we can't determine the browser height
        var pageHeight = $(window).height();
        if (pageHeight < 0) {
            return retHeightPx;
        }
        // determine the data table height based upon the browser page height
        var dataTableHeight = pageHeight - 320; //default height
        var dataTablePos = $("#" + idTabla).offset();

        if (dataTablePos != null && dataTablePos.top > 0) {
            // the data table height is the page height minus the top of the data table,
            // minus space for any buttons at the bottom of the page
            
            dataTableHeight = pageHeight - dataTablePos.top - pHeight;

            // clip height to min. value
            //retHeightPx = Math.max(100, dataTableHeight);
            retHeightPx = dataTableHeight;
        }
        return retHeightPx;
    }

    function SetHeightTable(idTabla, pHeight){
        
        if (idTabla){
            if (pHeight === undefined) pHeight = 75;
            var height = jsGetDataTableHeightPx(idTabla, pHeight) + "px";
            
            $(".dataTables_scrollBody").css('height', height);
        }
    }

    function SoloNumeroDecimales(campo, numeroDecimales) {
        var maximoDigitos = 18;
        numeroDecimales = (numeroDecimales !== undefined && numeroDecimales !== null) ? numeroDecimales : 2;

        var reg = new RegExp("^[0-9]{1," + (maximoDigitos - numeroDecimales) + "}(\\.[0-9]{0," + numeroDecimales + "})?$");
        if (typeof campo === "string") {
            $(campo).keypress(function (e) {
                var char = String.fromCharCode(e.which);
                var index = this.selectionStart;
                var value = this.value.slice(0, index) + char + this.value.slice(index, this.value.length);

                if (!reg.test(value) || !validarNumeroDecimales(value, numeroDecimales)) {
                    return false;
                }
            });
            $(campo).attr("oncopy", "return false;");
            $(campo).attr("onpaste", "return false;");
            $(campo).attr("oncut", "return false;");
            $(campo).attr("onDrag", "return false;");
            $(campo).attr("onDrop", "return false;");
        } else {
            campo.keypress(function (e) {
                var char = String.fromCharCode(e.which);
                var index = this.selectionStart;
                var value = this.value.slice(0, index) + char + this.value.slice(index, this.value.length);

                if (!reg.test(value) || !validarNumeroDecimales(value, numeroDecimales)) {
                    return false;
                }
            });
            campo.attr("oncopy", "return false;");
            campo.attr("onpaste", "return false;");
            campo.attr("oncut", "return false;");
            campo.attr("onDrag", "return false;");
            campo.attr("onDrop", "return false;");
        }
    }

    function soloNumeros(campo) {

        if (typeof campo === "string") {
        
            $(campo).keypress(function (e) {
                var char = String.fromCharCode(e.which);
                var value = this.value + "" + char;
                if (!/^[0-9]*$/g.test(value) && e.which !== 8 ) {
                    return false;
                }
            });
            $(campo).attr("oncopy", "return false;");
            $(campo).attr("onpaste", "return false;");
            $(campo).attr("oncut", "return false;");
            $(campo).attr("onDrag", "return false;");
            $(campo).attr("onDrop", "return false;");
        } else {
            campo.keypress(function (e) {
                var char = String.fromCharCode(e.which);
                var value = this.value + "" + char;
                if (!/^[0-9]*$/g.test(value)) {
                    return false;
                }
            });
            campo.attr("oncopy", "return false;");
            campo.attr("onpaste", "return false;");
            campo.attr("oncut", "return false;");
            campo.attr("onDrag", "return false;");
            campo.attr("onDrop", "return false;");
        }
    }

    function validarNumeroDecimales(value, numeroDecimales) {
        var num = (numeroDecimales !== undefined && numeroDecimales !== null) ? numeroDecimales : 2;
        var patt = new RegExp("^\\d+(\\.\\d{0," + num + "})?$");
        return patt.test(value);
    }

    function OpenVentanaMaximizada(pagina, name) {
        var sOptions;
        sOptions = 'status=yes,menubar=no,scrollbars=yes,resizable=no,toolbar=no';
        sOptions = sOptions + ',width=' + (screen.availWidth - 10).toString();
        sOptions = sOptions + ',height=' + (screen.availHeight - 122).toString();
        sOptions = sOptions + ',screenX=0,screenY=0,left=0,top=0';
        wOpen = window.open(pagina, name, sOptions);
        wOpen.moveTo(0, 0);
        wOpen.resizeTo(screen.availWidth, screen.availHeight);
    }

function EstablecerCalendarioInput(campo){
    $(campo).datetimepicker({
        ignoreReadonly: true,
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        },
        locale: locale,
        format: 'DD/MM/YYYY'
    });
}

function EstablecerCalendarioInputTipoCambio(campo){
    $(campo).datetimepicker({
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        },
        locale: locale,
        format: 'DD/MM/YYYY'
    }).on('dp.change', function (e) {
        CargarTipoCambio('#id_moneda', "#fecha_tipo_cambio", "#TipoCambio", "#id_tipo_cambio");
    });
}

function EstablecerCalendarioInputTipoCambioDolares(campo, fechaTipoCambio){
    $(campo).datetimepicker({
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        },
        locale: locale,
        format: 'DD/MM/YYYY'
    }).on('dp.change', function (e) {
        if (fechaTipoCambio === null) fechaTipoCambio = "#fecha_tipo_cambio";
        CargarTipoCambioDolares(fechaTipoCambio, "#TipoCambio", "#id_tipo_cambio");
    });
}

function HoraInput(campo){
    $(campo).datetimepicker({
        icons: {
            time: "fa fa-clock-o",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        },
        locale: locale,
        format: 'HH:mm:ss'
    });
}

function AutocompletarPersona(campo, sTipoPersona, inputIdPersona, inputRuc, inputNombreCompleto){
    $(campo).typeahead({
        hint: true,
        highlight: true,
        minLength: 4,
        items: 10,
        displayText: function (item) {
            return item.NombreCompleto + ' ' + item.Ruc;
        },
        source: function (nombreCompleto, process) {
            return $.get('/General/Persona/AutocompletarPersonaPorNombre', {tipoPersona:sTipoPersona, nombreCompleto: nombreCompleto }, function (data) {
                process(data.Lista);
            });
        },
        afterSelect: function (item) {
            var nroDocumento = item.Ruc;
            $.get('/General/Persona/BuscarPersonaPorNroDocumento', { nroDocumento: nroDocumento }, function (data) {
                switch (data.accion) {
                    case "success":
                        inputIdPersona.val(data.IdPersona);
                        inputRuc.val(item.Ruc).blur();
                        inputNombreCompleto.val(data.NombreCompleto).blur();
                        break;
                    case "error":
                        MostrarMensaje("Error de Operaci�n", data.Msj, "error");
                        break;
                }
            });
        }
    });
}

function AutocompletarPersonaContacto(campo, sTipoPersona, inputIdPersona, inputRuc, inputNombreCompleto, inputIdContacto, inputContactoNombre){
    $(campo).typeahead({
        hint: true,
        highlight: true,
        minLength: 4,
        items: 10,
        displayText: function (item) {
            return item.NombreCompleto + ' ' + item.Ruc;
        },
        source: function (nombreCompleto, process) {
            return $.get('/General/Persona/AutocompletarPersonaPorNombre', {tipoPersona:sTipoPersona, nombreCompleto: nombreCompleto }, function (data) {
                process(data.Lista);
            });
        },
        afterSelect: function (item) {
            var nroDocumento = item.Ruc;
            $.get('/General/Persona/BuscarPersonaContactoPorNroDocumento', { nroDocumento: nroDocumento }, function (data) {
                switch (data.accion) {
                    case "success":
                        inputIdPersona.val(data.IdPersona);
                        inputRuc.val(item.Ruc).blur();
                        inputNombreCompleto.val(data.NombreCompleto).blur();
                        inputContactoNombre.val(data.NombreContacto).blur();
                        inputIdContacto.val(data.IdContacto);
                        break;
                    case "error":
                        MostrarMensaje("Error de Operaci�n", data.Msj, "error");
                        break;
                }
            });
        }
    });
}

function BuscarPersonaPorNumeroDocumento(campo, inputIdPersona, inputRuc, inputNombreCompleto)
{
    $(campo).click(function (e) {

        var snroDoc = $(inputRuc).val().trim();
        if (snroDoc === '') {
            MostrarMensaje("Aviso", "Ingrese un numero de documento", "info");
        }
        else {
            $.ajax({
                type: "GET",
                url: "/General/Persona/BuscarPersonaPorNroDocumento",
                dataType: 'json',
                data: { nroDocumento: snroDoc }
            }).done(function (data) {
                if (data.IdPersona === 0) {
                    MostrarMensaje("Aviso", "El socio de negocio no existe", "error");
                    $(inputIdPersona).val('').blur();
                    $(inputNombreCompleto).val('').blur();
                }
                else {
                    $(inputNombreCompleto).val(data.NombreCompleto).blur();
                    $(inputIdPersona).val(data.IdPersona).blur();
                }
            });
        }
    });
}

function BuscarPersonaPorNumeroDocumentoConEnter(campo, inputIdPersona, inputNombreCompleto)
{
    $(campo).keypress(function (e) {
        if (e.which === 13) {
            e.preventDefault();
            
            var snroDoc = $(campo).val().trim();
            if (snroDoc === '') {
                MostrarMensaje("Aviso", "Ingrese un numero de documento", "info");
            }
            else {
                $.ajax({
                    type: "GET",
                    url: "/General/Persona/BuscarPersonaPorNroDocumento",
                    dataType: 'json',
                    data: { nroDocumento: snroDoc }
                }).done(function (data) {
                    switch(data.accion){
                        case "validation":
                            MostrarMensaje("Aviso", data.Msj, "error");
                            $(inputIdPersona).val('').blur();
                            $(inputNombreCompleto).val('').blur();
                            break;
                        case "success":
                            $(inputNombreCompleto).val(data.NombreCompleto).blur();
                            $(inputIdPersona).val(data.IdPersona).blur();
                            break;
                        case "error":
                            MostrarMensaje("Error",data.Msj, "error");
                            $(inputIdPersona).val('').blur();
                            $(inputNombreCompleto).val('').blur();
                            break;
                    }
                });
            }
        }
    });
}

function ConsultarRucPersona(nroRucDni, RazonSocial, NombreComercial, Direccion, Distrito, Provincia, Departamento, CodigoUbigeo)
{
    var snroDoc = $("#"+nroRucDni).val().trim();
    if (snroDoc === '') {
        MostrarMensaje("Aviso", "Ingrese un numero de documento", "info");
    } else {
        swal.fire({
            title: "Consultar Ruc",
            text: "Persona",
            type: "info",
            confirmButtonColor: "#14acf4",
            confirmButtonText: "Enviar",
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.ajax({
                        type: 'POST',
                        url: "/General/Persona/ConsultaRucSunat",
                        dataType: 'json',
                        data: { ruc: snroDoc }
                    }).done(function (data) {
                        resolve(data);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 0) {
                            MostrarErrores(textStatus + " Sin conexi\u00f3n verifique");
                        } else if (jqXHR.status === 400) {
                            MostrarErrores(textStatus + " error pagina no encontrada [400], nombre de error " + errorThrown);
                        } else if (jqXHR.status === 404) {
                            MostrarErrores(textStatus + " error pagina no encontrada [404], nombre de error " + errorThrown);
                        } else if (jqXHR.status === 500) {
                            MostrarErrores(textStatus + " Interno [500], nombre de error " + errorThrown);
                        }
                    });
                });
            },
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                if (typeof result.value.Persona === 'undefined') {
                    MostrarMensaje("Aviso", "El Ruc o DNI no existe", "error");
                } else {
                    if (result.value.Persona.estado_del_contribuyente === "BAJA DE OFICIO") {
                        MostrarMensaje("Aviso", "La persona no esta ACTIVO", "error");
                        $("#" + RazonSocial).val("").blur();
                        $("#" + NombreComercial).val("").blur();
                        $("#" + Direccion).val("").blur();
                        $("#" + Distrito).val("").blur();
                        $("#" + Provincia).val("").blur();
                        $("#" + Departamento).val("").blur();
                        $("#" + CodigoUbigeo).val("").blur();
                    } else if (result.value.Persona.condicion_de_domicilio === "SUSPENSION TEMPORAL") {
                        MostrarMensaje("Aviso", "La persona esta SUSPENDIDA", "error");
                        $("#" + RazonSocial).val("").blur();
                        $("#" + NombreComercial).val("").blur();
                        $("#" + Direccion).val("").blur();
                        $("#" + Distrito).val("").blur();
                        $("#" + Provincia).val("").blur();
                        $("#" + Departamento).val("").blur();
                        $("#" + CodigoUbigeo).val("").blur();
                    } else if (result.value.Persona.estado_del_contribuyente === "ACTIVO") {
                        $("#" + RazonSocial).val(result.value.Persona.nombre_o_razon_social).blur();
                        $("#" + NombreComercial).val(result.value.Persona.nombre_comercial).blur();
                        $("#" + Direccion).val(result.value.Persona.direccion).blur();
                        $("#" + Distrito).val(result.value.Persona.distrito).blur();
                        $("#" + Provincia).val(result.value.Persona.provincia).blur();
                        $("#" + Departamento).val(result.value.Persona.departamento).blur();
                        $("#" + CodigoUbigeo).val(result.value.Persona.ubigeo).blur();
                    }
                    else{
                        MostrarMensaje("Aviso", "Error en obtener los datos.\r\n Vuelve a intenar.", "error");
                        $("#" + RazonSocial).val("").blur();
                        $("#" + NombreComercial).val("").blur();
                        $("#" + Direccion).val("").blur();
                        $("#" + Distrito).val("").blur();
                        $("#" + Provincia).val("").blur();
                        $("#" + Departamento).val("").blur();
                        $("#" + CodigoUbigeo).val("").blur();
                    }
                }
            }
        });
    }
}

function ObtenerDatosClienteVentaDirecta(IdPersona, Formulario, Nombrepersona, NumeroDocumento, IdPersonaDocumento, DireccionPersona, Departamento, Provincia, Distrito, Ubigeo)
{
    if (IdPersona === '') {
        MostrarMensaje("Aviso", "La persona no existe", "info");
    } else {
        $.ajax({
            type: 'POST',
            url: "/General/Persona/ObtenerDatosClienteVentaDirecta",
            dataType: 'json',
            data: { idPersona: IdPersona }
        }).done(function (data) {
            switch (data.accion) {
                case "success":
                    $("#" + Formulario).find('[name="' + Nombrepersona + '"]').val(data.NombreCompleto).blur();
                    $("#" + Formulario).find('[name="' + NumeroDocumento + '"]').val(data.NroDocumento).blur();
                    $("#" + Formulario).find('[name="' + IdPersonaDocumento + '"]').val(data.IdPersona);
                    $("#" + Formulario).find('[name="' + DireccionPersona + '"]').val(data.Direccion).focus();
                    $("#" + Formulario).find('[name="' + Departamento + '"]').val(data.Departamento);
                    $("#" + Formulario).find('[name="' + Provincia + '"]').val(data.Provincia);
                    $("#" + Formulario).find('[name="' + Distrito + '"]').val(data.Distrito);
                    $("#" + Formulario).find('[name="' + Ubigeo + '"]').val(data.Ubigeo);
                    break;
                case "error":
                    MostrarMensaje('Error de operaci�n', data.Msj, 'error');
                    break;
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 0) {
                MostrarErrores(textStatus + " Sin conexi\u00f3n verifique");
            } else if (jqXHR.status === 400) {
                MostrarErrores(textStatus + " error pagina no encontrada [400], nombre de error " + errorThrown);
            } else if (jqXHR.status === 404) {
                MostrarErrores(textStatus + " error pagina no encontrada [404], nombre de error " + errorThrown);
            } else if (jqXHR.status === 500) {
                MostrarErrores(textStatus + " Interno [500], nombre de error " + errorThrown);
            }
        });
    }
}

