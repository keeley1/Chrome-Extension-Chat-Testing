//import express and create express server
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//direct express where to pick up the files
app.use(express.static(__dirname));

//initialise mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'VCE'
});

let playSound = true;

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL database!');
  });

  function retrieveMessages(callback) {
    const retrieveMessagesSql = `SELECT * FROM messages`;
    connection.query(retrieveMessagesSql, (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }
  module.exports = {
    retrieveMessages
    };

//user counting 
let userNumber = 0;
let users = new Array();

//basic socket.io commands printing to the console
io.on('connection', (socket) => {
    console.log('new client connected!');
    //count number of users
    userNumber++;
    io.emit('userNumber', userNumber);

    retrieveMessages((err, messages) => {
        if (err) throw err;
        messages.forEach((message) => {
            socket.emit('message', `${message.username}: ${message.message}`, playSound = false);
        });
    });

    //welcome user after 3 seconds
    setTimeout(function(){
        socket.emit('message', 'Welcome to VCE!');
    }, 3000);

    var userName;
    socket.on('joined', (who) => {
        userName = who;
        users.push(userName);
        io.emit('userList', users);
        console.log(users);

        console.log(`${userName} joined`);
        //emit when user joins the chat
        socket.broadcast.emit('message', `${who} joined the chat`, playSound = true);
    });
    socket.on('message', (msg, playSound) => {
        console.log(`Received message from ${userName}`);    

        const insertMessageSql = `INSERT INTO messages (username, message) VALUES (?, ?)`;
        const values = [userName, msg];
        
        connection.query(insertMessageSql, values, (err, result) => {
            if (err) throw err;
            console.log(`Successfully inserted message into the database`);
         });

        //emit the message to users in the room + the username
        io.emit('message', `${userName}: ${msg}`, playSound = true)
    });
    socket.on('disconnect', () => {
        let index = users.indexOf(userName);
        if (index > -1) {
            users.splice(index, 1);
        }
        console.log(users);
        io.emit('userList', users);

        io.emit('message', `${userName} has left the chat`, playSound = true);
        userNumber--;
        io.emit('userNumber', userNumber);
    });
});

server.listen(3000);