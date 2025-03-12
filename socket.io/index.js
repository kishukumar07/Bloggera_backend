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


const group2NS =io.of('/group2')//simlarly for 2nd group (group2NameSpace)

group1NS.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log("User disconnected");
    })  //if we refresh the client ui its get disconnected and then get connected again....

    socket.send("Welcome to my world!");
    // socket.emit("newEvent", "This is a new Event "); //this is how we can create custom events as well ....
   socket.emit("group1Event","You are in group1") //sending group one event 
});

group2NS.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log("User disconnected");
    })  //if we refresh the client ui its get disconnected and then get connected again....

    socket.send("Welcome to my world!");
    // socket.emit("newEvent", "This is a new Event "); //this is how we can create custom events as well ....

    socket.emit("group2Event", "You are in group2") //sending group2  event 
});



httpServer.listen(3000, () => {
    console.log('Server started');
});

