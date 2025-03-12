// for removing two diff end points problem with that  NameSpace ..... 
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


//creating three different rooms...
const rooms =['Room 1','Room 2','Room 3'];  


io.on('connection', (socket) => {
    console.log('User connected');

const room =rooms[Math.floor( Math.random() * 3)] //random index of arr 0 to 2
socket.join(room) 

    socket.on('disconnect', () => {
        console.log("User disconnected");
    })  //if we refresh the client ui its get disconnected and then get connected again....

    // socket.send(`You are in ${room}`);  
    // socket.send(`You are in ${room}`);  
   
});


httpServer.listen(3000, () => {
    console.log('Server started');
});

