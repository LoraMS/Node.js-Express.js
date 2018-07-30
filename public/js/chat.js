// Make connection
var socket = io.connect('http://ec2-13-59-95-197.us-east-2.compute.amazonaws.com');

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('currentUser'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events

function sendMessage(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.innerHTML,
    });
    message.value = "";
}
function enterHandler(e) {
    if (e.keyCode == 13){
        sendMessage();
    }
}

btn.addEventListener('click', sendMessage);

message.addEventListener("keydown", enterHandler);

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.innerHTML);
});

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});