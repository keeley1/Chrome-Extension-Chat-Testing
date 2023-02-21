//load in sound
var messageSound = new Audio('/messageSound.mp3');
messageSound.load();

var socket = io('http://localhost:3000');

//getting username
userName = prompt("Welcome to VCE! Please enter your name:");
if (!userName) {
    userName = 'User' + Math.round(Math.random() * 10000);
}

chrome.runtime.onStartup.addListener(function() {
    retrieveMessages();
});

socket.on('connect', () => {
    socket.emit('joined', userName);
});

//get messages from the html page
var form = document.getElementById('form');
var input = document.getElementById('input');
var messages = document.getElementById('messages');

form.onsubmit = function(e) {
    e.preventDefault();

    //handle empty messages
    if (input.value.length === 0) {
        var lengthError = document.getElementById('error-messages');

        //error message timer - lasts for 3 seconds
        lengthError.innerHTML = `Oops!! You can't send an empty message!`;
        setTimeout(function() {
            lengthError.innerHTML = '';
        }, 3000); 
    } else {
        socket.emit('message', input.value);
        input.value = '';
        input.focus();
    }
}

//ensure each new message is on a new line
socket.on('message', function(msg, playSound) {
    //messages.innerHTML = msg + '<br/>' + messages.innerHTML;
    if (playSound) {
        messageSound.play();
        console.log('sound played');
    }

    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

//counting number of users
socket.on('userNumber', function(count) {
    var displayUsers = document.getElementById('user-number');
    displayUsers.innerHTML = 'Users in chat: ' + count;
});

//display all users in chat
socket.on('userList', function(users) {
    var allUsers = document.getElementById('users-in-chat');
    allUsers.innerHTML = 'Users: ' + users.join(', ');
});


