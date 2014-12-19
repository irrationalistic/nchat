var commander = require('commander');
var randomcolor = require('just.randomcolor');
var pkg = require('./package.json');

// process.env.DEBUG = '*';

commander
  .version(pkg.version)
  .option('-s, --server', 'Run as server')
  .option('-p, --port [port]', 'Which port to use?', process.env.PORT || 3333)
  .option('-a, --address [address]', 'Which address to use?', 'http://127.0.0.1:3333')
  .option('-u, --user [name]', 'Which name to use?')
  .option('-f, --force', 'Force to be server with no display', false)
  .option('-x, --proxy [address]', 'Use proxy?')
  .parse(process.argv);

if(process.env.http_proxy && !commander.proxy){
  commander.proxy = process.env.http_proxy;
}

var serverData = {
  color: 333,
  name: 'server'
};

var myData = {
  color: new randomcolor().toHex().value,
  name: commander.user
};

// check if we have the ability to show display in terminal
if(!commander.force && process.stdout.isTTY){
  // require username if not server
  if(!commander.user){
    console.error('Must set a username with -u!');
    return;
  }
  if(commander.user === 'server'){
    console.error('Cannot use the "server" username!');
    return;
  }
  
  var display = require('./display')(myData);
  // var display = {
  //   addMessage: function(msg){ console.log('MSG: ' + msg); },
  //   events: {onSubmit: null}
  // };
  var io;
  if(commander.server){
    // run server AND client
    var server = require('./server')(serverData, commander.port, display);
    io = server.io;
  }
  
  var client = require('./client')(myData, commander.address, commander.proxy, display);
  io = client.io;

  var commands = require('./commands')(myData, io, display);

  display.events.onSubmit = function(message){
    var commandMatched = commands(message);
    if(!commandMatched){
      io.emit('message', {
        message: message,
        name: myData.name,
        color: myData.color
      });
      display.addMessage(message, myData.name, myData.color);
    }
  };
} else {
  // force as server since this can't be anything else!
  var server = require('./server')(serverData, commander.port);
}