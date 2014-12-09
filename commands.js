var _ = require('underscore');

module.exports = function(myData, io, display){
  var commands = {
    '\/name (\\w*)': function(matches){
      myData.name = matches[1];
      io.emit('update', myData);
    },
    '\/color (\\w*)': function(matches){
      myData.color = matches[1];
      io.emit('update', myData);
    },
    '\/help': function(){
      display.addMessage('Available Commands:\n'+
        '/color hexvalue\n'+
        '/name newname', 'help', myData.color);
    }
  };

  return function(message){
    var res = _.chain(commands)
      .pairs()
      .find(function(item){
        var key = item[0];
        var result = new RegExp(key).exec(message);
        if(result !== null){
          item[1](result);
        }
        return result !== null;
      }).value();
    return !!res;
  };
};