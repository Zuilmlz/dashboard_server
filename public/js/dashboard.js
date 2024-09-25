/*
    -- Author:	Luis Melendez
    -- Create date: 12/08/2024
    -- Update date: 
    -- Description:	
    -- Update:      
                    
*/

//Variables Globales
const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const depto = urlParams.get('depto');
let gridGrupos;
let gridAlumnos;
let gridInscritos;


$(function() {


    const tokenAuth = localStorage.getItem('tokenAuth');  // Obtén el token del almacenamiento

    // const socket = io({
    //     query: {
    //         token: tokenAuth  // Enviar token en la conexión
    //     }
    // });
    

    $(window).on('offline', function() {
      Swal.fire({
          icon: 'warning',
          title: 'Desconexión',
          text: 'Te has desconectado de internet.',
          confirmButtonText: 'Aceptar'
      });
    });

    $(window).on('online', function() {
      let cooldown = 10;

      Swal.fire({
          icon: 'info',
          title: 'Reconectando',
          html: `Red conectada. La página se recargará en <strong>${cooldown}</strong> segundos.`,
          timer: cooldown * 1000,
          timerProgressBar: true,
          confirmButtonText: 'Recargar ahora',
          allowOutsideClick: false,
          didOpen: () => {
              const timerInterval = setInterval(() => {
                  cooldown--;
                  const htmlContainer = Swal.getHtmlContainer();
                  if (htmlContainer) {
                      htmlContainer.querySelector('strong').textContent = cooldown;
                  }

                  if (cooldown <= 0) {
                      clearInterval(timerInterval);
                      Swal.close();
                      location.reload();
                  }
              }, 1000);
          }
      }).then((result) => {
          if (result.isConfirmed) {
              location.reload();
          }
      });
    });

    //Inicializacion de los Grids
    gridAlumnos = typeGrid(1);
    gridInscritos = typeGrid(2);

    $("#tabPanelTables").dxTabPanel({
  items: [
      { title: "Alumnos", template: function (){return gridAlumnos.element();}},
      { title: "Inscritos", template: function (){return gridInscritos.element();}},
      { title: "No inscritos en tiempo", content: "Content for Tab 3" },
      { title: "Bloqueados", content: "Content for Tab 4" },
      { title: "Posibles egresos", content: "Content for Tab 5" }
  ],
  selectedIndex: 0,
  loop: false,
  swipeEnabled: true,
  animationEnabled: true,
  showNavButtons: true,
  focusStateEnabled: false
    });

    gridGrupos = $("#gridGrupos").dxDataGrid({
    dataSource: [],
    height: 450,
    noDataText: "No Existe Información",
    showBorders: true,
    allowColumnResizing: true,
    showColumnLines: true,
    showRowLines: true,
    columnAutoWidth: true,
    rowAlternationEnabled: true,
    scrolling: {
          mode: 'virtual',
          useNative: false,
    },
    columns: [
          {
              dataField: 'Departamento', caption: 'Departamento', alignment: 'center'
          },
          {
              dataField: 'ClaveMateria', caption: 'Clave Materia', alignment: 'center'
          },
          {
              dataField: 'Materia', caption: 'Programa', alignment: 'center',
          },
    ],
    toolbar: {
        items: [
            {
                location: "after",
                widget: "dxButton",
                options: {
                    icon: "filter",
                    text: "",
                    onClick: function () {
                        // TODO: Implementar la funcionalidad de este apartado.
                    },
                    elementAttr: {
                        class: "filtro-materias"
                    }
                }
            },
            {
                location: "before",
                widget: "dxCheckBox",
                options: {
                    text: "Diferencia entre grupos no mayor a",
                    onValueChanged: function (e) {
                        // TODO: Implementar la funcionalidad de este apartado.
                    },
                    elementAttr: {
                        class: "checkbox-diferencia"
                    }
                }
            },
            {
                location: "before",
                widget: "dxTextBox",
                options: {
                    width: 50,
                    inputAttr: {
                        type: "number",
                        min: 0,
                        max: 100,
                        step: 1
                    },
                    onValueChanged: function(e) {
                        // TODO: Implementar la funcionalidad de este apartado.
                    }
                }
            }
        ]
    },    
    }).dxDataGrid("instance");

    if (!depto) {
        Swal.fire({
            icon: 'error',
            title: 'URL',
            text: 'No se proporcionó el departamento.',
            confirmButtonText: 'Aceptar'
        });
    } else {
        socket.emit('depto', depto);

        socket.on('InformacionInicial', (data) => {
            console.log(data)
            // Datos para cada tabla
            // const dataG = data.grupos || [];
            // const dataA = data.alumnos || [];
            // const dataI = data.inscritos || [];
            // const dataT = data.totales || [];
        
            // $('#txtAlumnos').text(dataT[0].TotalAlumno)
            // $('#txtInscritos').text(dataT[0].TotalInscrito)
            // $('#txtInscritosFueraDeTiempo').text(dataT[0].TotalInscritoFueraTiempo)
            // $('#txtBloqueado').text(dataT[0].TotalBloqueado)

            // if (dataG.length > 0) {
            //     // Procesar y ajustar columnas para gridGrupos
            //     const columnasExistentes = gridGrupos.option("columns") || [];
            //     const todasLasColumnasGrupos = new Set();
            
            //     const dataAjustada = dataG.map(registro => {
            //         const grupos = JSON.parse(registro.JsonGrupos || '[]');
                    
            //         const filaAjustada = { 
            //             ...registro 
            //         };
            
            //         grupos.forEach(grupoData => {
            //             const grupoKey = grupoData.grupo;
            //             todasLasColumnasGrupos.add(grupoKey); 
            //             filaAjustada[grupoKey] = HtmlDivFormat(grupoData.cupo,grupoData.horario,grupoData.profesor);
            //         });
            
            //         return filaAjustada;
            //     });
            
            //     const nuevasColumnasGrupos = Array.from(todasLasColumnasGrupos).filter(grupo =>
            //         !columnasExistentes.some(col => col.dataField === grupo)
            //     ).map(grupo => ({
            //         dataField: grupo,
            //         caption: grupo,
            //         cellTemplate: function (container, options) {
            //             $(container).html(options.value);
            //         }
            //     }));
            
            //     if (nuevasColumnasGrupos.length > 0) {
            //         gridGrupos.option("columns", [...columnasExistentes, ...nuevasColumnasGrupos]);
            //     }
            
            //     gridGrupos.option("dataSource", dataAjustada);
            // }
            

            // if(dataA.length > 0){
            //     gridAlumnos.option("dataSource", dataA);
            // }

            // if(dataI.length > 0){
            //     gridInscritos.option("dataSource", dataI);
            // }
        });

        // socket.on('NotificacionRegistroGrupo', (data) => {
        
        // var registro = data.message;

        // if(registro[0].Departamento == depto){
        //     const dataSource = gridGrupos.option("dataSource") || [];
        //     const grupos = JSON.parse(registro[0].JsonGrupos || '[]');  // Asegurarse de que sea un array


        //     const updatedRow = {
        //         ...registro[0]
        //     };

        //     grupos.forEach(grupoData => {
        //         const grupoKey = grupoData.grupo;
        //         updatedRow[grupoKey] = HtmlDivFormat(grupoData.cupo, grupoData.horario, grupoData.profesor);
        //     });

        //     const existingIndex = dataSource.findIndex(item => item.IdReg === registro[0].IdReg);
        //     if (existingIndex !== -1) {
        //         dataSource[existingIndex] = updatedRow;
        //     } else {
        //         dataSource.push(updatedRow);
        //     }

        //     const columnasExistentes = gridGrupos.option("columns") || [];
        //     const todasLasColumnasGrupos = new Set(grupos.map(grupoData => grupoData.grupo));

        //     const nuevasColumnasGrupos = Array.from(todasLasColumnasGrupos).filter(grupo =>
        //         !columnasExistentes.some(col => col.dataField === grupo)
        //     ).map(grupo => ({
        //         dataField: grupo,
        //         caption: grupo,
        //         cellTemplate: function (container, options) {
        //             $(container).html(options.value); 
        //         }
        //     }));

        //     if (nuevasColumnasGrupos.length > 0) {
        //         gridGrupos.option("columns", [...columnasExistentes, ...nuevasColumnasGrupos]);
        //     }

        //     gridGrupos.option("dataSource", dataSource);
        // }

        // });

        // socket.on('NotificacionRegistroAlumno', (data) => {
        // // Datos para cada tabla
        // var registro = data.message

        // if(registro[0].Departamento == depto){
        //     try {
        //         const dataSource = gridAlumnos.option("dataSource") || [];
    
        //         $('#txtAlumnos').text(registro[0].CountTotal)

        //         const updatedRow = {
        //             Cuenta: registro[0].Cuenta,
        //             Nombre: registro[0].Nombre,
        //             Carrera: registro[0].Carrera,
        //             Creditos: registro[0].Creditos,
        //             CreditosInscritos: registro[0].CreditosInscritos,
        //             Horario: registro[0].Horario,
        //             MateriasInscritas: registro[0].MateriasInscritas,
        //             EnTiempo: registro[0].EnTiempo,
        //             Bloqueos: registro[0].Bloqueos,
        //             Correo: registro[0].Correo,
        //         };
    
        //         const existingIndex = dataSource.findIndex(item => item.IdReg === registro[0].IdReg);
        //         if (existingIndex !== -1) {
        //             dataSource[existingIndex] = updatedRow;
        //         } else {
        //             dataSource.push(updatedRow);
        //         }
    
        //         gridAlumnos.option('dataSource', dataSource);
        //     } catch (error) {
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'Socket',
        //             text: `Error al procesar la informacion del socket alumnos: ${error.message}`,
        //             confirmButtonText: 'Aceptar'
        //         });
        //     }
        // }


        // });

        // socket.on('NotificacionRegistroInscrito', (data) => {
        // // Datos para cada tabla
        // var registro = data.message

        // if(registro[0].Departamento == depto){
        //     try {
        //         const dataSource = gridInscritos.option("dataSource") || [];
    
        //         $('#txtInscritos').text(registro[0].CountTotal)
    
        //         const updatedRow = {
        //             Cuenta: registro[0].Cuenta,
        //             Nombre: registro[0].Nombre,
        //             Carrera: registro[0].Carrera,
        //             Creditos: registro[0].Creditos,
        //             CreditosInscritos: registro[0].CreditosInscritos,
        //             Horario: registro[0].Horario,
        //             MateriasInscritas: registro[0].MateriasInscritas,
        //             EnTiempo: registro[0].EnTiempo,
        //             Bloqueos: registro[0].Bloqueos,
        //             Correo: registro[0].Correo,
        //         };
    
        //         const existingIndex = dataSource.findIndex(item => item.IdReg === registro[0].IdReg);
        //         if (existingIndex !== -1) {
        //             dataSource[existingIndex] = updatedRow;
        //         } else {
        //             dataSource.push(updatedRow);
        //         }
    
        //         gridInscritos.option('dataSource', dataSource);
        //     } catch (error) {
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'Socket',
        //             text: `Error al procesar la informacion del socket inscritos: ${error.message}`,
        //             confirmButtonText: 'Aceptar'
        //         });
        //     }
        // }
        
        // });


    }
  
});

/**
 * Configura el DatGrid según el tipo de grid especificado.
 * @param {number} gridType - Tipo de grid que determina las columnas a mostrar.
 * @returns {Object} - Instancia del DataGrid configurada.
 */
function typeGrid(gridType) {

    var columnas = []

    if(gridType == 1 || gridType == 2){
        columnas = [
            { dataField: 'Cuenta', caption: 'Cuenta', alignment: 'center' },
            { dataField: 'Nombre', caption: 'Nombre' },
            { dataField: 'Carrera', caption: 'Carrera' },
            { dataField: 'Creditos', caption: 'Creditos', alignment: 'center' },
            { dataField: 'CreditosInscritos', caption: 'Creditos inscritos', alignment: 'center' },
            { dataField: 'Horario', caption: 'Horario de inscripción', alignment: 'center' },
            { dataField: 'MateriasInscritas', caption: 'Materias inscritas', alignment: 'center' },
            { dataField: 'EnTiempo', caption: 'En tiempo', alignment: 'center' },
            { dataField: 'Bloqueos', caption: 'Bloqueos', alignment: 'center' },
            { dataField: 'Correo', caption: 'Datos de contacto' }
        ]
    }

    return $("<div>").dxDataGrid({
        dataSource: [],
        height: 450,
        noDataText: "No Existe Información",
        showBorders: true,
        allowColumnResizing: true,
        showColumnLines: true,
        showRowLines: true,
        columnAutoWidth: true,
        rowAlternationEnabled: true,
        scrolling: {
            mode: 'virtual',
            useNative: false
        },
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: 'Buscar...'
        },
        columns: columnas
    }).dxDataGrid("instance");

}

function HtmlDivFormat(cupo,horario,profesor){
    var div = `
    <div class="col-md-12" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; height: 100%;">
        <div class="col-sm-12">
            <span style="font-weight: bold">${cupo}</span>       
        </div>
        <div class="col-sm-12">
            <span style="font-weight: bold; color: #1F618D">${horario}</span>
        </div>
        <div class="col-sm-12">
            <span style="font-weight: bold; color: #c8041a">${profesor}</span>
        </div>
    </div>`

    return div
}