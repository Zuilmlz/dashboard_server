/*
    -- Author:	Luis Melendez
    -- Create date: 12/08/2024
    -- Update date: 
    -- Description:	
    -- Update:      
                    
*/


require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const setupSocket = require('./controllers/socketController');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views', 'Dashboard.html'));
});

app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/libs', express.static(path.join(__dirname, 'public/libs')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Pasar la instancia de `io` al controlador de socket
setupSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});