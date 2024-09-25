/*
    -- Author:	Luis Melendez
    -- Create date: 22/08/2024
    -- Update date: 
    -- Description:	
    -- Update:      
                    
*/


const sqlService = require('../services/sqlService');
const EventEmitter = require('events');
const notificationEmitter = new EventEmitter();

const deptoSockets = {};
const ultimoDeptoId = {};
const ultimoAlumnoId = {};
const ultimoInscritoId = {};

function configSocket(io) {

  io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        socket.on('depto', async (depto) => {
            console.log('Departamento recibido:', depto);
            deptoSockets[socket.id] = depto;

            try {
                const result = await sqlService.executeStoredProcedure('dbo.usp_dashboard_datosIniciales_GetByDepto', { sp_depto: depto });

                if (result && result[0]) {
                    const jsonData = result[0];
                    const grupos = jsonData.Grupos ? JSON.parse(jsonData.Grupos) : [];
                    const alumnos = jsonData.Alumnos ? JSON.parse(jsonData.Alumnos) : [];
                    const inscritos = jsonData.Inscritos ? JSON.parse(jsonData.Inscritos) : [];
                    const totales = jsonData.Totales ? JSON.parse(jsonData.Totales) : [];

                    socket.emit('InformacionInicial', {
                        grupos,
                        alumnos,
                        inscritos,
                        totales
                    });
                }
            } catch (err) {
                console.error('Error al cargar los datos iniciales:', err);
            }

            ultimoDeptoId[depto] = 0;
            ultimoAlumnoId[depto] = 0;
            ultimoInscritoId[depto] = 0;
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
            delete deptoSockets[socket.id];
        });
  });


  /**
   * Escucha mensajes de una cola de servicio y emite eventos personalizados cuando se reciben mensajes.
   * @param {string} queueName - Nombre de la cola de la cual se recibirán los mensajes.
   * @param {string} eventName - Nombre del evento personalizado que se emitirá con el contenido del mensaje.
   * @returns {void}
  */
  async function listenForMessages(queueName, eventName) {
    try {
      const messages = await sqlService.receiveMessages(queueName);

      if (messages.length > 0) {
        messages.forEach((msg) => {
          // Emitir un evento personalizado según la cola
          notificationEmitter.emit(eventName, msg.message_body);
        });
      }

      // Seguir escuchando mensajes
      setImmediate(() => listenForMessages(queueName, eventName));
    } catch (err) {
      console.error(`Error al recibir mensajes de la cola ${queueName}:`, err);
      setImmediate(() => listenForMessages(queueName, eventName));
    }
  }

  // Escuchar eventos y emitirlos a través de los socketS.
  notificationEmitter.on('nuevoRegistroGrupo', (message) => {
    io.emit('NotificacionRegistroGrupo', { message });
  });

  notificationEmitter.on('nuevoRegistroAlumno', (message) => {
    io.emit('NotificacionRegistroAlumno', { message });
  });

  notificationEmitter.on('nuevoRegistroInscrito', (message) => {
    io.emit('NotificacionRegistroInscrito', { message });
  });

  // Escuchar mensajes de diferentes colas
  listenForMessages('InsertGrupoQueue', 'nuevoRegistroGrupo');
  listenForMessages('InsertAlumnoQueue', 'nuevoRegistroAlumno');
  listenForMessages('InsertInscritoQueue', 'nuevoRegistroInscrito');

}

module.exports = configSocket;