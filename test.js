var externalip = require('externalip');
var color = require('just.randomcolor');
var server, io;
var app = require('commander');

var serverColor = 333;

process.env.DEBUG = true;

app
  .version('0.0.1')
  .option('-s, --server', 'Run as server')
  .option('-p, --port [port]', 'Which port to use?', process.env.PORT || 3333)
  .option('-a, --address [address]', 'Which address to use?', 'http://127.0.0.1:3333')
  .option('-u, --user [name]', 'Which name to use?', 'Server')
  .parse(process.argv);

if(app.server){
  externalip(function(err, ip) {
      ip = ip.trim();
      // start a socket server
      myColor = new color().toHex().value;
      myUsername = app.user;
      // addMessage('Server listening on ' + ip + ':' + app.port, 'server', serverColor);
      // server = require('http').createServer().listen(app.port, '71.56.216.152');
      io = require('socket.io').listen(app.port);//.set('log level', 0);
      io.sockets.on('connection', function(socket){
        // io.emit('message', 'Client connected');
        // addMessage('Connection attempt....');
        var c = new color().toHex().value;
        socket.emit('setup', {color: c});

        var username = '';

        socket.on('ready', function(data){
          username = data.name;
          io.emit('message', {user: 'server', message: username + ' has connected', color: serverColor});
          // addMessage(username + ' has connected', 'server', serverColor);
        });

        socket.on('message', function(data){
          // addMessage(data.message, data.user, data.color);
          io.emit('message', data);
        });

        socket.on('disconnect', function() {
          io.emit('message', {user: 'server', message: username + ' has disconnected', color: serverColor});
          // addMessage(username + ' has disconnected', 'server', serverColor);
        });
      });
    });
} else {
  io = require('socket.io-client').connect(app.address);
  // addMessage('Connecting to ' + app.address);
  io.on('connect', function(){
    // addMessage('Connected!');
    // io.emit('message', 'Connected');
  });
  io.on('connect_error', function(d){
    console.log(d);
  });
}