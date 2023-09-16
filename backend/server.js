const http = require('http');
const app = require('./app.js');

function normalPort (val) {
    const port = parseInt(val, 10); //on transforme la variable en int
    if (isNaN(port)) {
        return val; //si ce n'est pas un nombre on retourne la valeur string val
    } else if (port > 0) {
        return port; //sinon le port si positif
    } else {
        return false;
    }
}

const port = normalPort(process.env.Port || 3000);
app.set('port', port);

function handleError (error) {
    //si l'erreur n'est pas lié à l'écoute d'un port / pipe alors on relance l'erreur
    if (error.syscall !== "listen") { 
        throw error;
    }
    //Envoi du message d'erreur
    const adress = server.address();
    const bind = typeof adress == "string" ? "pipe" + adress : "port" + port;
    switch (error.code) {
        case "EACCES" :
            console.error(bind + "necessite des droits d'accès plus élevés");
            process.exit(1);
            break;
        case "EADDRINUSE" :
            console.error(bind + "est déjà en cours d'utilisation");
            process.exit(1);
            break;
        default :
            throw error;
    }
}


const server = http.createServer(app)
server.on('error', handleError);
server.on('listening', () => {
    const adress = server.address();
    const bind = typeof adress == "string" ? "pipe" + adress : "port" + port;
    console.log("en train d'écouter sur " + bind);
})
server.listen(port);