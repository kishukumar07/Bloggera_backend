//server side code....
const websocket = require('ws');

const wsServer = new websocket.WebSocketServer({ port: 9000 }) //created a websocket server..

wsServer.on('connection', (socket) => {
    console.log(socket)//the details of client 
})