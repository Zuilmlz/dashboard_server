/*
    -- Author:	Luis Melendez
    -- Create date: 04/09/2024
    -- Update date: 
    -- Description:	
    -- Update:      
                    
*/

require('dotenv').config();

console.log('ENTRO AL CONFIG')

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
    connectionTimeout: 120000, // Timeout de conexión en milisegundos (30 segundos)
    requestTimeout: 120000, // Timeout de solicitudes en milisegundos (30 segundos)
    port: 1433
  },
};

console.log(config)

module.exports = config;