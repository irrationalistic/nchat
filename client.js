var socketio = require('socket.io-client');
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

  return {
    io: io
  };
};