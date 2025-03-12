// const express = require('express'); 
// const app = express()
// const http =require('http').Server(app) 
// const io = require('socket.io')(app);

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log("User disconnected");
    })  //if we refresh the client ui its get disconnected and then get connected again....

    socket.send("Welcome to my world!");
    socket.emit("newEvent", "This is a new Event "); //this is how we can create custom events as well ....



});

httpServer.listen(3000, () => {
    console.log('Server started');
});

