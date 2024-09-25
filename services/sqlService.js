/*
    -- Author:	Luis Melendez
    -- Create date: 22/08/2024
    -- Update date: 
    -- Description:	
    -- Update:      
                    
*/


const sql = require('mssql');
const config = require('../config/config');


async function testConnection() {
    let pool;
    try {
      pool = await sql.connect(config);
      console.log('Conexión exitosa a SQL Server');
      return 'Conexión exitosa a SQL Server';  // Aquí retornas la cadena de texto
    } catch (err) {
      console.error('Error al conectar a SQL Server:', err);
      return `Error al conectar a SQL Server: ${err.message}`;  // Aquí retornas el mensaje de error
    } finally {
      if (pool) await pool.close();  // Asegúrate de cerrar la conexión si se ha creado
    }
}

// /**
//  * Ejecuta un procedimiento almacenado en SQL Server con los parámetros de entrada proporcionados.
//  * @param {string} procedureName - Nombre del procedimiento almacenado a ejecutar.
//  * @param {Object} [inputParameters] - Objeto con los parámetros de entrada para el procedimiento almacenado.
//  * @returns {Promise<Array>} - Devuelve una promesa que resuelve a un arreglo con los registros del resultado del procedimiento.
//  * @throws {Error} - Lanza un error si ocurre algún problema durante la ejecución del procedimiento almacenado.
//  */
// async function executeStoredProcedure(procedureName, inputParameters) {
//   try {
//     let pool = await sql.connect(config);
//     let request = pool.request();

//     // Agregar parámetros al request
//     if (inputParameters) {
//       for (const [paramName, paramValue] of Object.entries(inputParameters)) {
//         request.input(paramName, sql.NVarChar, paramValue); // Asegúrate de ajustar el tipo de dato si es necesario
//       }
//     }

//     let result = await request.execute(procedureName);

//     console.log(`Procedimiento ${procedureName} ejecutado correctamente`);
//     return result.recordset;
//   } catch (err) {
//     console.error('Error al ejecutar el procedimiento almacenado:', err);
//     throw err;
//   } finally {
    
//   }
// }

// /**
//  * Recibe mensajes de una cola de servicio en SQL Server.
//  * @param {string} queueName - Nombre de la cola desde la cual se recibirán los mensajes.
//  * @returns {Promise<Array>} - Devuelve una promesa que resuelve a un arreglo de mensajes recibidos.
//  * @throws {Error} - Lanza un error si ocurre algún problema durante la recepción de mensajes.
//  */
// async function receiveMessages(queueName) {
//   let pool;
//   try {
//     // Conectar al pool de conexiones
//     pool = await sql.connect(config);
//     let request = pool.request();

//     // Recibir mensajes de la cola específica
//     const result = await request.query(`RECEIVE TOP (1) conversation_handle, message_body FROM ${queueName};`);

//     if (result.recordset.length > 0) {
//       // Procesar los mensajes
//       const messages = result.recordset.map(row => {
//         const messageString = row.message_body.toString('utf-16le');
//         const messageJson = JSON.parse(messageString);
//         return {
//           conversation_handle: row.conversation_handle,
//           message_body: messageJson
//         };
//       });

//       for (const msg of messages) {
//         await request.query(`END CONVERSATION '${msg.conversation_handle}';`);
//       }

//       return messages;
//     }

//     return [];
//   } catch (err) {
//     console.error(`Error al recibir mensajes de ${queueName}:`, err);
//     throw err;
//   } finally {
//     if (pool) {
//       pool.close();
//     }
//   }
// }

module.exports = {
    testConnection
//   executeStoredProcedure,
//   receiveMessages
};
