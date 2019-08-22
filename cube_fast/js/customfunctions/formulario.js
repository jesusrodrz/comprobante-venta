var oListaRegBanco
var pFormulario = 0
$(function() {
  oListaRegBanco = $('#ListaRegBanco').DataTable({
    lengthChange: false,
    searching: false,
    language: {
      decimal: '.',
      thousands: ','
    },
    ajax: 'data/lista.json',
    columnDefs: [
      {
        className: 'text-nowrap',
        targets: [-1]
      }
    ],
    columns: [
      {
        render: function(data, type, full, meta) {
          return (
            '<button type="button" class="btn btn-default btn-outline btn-outline RBancoVista" data-toggle="tooltip" data-original-title="Vista" data-id_registro_banco="' +
            full.id_registro_banco +
            '">' +
            '<i class="fa fa-search text-inverse" aria-hidden="true"></i></button>' +
            '<input type="hidden" value="' +
            full.Opciones +
            '" name="Opciones" >' +
            '<input type="hidden" value="' +
            full.id_registro_banco +
            '" name="id_registro_banco" >' +
            '<input type="hidden" value="' +
            full.id_sub_diario +
            '" name="id_sub_diario" >'
          )
        }
      },
      { data: 'nro_asiento', name: 'nro_asiento', autoWidth: true },
      {
        render: function(data, type, full, meta) {
          return (
            '<label id="fecha_operacion" name="fecha_operacion">' +
            moment(full.fecha_operacion).format('DD/MM/YYYY') +
            '</label>'
          )
        }
      },
      { data: 'nro_operacion', name: 'nro_operacion', autoWidth: true },
      { data: 'BancoNombre', name: 'BancoNombre', autoWidth: true },
      {
        data: 'PersonaNroDocumento',
        name: 'PersonaNroDocumento',
        autoWidth: true
      },
      { data: 'PersonaNombre', name: 'PersonaNombre', autoWidth: true },
      { data: 'glosa', name: 'glosa', autoWidth: true },
      { data: 'Moneda', name: 'Moneda', autoWidth: true },
      { data: 'importe_mn', name: 'importe_mn', autoWidth: true },
      {
        render: function(data, type, full, meta) {
          if (full.id_estado == 1) {
            return '<div class="label label-table  label-warning" data-toggle="tooltip" data-original-title="Abierto"><i class="fa fa-unlock"></i></div>'
          } else if (full.id_estado == 2) {
            return '<div class="label label-table  label-success" data-toggle="tooltip" data-original-title="Cerrado"><i class="fa fa-lock"></i></div>'
          }
        }
      }
    ],
    sScrollY: window.innerHeight - 425,
    bScrollCollapse: true,
    pageLength: 15
  })
  function tabla(indentifier) {
    let singsState = false
    $('#' + indentifier).on('draw.dt', function() {
      const tableTds = [
        ...document
          .querySelector('#' + indentifier + ' tbody tr')
          .querySelectorAll('td')
      ]
      const tableThs = [
        ...document.querySelectorAll('.dataTables_scrollHeadInner th')
      ]
      const tbody = document.querySelector(
        '#' + indentifier + '_wrapper .dataTables_scrollBody'
      )
      const thead = document.querySelector(
        '#' + indentifier + '_wrapper .dataTables_scrollHead'
      )
      const width = Math.max(thead.offsetWidth, tbody.offsetWidth)

      thead.style.width = width
      tbody.style.width = width

      tableTds.forEach((element, index) => {
        const width = Math.max(element.offsetWidth, tableThs[index].offsetWidth)
        tableThs[index].style.width = width
        element.style.width = width
      })

      if (!singsState) {
        setBtnSings()
      }
    })

    const modal = document.createElement('div')
    modal.classList.add('modal-table')
    document.body.appendChild(modal)
    const tableContainer = document
      .querySelector('#' + indentifier)
      .closest('.table-responsive')
    const tableContainerParent = tableContainer.parentElement
    const tableBtn = document.createElement('button')
    tableBtn.setAttribute('class', 'table-btn-expand btn btn-info')
    tableBtn.innerHTML = '<span class="mdi mdi-arrow-expand"></span>'
    tableBtn.id = indentifier + '_btn'
    tableContainer.append(tableBtn)
    let openState = false
    function openModal() {
      modal.classList.add('active')
      tableContainer.remove()
      modal.appendChild(tableContainer)
      tableContainer.classList.replace('table-responsive', 'table-container')
      tableBtn
        .querySelector('span')
        .classList.replace('mdi-arrow-expand', 'mdi-arrow-compress')
      tableContainer.querySelector('.dataTables_scrollBody').style.maxHeight =
        (window.innerWidth - 160).toString() + 'px'
    }
    function closeModal() {
      modal.classList.remove('active')
      tableContainer.remove()
      tableContainerParent.appendChild(tableContainer)
      tableContainer.classList.replace('table-container', 'table-responsive')
      tableBtn
        .querySelector('span')
        .classList.replace('mdi-arrow-compress', 'mdi-arrow-expand')
      tableContainer.querySelector('.dataTables_scrollBody').style.maxHeight =
        (window.innerHeight - 425).toString() + 'px'
    }
    $('#' + indentifier + '_btn').click(function(e) {
      if (openState) {
        closeModal()
        openState = false
      } else {
        openModal()
        openState = true
      }
    })

    function setBtnSings() {
      singsState = true
      console.log(`#${indentifier} .dataTables_scrollBody`)
      const tableBody = document.querySelector(`.dataTables_scrollBody`)
      const tableWrapper = tableBody.parentElement.parentElement
      const btnDown = document.createElement('span')
      const btnUP = document.createElement('span')
      btnUP.innerHTML = '<span class="mdi mdi-arrow-up"></span>'
      btnDown.innerHTML = '<span class="mdi mdi-arrow-down"></span>'

      btnUP.setAttribute('class', 'btn btn-info btnTable btnTable--up inactive')
      btnDown.setAttribute(
        'class',
        'btn btn-info btnTable btnTable--down inactive'
      )

      tableWrapper.appendChild(btnDown)
      tableWrapper.appendChild(btnUP)
      if (tableBody.scrollHeight / 2 > tableBody.scrollTop) {
        btnDown.classList.remove('inactive')
        btnUP.classList.add('inactive')
      } else if (tableBody.scrollHeight / 2 < tableBody.scrollTop) {
        btnDown.classList.add('inactive')
        btnUP.classList.remove('inactive')
      }
      tableBody.addEventListener('scroll', () => {
        if (tableBody.scrollHeight / 2.5 > tableBody.scrollTop) {
          btnDown.classList.remove('inactive')
          btnUP.classList.add('inactive')
        } else if (tableBody.scrollHeight / 2.5 < tableBody.scrollTop) {
          btnDown.classList.add('inactive')
          btnUP.classList.remove('inactive')
        }
      })
    }
  }
  tabla('ListaRegBanco')

  $('#NotaCredito').click(function(e) {
    e.preventDefault()
    if (pFormulario.length === 1) {
      $('#' + pFormulario[0].id).remove()
    }
    pFormulario = CargarPanel(
      'Banco Ingresos',
      'bootstrap-primary',
      'formulario.html',
      950,
      600
    )
  })
})
