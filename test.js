var externalip = require('externalip');
var color = require('just.randomcolor');
var server, io;
var app = require('commander');

process.env.DEBUG = true;

app
  .version('0.0.1')
  .option('-s, --server', 'Run as server')
  .option('-p, --port [port]', 'Which port to use?', 3333)
  .option('-a, --address [address]', 'Which address to use?', 'http://127.0.0.1:3333')
  .option('-u, --user [name]', 'Which name to use?', 'Server')
  .parse(process.argv);

if(app.server){
  externalip(function(err, ip) {
    ip = ip.trim();
    // start a socket server
    console.log(err, ip);
    // server = require('http').createServer().listen(app.port, ip);
    io = require('socket.io').listen(app.port)//.set('log level', 3);
    io.sockets.on('connection', function(socket){
      console.log('connection');
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