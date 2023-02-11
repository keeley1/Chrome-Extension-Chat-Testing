//import express and create express server
const express = require('express');
const app = express();
const server = require('http').createServer(app);

//direct express where to pick up the files
app.use(express.static(__dirname));

const io = require('socket.io')(server);

//basic socket.io commands printing to the console
io.on('connection', (socket) => {
    console.log('new client connected!');
    var userName;
    socket.on('joined', (who) => {
        userName = who;
        console.log(`${userName} joined`);
        io.emit('message', `System: ${who} joined the chat`);
    });
    socket.on('message', (msg) => {
        console.log(`Received message from ${userName}`);
        //emit the message to users in the room + the username
        io.emit('message', `${userName}: ${msg}`)
    })
});

server.listen(3000);