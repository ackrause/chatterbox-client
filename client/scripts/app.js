/* jshint quotmark:false */
/* global $ */

var app = {};

app.init = function(){

  app.rooms = {};
  app.friends = {};
  app._currentRoom = "lobby";
  app.addRoom("lobby");

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

app.sanitize = function(mallory, replaceSpaces) {
  var cleaned = String(mallory).replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  if (replaceSpaces) {
    cleaned = cleaned.replace(/[\s%"'&;]/g,'');
  }
  return cleaned;
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
  var $userName = $("<span></span>").addClass('username')
                                    //.data('username', app.sanitize(message.username, true))
                                    .addClass(app.sanitize(message.username,true))
                                    .text(message.username);
  var $msg = $('<li></li>').text(': ' + message.text)
                           .addClass('message')
                           .addClass(app.sanitize(room,true))
                           .prepend($userName);
  if(app.sanitize(room, true) !== app._currentRoom){
    $msg.hide();
  }
  if(app.friends[app.sanitize(message.username,true)]){
    $userName.addClass('friend');
  }
  $userName.on('click', function() {
    var username = app.sanitize($(this).text(), true);
    if (username in app.friends) {
      delete app.friends[username];
      $('.username.' + username).removeClass('friend');
    } else {
      app.friends[username] = true;
      $('.username.' + username).addClass('friend');
    }
  });
  $('#chats').prepend($msg);
};

app.addRoom = function(roomName){
  var key = app.sanitize(roomName, true);
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
