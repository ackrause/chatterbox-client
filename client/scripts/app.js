/* jshint quotmark:false */
/* global $ */

var app = {};

app.init = function(){

  app.rooms = {"lobby":true};

  app._currentRoom = "lobby";

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


  app._username = window.location.search.slice(window.location.search.indexOf('=')+1);

  app.fetch();
  setInterval(function(){
    app.fetch();
  },1000);
};

app.send = function(messageText){
  var message = {};
  message.username = app._username;
  message.text = messageText;
  message.roomname = app._currentRoom;
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
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
    type: 'GET',
    success: function (data) {
      var i;
      for(i = 0; i < data.results.length; i++){
        if(data.results[i].objectId === app.lastMessage){
          break;
        }
      }
      for(i = i - 1; i >= 0; i--){
        app.addMessage(data.results[i]);
      }
      app.lastMessage = data.results[0].objectId;
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
  var room = message.roomname;
  app.addRoom(room);
  var msg = '<li class = "message ' + app.escapeHTML(room).replace(/[\s%]/g,'') + '">' + app.escapeHTML(message.username) + ': ' + app.escapeHTML(message.text) + '</li>';
  var $msg = $(msg);
  if(app.escapeHTML(room).replace(/[\s%]/g,'') !== app._currentRoom){
    $msg.hide();
  }
  $('#chats').prepend($msg);
};

app.addRoom = function(roomName){
  var key = app.escapeHTML(roomName).replace(/[\s%]/g,'');
  if(!(key in app.rooms)){
    app.rooms[key] = roomName;
    var room = '<p><a href="#'+ key +'">' + roomName + '</a></p>';
    var $room = $(room);
    $room.on('click',function(e){
      e.preventDefault();
      app._currentRoom = key;
      $('.message.' + key).show();
      $('.message').not('.' + key).hide();
    });
    $('#roomSelect').append($room);
  }
};

$(document).ready(function(){
  app.init();
});
