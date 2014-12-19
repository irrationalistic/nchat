var socketio = require('socket.io-client');
var url = require('url');
var _ = require('underscore');
var notifier = require('node-notifier');
var detectActive = require('detect-active-title');

var httpAgent = require('http-proxy-agent');
var httpsAgent = require('https-proxy-agent');

module.exports = function(myData, address, proxy, display){
  var io, agent;
  if(proxy){
    var parsed = url.parse(address);
    var opts = url.parse(proxy);
    opts.secureEndpoint = true;

    if(parsed.protocol === 'https:')
      agent = new httpsAgent(opts);
    else
      agent = new httpAgent(opts);
    io = socketio.connect(address, {
      agent: agent
    });
  } else {
    io = socketio.connect(address);
  }

  // var io = {on: function(){}};
  // var io = socketio.connect('http://localhost:8081');
  
  io.on('connect', function(){
    io.emit('ready', myData);
  });

  io.on('connect_error', function(data){
    display.addMessage(data, 'error', 'f00');
  });

  io.on('message', function(data){
    display.addMessage(data.message, data.name, data.color);

    detectActive.matchTitle('(node(.*)nchat)|(nchat(.*)node)', function(err, isMatch){
      if(err) return;
      
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