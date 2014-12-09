var blessed = require('blessed');
var program = blessed.program();

module.exports = function(userData){

  var events = {
    onSubmit: function(message){}
  };

  // Main screen
  var screen = blessed.screen();

  // the messages display
  var messageView = blessed.box({
    top: 0,
    left: 0,
    right: 0,
    bottom: 3,
    content: 'Welcome!',
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      bg: 666
    },
    style: {
      fg: 'white'
    }
  });

  // Input box
  var messageInput = blessed.textarea({
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    input: true,
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

  messageView.on('wheelup', function(){
    messageView.scroll(-1);
    screen.render();
  });
  messageView.on('wheeldown', function(){
    messageView.scroll(1);
    screen.render();
  });

  screen.append(messageView);
  screen.append(messageInput);

  screen.focusPush(messageInput);

  program.key('C-c', function(ch, key) {
    messageView.setContent('');
    messageView.hide();
    messageInput.hide();
    screen.render();
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


  var addMessage = function(message, sender, color){
    messageView.setScrollPerc(100);
    messageView.insertBottom("{#" + color + "-fg}{bold}" + sender + ":{/} " + message);
    messageView.setScrollPerc(100);

    screen.render();
  };

  messageInput.key('enter', function(){
    var msg = messageInput.content.trim();
    if(msg.length > 0){
      events.onSubmit(msg);
    }
    messageInput.clearValue();
  });


  // Revealing module
  return {
    addMessage: addMessage,
    events: events
  };

};