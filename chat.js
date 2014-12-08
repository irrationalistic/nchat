var blessed = require('blessed');
var program = blessed.program();
var externalip = require('externalip');
var color = require('just.randomcolor');
var server, io;
var app = require('commander');
var user = 'server';


var myColor = 333;
var serverColor = 333;
var myUsername = 'Server';


// Create a screen object.
var screen = blessed.screen();

// Create a box perfectly centered horizontally and vertically.
var messages = blessed.box({
  top: 0,
  left: 0,
  right: 0,
  bottom: 3,
  content: 'Welcome!',
  // content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nInteger vulputate nulla dictum neque dictum, eget finibus sem auctor.\nSed porta justo nec lectus vulputate tincidunt.\nMauris tempus odio ut egestas facilisis.\nMauris sit amet quam vel arcu varius dapibus et id dolor.\nUt a augue ac ante luctus tempus.\nMaecenas id dui vitae risus posuere pellentesque ut eget felis.\nQuisque vitae nunc a est rutrum interdum.\nDonec et mauris dictum, ultricies ligula vitae, venenatis diam.\nVestibulum ut arcu sed nibh condimentum iaculis a ut sem.\nDonec eu mauris id sem gravida suscipit sit amet a felis.\nFusce nec ex congue, euismod justo et, bibendum ipsum.\nSed laoreet eros ac mi elementum, vitae pretium mauris vestibulum.\nIn iaculis metus ornare, scelerisque massa eget, gravida diam.\nAenean in risus ac leo tristique consectetur.\nInteger lacinia dolor ac est venenatis, eget semper nisl tincidunt.\nNulla non leo bibendum, pellentesque erat in, dignissim risus.\n',
  tags: true,
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
      bg: 'blue',
      fg: 'red'
    },
  style: {
    fg: 'white',

  },

});

var input = blessed.textarea({
  bottom: 0,
  left: 0,
  right: 0,
  height: 3,
  input: true,
  // keys: true,
  inputOnFocus: true,
  mouse: true,
  clickable: true,
  focused: true,
  content: '',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
  }
});




var addMessage = function(msg, sender, color){
  messages.setScrollPerc(100);
  messages.insertBottom("{#" + color + "-fg}{bold}"+sender+":{/} " + msg);
  messages.setScrollPerc(100);

  screen.render();
};

input.key('enter', function(){
  // console.log(arguments);
  io.emit('message', {message: input.content.trim(), user: myUsername, color: myColor});
  input.clearValue();
  // process.exit(0);
});

messages.on('wheelup', function(){
  messages.scroll(-1);
  screen.render();
});
messages.on('wheeldown', function(){
  messages.scroll(1);
  screen.render();
});

// Append our box to the screen.
screen.append(messages);
//screen.append(form);
//form.append(input);
screen.append(input);

screen.focusPush(input);

// If our box is clicked, change the content.
// box.on('click', function(data) {
//   box.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}');
//   screen.render();
// });

// // If box is focused, handle `enter`/`return` and give us some more content.
// box.key('enter', function(ch, key) {
//   box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
//   box.setLine(1, 'bar');
//   box.insertLine(1, 'foo');
//   screen.render();
// });

// Quit on Escape, q, or Control-C.
// args = [['escape', 'q', 'C-c'], function(ch, key) {
//   return process.exit(0);
// }];
// screen.key.apply(null, args);
// input.key.apply(null, args);

program.key('C-c', function(ch, key) {
  program.clear();
  program.disableMouse();
  program.showCursor();
  program.normalBuffer();
  process.exit(0);
});

program.alternateBuffer();
program.enableMouse();
program.clear();
screen.render();



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
    myColor = new color().toHex().value;
    myUsername = app.user;
    addMessage('Server listening on ' + ip + ':' + app.port, 'server', serverColor);
    server = require('http').createServer().listen(app.port, '71.56.216.152');
    io = require('socket.io').listen(server);//.set('log level', 0);
    io.sockets.on('connection', function(socket){
      // io.emit('message', 'Client connected');
      // addMessage('Connection attempt....');
      var c = new color().toHex().value;
      socket.emit('setup', {color: c});

      var username = '';

      socket.on('ready', function(data){
        username = data.name;
        io.emit('message', {user: 'server', message: username + ' has connected', color: serverColor});
        addMessage(username + ' has connected', 'server', serverColor);
      });

      socket.on('message', function(data){
        addMessage(data.message, data.user, data.color);
      });

      socket.on('disconnect', function() {
        io.emit('message', {user: 'server', message: username + ' has disconnected', color: serverColor});
        addMessage(username + ' has disconnected', 'server', serverColor);
      });
    });
  });
} else {
  myUsername = app.user;
  // connect to a server
  io = require('socket.io-client').connect(app.address);
  // addMessage('Connecting to ' + app.address);
  io.on('connect', function(){
    // addMessage('Connected!');
    // io.emit('message', 'Connected');
  });
  io.on('connect_error', function(d){
    addMessage(d);
  });

  io.on('setup', function(data){
    myColor = data.color;
    io.emit('ready', {name: myUsername});
  });
  io.on('message', function(data){
    addMessage(data.message, data.user, data.color);
  });
  io.on('setup', function(data){
    myColor = data.color;
  });
}