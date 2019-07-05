var oListaRegBanco;
var pFormulario = 0;
$(function(){
    oListaRegBanco = $("#ListaRegBanco").DataTable({
        "lengthChange": false,
        "searching": false,
        "language": {
            "decimal": ".",
            "thousands": ","
        },
        "ajax": {
            "url": '/Finanzas/RegistroBanco/Listar',
            "type": "post",
            "data": function (d) {
                return {
                    "fechaInicio": $('#BuscarFechaInicio').val(),
                    "fechaFin": $('#BuscarFechaFin').val(),
                    "idBanco": $('#Buscarid_banco').val(),
                    "idBancoCuenta": $('#Buscarid_banco_cuenta').val(),
                    "nroOperacion": $('#Buscarnro_operacion').val(),
                    "nroAsiento": $('#Buscarnro_asiento').val(),
                    "idSubDiario": $('#Buscarid_sub_diario').val() 
                };
            },
            "dataSrc": function (data) {
                switch (data.accion) {
                    case "success":
                        oListaRegBanco.clear();
                        oListaRegBanco.rows.add(data.Lista).draw();
                        break;
                    case "error":
                        MostrarMensaje('Error de operación', data.Msj, 'error');
                        break;
                }
            }
        },
        "columnDefs": [
            {
                "className": 'text-nowrap',
                "targets": [0]
            }
        ],
        "columns":
            [
                {
                    "render": function (data, type, full, meta) {
                        return '<button type="button" class="btn btn-default btn-outline btn-outline RBancoVista" data-toggle="tooltip" data-original-title="Vista" data-id_registro_banco="' + full.id_registro_banco + '">' +
                            '<i class="fa fa-search text-inverse" aria-hidden="true"></i></button>' +
                            '<input type="hidden" value="' + full.Opciones + '" name="Opciones" >' +
                            '<input type="hidden" value="' + full.id_registro_banco + '" name="id_registro_banco" >' +
                            '<input type="hidden" value="' + full.id_sub_diario + '" name="id_sub_diario" >';
                    }
                },
                { "data": "nro_asiento", "name": "nro_asiento", "autoWidth": true },
                {
                    "render": function (data, type, full, meta) {
                        return '<label id="fecha_operacion" name="fecha_operacion">' + moment(full.fecha_operacion).format("DD/MM/YYYY") + '</label>';
                    }
                },                  
                { "data": "nro_operacion", "name": "nro_operacion", "autoWidth": true },
                { "data": "BancoNombre", "name": "BancoNombre", "autoWidth": true },                
                { "data": "PersonaNroDocumento", "name": "PersonaNroDocumento", "autoWidth": true },
                { "data": "PersonaNombre", "name": "PersonaNombre", "autoWidth": true },
                { "data": "glosa", "name": "glosa", "autoWidth": true },
                { "data": "Moneda", "name": "Moneda", "autoWidth": true },
                { "data": "importe_mn", "name": "importe_mn", "autoWidth": true },
                {
                    "render": function (data, type, full, meta) {
                        if (full.id_estado == 1) {
                            return '<div class="label label-table  label-warning" data-toggle="tooltip" data-original-title="Abierto"><i class="fa fa-unlock"></i></div>';
                            
                        } else if (full.id_estado == 2) {
                            return '<div class="label label-table  label-success" data-toggle="tooltip" data-original-title="Cerrado"><i class="fa fa-lock"></i></div>';
                        }
                    }
                },
            ],
        "sScrollY": 350,
        "sScrollX": "110%",
        "bScrollCollapse": true,
        "pageLength": 20
    });

    $("#NotaCredito").click(function (e) {
        e.preventDefault();
        if (pFormulario.length === 1) {
            $("#" + pFormulario[0].id).remove();
        }
        pFormulario = CargarPanel('Banco Ingresos', 'bootstrap-primary', '/Finanzas/RegistroBanco/BancoIngresos', 950, 600);
    });
});