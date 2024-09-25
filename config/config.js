/*
    -- Author:	Luis Melendez
    -- Create date: 04/09/2024
    -- Update date: 
    -- Description:	
    -- Update:      
                    
*/

require('dotenv').config();

console.log(process.env.DB_SERVER)
console.log(process.env.DB_DOMAIN)

const config = {
  
  server: process.env.DB_SERVER,
  authentication: {
    type: "ntlm",
    options: {
      domain: process.env.DB_DOMAIN,
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  },
  options: {
    database: process.env.DB_NAME,
    encrypt: true,
    trustServerCertificate: true,
    connectionTimeout: 60000, // Aumenta el timeout a 60 segundos
    requestTimeout: 60000, // 60 segundos para la consulta
  },
};

module.exports = config;

// const sql = require('mssql');

// const config = {
//   server: '192.168.14.38',
//   port: 1433,
//   authentication: {
//     type: "ntlm",
//     options: {
//       domain: 'ti.leon.uia.mx',
//       userName: 'lmelendez',
//       password: 'D3s4rr0ll02024!',
//     },
//   },
//   options: {
//     database: 'dashboard',
//     encrypt: true,
//     trustServerCertificate: true,
//     connectionTimeout: 60000, // Timeout de conexión
//     requestTimeout: 60000, // Timeout para las solicitudes
//   },
// };

// async function testConnection() {
//   try {
//     let pool = await sql.connect(config);
//     console.log('Conexión exitosa a SQL Server');
//     await pool.close();
//   } catch (err) {
//     console.error('Error al conectar a SQL Server:', err);
//   }
// }

// module.exports = {
//   testConnection
// };


