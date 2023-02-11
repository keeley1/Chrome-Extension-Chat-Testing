//create a random username for now
var userName = 'User' + Math.round(Math.random() * 10000);

var socket = io('http://localhost:3000');
socket.on('connect', () => {
    socket.emit('joined', userName);
});

//get messages from the html page
var form = document.getElementById('form');
var input = document.getElementById('input');
var messages = document.getElementById('messages');

form.onsubmit = function(e) {
    e.preventDefault();
    socket.emit('message', input.value);
    input.value = '';
    input.focus();
}

//ensure each new message is on a new line
socket.on('message', function(msg) {
    messages.innerHTML = msg + '<br/>' + messages.innerHTML;
});
