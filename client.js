var socketio = require('socket.io-client');
var _ = require('underscore');
var notifier = require('node-notifier');
var detectActive = require('detect-active-title');

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

    detectActive.matchTitle('nchat(\\s+)(-[s|u|f|p])', function(err, isMatch){
      if(!isMatch){
        if(data.name === 'server'){
          notifier.notify({
            title: 'Server',
            message: data.message
          });
        } else {
          notifier.notify({
            title: 'Message',
            message: 'Message from ' + data.name
          });
        }
      }
    });
    
  });

  io.on('users', function(users){
    display.addMessage('Connected Users:\n' + _.pluck(users, 'name').join('\n'), 'users', myData.color);
  });

  return {
    io: io
  };
};