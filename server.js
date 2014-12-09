var externalip = require('externalip');
var socketio = require('socket.io');

module.exports = function(serverData, port, display){
  var io = socketio.listen(port);

  io.sockets.on('connection', function(socket){
    var user = {};

    socket.on('ready', function(data){
      user = data;
      if(display) display.addMessage(user.name + ' has connected', serverData.name, serverData.color);
      io.emit('message', {
        message: user.name + ' has connected',
        name: serverData.name,
        color: serverData.color
      });
    });

    socket.on('message', function(data){
      if(display) display.addMessage(data.message, user.name, user.color);
      io.emit('message', {
        message: data.message,
        name: user.name,
        color: user.color
      });
    });

    socket.on('disconnect', function(){
      if(display) display.addMessage(user.name + ' has disconnected', serverData.name, serverData.color);
      io.emit('message', {
        message: user.name + ' has disconnected',
        name: serverData.name,
        color: serverData.color
      });
    });

  });

  return {
    io: io
  };
};