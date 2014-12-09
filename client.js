var socketio = require('socket.io-client');
var notifier = require('node-notifier');

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
    if(data.name === 'server'){
      notifier.notify({
        title: 'Message',
        message: data.message
      });
    } else {
      notifier.notify({
        title: 'Message',
        message: 'Message from ' + data.name
      });
    }
    
  });

  return {
    io: io
  };
};