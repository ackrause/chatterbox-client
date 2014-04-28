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
    $('button.submit').on('mouseenter', function() {
      $(this).text('Don\'t touch me');
      alert('Don\'t even think about it.');
    });
    $('button.submit').on('mouseleave',function(){
      $(this).text('Submit');
    });
    $('.input').on('keypress',function(e){
      if(e.which === 13){
        $('.submit').trigger('click');
      }
    });
    app.fetch();
    // setInterval(function(){
    //   app.clearMessages();
    //   app.fetch();
    // },1000);
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

app.escapeHTML = function(s) {
  return String(s).replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

app.fetch = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox?order=createdAt',
    type: 'GET',
    success: function (data) {
      for(var i = 0; i < data.results.length; i++){
        app.addMessage(data.results[i]);
      }
      console.dir(data);
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
  var msg = '<p>' + message.username + ': ' + app.escapeHTML(message.text) + '</p>';
  $('#chats').append(msg);
};

app.addRoom = function(roomName){
  app.rooms[roomName] = true;
  var room = '<p>' + roomName + '</p>';
  $('#roomSelect').append(room);
};

app.init();
