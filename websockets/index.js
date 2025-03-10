//server side code....
import { WebSocketServer } from 'ws';


const wsServer = new WebSocketServer({ port: 9000 }) //created a websocket server..

wsServer.on('connection', (socket) => {
    console.log(socket)//the details of client 
})