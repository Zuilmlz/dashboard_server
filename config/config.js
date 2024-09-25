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
    encrypt: false,
    trustServerCertificate: true,
  },
};

module.exports = config;
