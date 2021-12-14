const express = require("express");
const pach = require("path");
require("dotenv").config();

// DB Config
require('./database/config').dbConnection();

// App de Express
const app = express();

// Lectura y parseo del Body
app.use( express.json() );

// Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require("./sockets/socket");



// Pach Público
const publicPach = pach.resolve( __dirname, "public");
app.use( express.static( publicPach ));

// Mis Rutas
app.use( '/api/login', require('./routes/auth') );



server.listen( process.env.PORT, (err) => {

    if (err) throw new Error(err);

    console.log("Servidor corriendo en puerto", process.env.PORT );
});
