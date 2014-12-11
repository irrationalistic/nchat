var socketio = require('socket.io-client');
var _ = require('underscore');
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

    var timeMet = false;
    setTimeout(function(){
      if(!timeMet){
        notifier.notify({
          title: 'Message',
          message: 'Message from ' + data.name
        });
      }
    }, 500);
    var res = require('child_process').exec('osascript utilities/osx-active-app.scpt');
    display.addMessage(res, 't', 'f00');
    res.stdout.on('data', function (d) {
      var rex = new RegExp('nchat(\\s+)(-[s|u|f|p])');
      if(rex.test(d)){
        timeMet = true;
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