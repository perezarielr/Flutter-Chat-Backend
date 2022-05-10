const { io } = require("../index");
const { comprobarJWT } = require("../helpers/jwt");
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require("../controllers/socket");

// Mensajes de Sockets
io.on('connection', client => {
    const [ valido, uid ] = comprobarJWT( client.handshake.headers['x-token'] )
    
    // Verificar autenticacion
    if ( !valido ) { return client.disconnect(); }
    
    // Cliente autenticado
    usuarioConectado( uid );

    // Ingresar al usuario a una sala en particular
    // Sala global, client.id, 61af80f716b850774f68894a
    client.join( uid );

    // Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal',async (payload) => {

        await grabarMensaje( payload );
        io.to ( payload.para ).emit('mensaje-personal', payload);
    });

    client.on('disconnect', () => {
        usuarioDesconectado( uid );
    });

    // client.on("mensaje", (payload) => {
    //     console.log("Mensaje", payload);
    //     io.emit("mensaje", { admin: "Nuevo mensaje" });
    // });
});