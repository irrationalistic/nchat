var socketio = require('socket.io');
var _ = require('underscore');

module.exports = function(serverData, port, display){
  var io = socketio.listen(port);

  var connectedUsers = {};
  
  io.sockets.on('connection', function(socket){
    var user = {};
    connectedUsers[socket.id] = user;

    socket.on('ready', function(data){
      _.extend(user, data);
      io.emit('message', {
        message: user.name + ' has connected',
        name: serverData.name,
        color: serverData.color
      });
    });

    socket.on('message', function(data){
      socket.broadcast.emit('message', {
        message: data.message,
        name: user.name,
        color: user.color
      });
    });

    socket.on('update', function(data){
      var dataKeys = _.keys(data);
      _.chain(data)
        .pairs()
        .forEach(function(pair, i){
          var op = user[pair[0]];
          if(pair[1] !== op){
            var msg = user.name + ' changed their '+pair[0]+' to ' + pair[1];
            io.emit('message', {
              message: msg,
              name: serverData.name,
              color: serverData.color
            });
            user[pair[0]] = pair[1];
          }
        });
    });

    socket.on('getUsers', function(){
      socket.emit('users', _.values(connectedUsers));
    });

    socket.on('disconnect', function(){
      delete connectedUsers[socket.id];
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