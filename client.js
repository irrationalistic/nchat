var socketio = require('socket.io-client');
var _ = require('underscore');

module.exports = function(myData, address, display){
  var io = socketio.connect(address);

  io.on('connect', function(){
    io.emit('ready', myData);
  });

  io.on('connect_error', function(data){
    display.addMessage(data, 'error', 'f00');
  });

  io.on('message', function(data){
    display.addMessage(data.message, data.name, data.color);   
  });

  io.on('users', function(users){
    display.addMessage('Connected Users:\n' + _.pluck(users, 'name').join('\n'), 'users', myData.color);
  });

  return {
    io: io
  };
};