// YOUR CODE HERE:

var app = {};

app.rooms = {};

app.init = function(){
  $(document).ready(function(){
    app.server = 'https://api.parse.com/1/classes/chatterbox';
    $('button.submit').on('click',function(){
      app.send($('.input').val());
      $('.input').val('');
    });
  });
};

app.send = function(messageText){
  var message = {};
  var name = window.location.search;
  message.username = JSON.stringify(name.slice(name.indexOf('=') + 1));
  message.text = messageText;
  message.roomname = 'Some room.';
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
    },
    error : function (data) {
      console.error('chatterbox: Failed to get message');
    }
  });
};

app.clearMessages = function(){
  $('#chats').html('');
};

app.addMessage = function(message){
  var msg = '<p>' + message.username + ': ' + message.text + '</p>';
  $('#chats').append(msg);
};

app.addRoom = function(roomName){
  app.rooms[roomName] = true;
  var room = '<p>' + roomName + '</p>';
  $('#roomSelect').append(room);
};

app.init();
