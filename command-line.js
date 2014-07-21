window.onload = function() {
  'use strict';

  var container = $('<div class="console">');
  $('body').append(container);

  var user = "universe";
  var wd = "~";
  var shell = "#";

  var getPS1 = function() { return user + " " + wd + " " + shell + " "; };
  
  var path = {
    exist: function(path) {
      return true;
    },
    cwd: function(newpath) { 
      if (this.exist(newpath))
        return wd = newpath; 
      else return false;
    }
  };

  var controller = container.console({
    promptLabel: getPS1(),
    autofocus: true,
    animateScroll: true,
    promptHistory: true,

    commandValidate: function(line){
      if (line == "") return false;
      else return true;
    },

    commandHandle: function(line, callback){
      line = line.replace(/^\s+|\s+$/,'');
      var handled = false;

      // local commands
      switch (line) {
        case 'whoami': 
          callback(user);
          handled = true;
          break;
        case 'pwd': 
          callback(wd);
          handled = true;
          break;
        default: break;
      }
      // not handled yet, so let's send it to our magical command server
      // yay! command server!
      if (!handled) {

      }
    },

    getPromptLabel: function() {
      return getPS1();
    },
    
    charInsertTrigger: function(keycode,line){
       // Let you type until you press a-z
       // Never allow zero.
       // return !line.match(/[a-z]+/) && keycode != '0'.charCodeAt(0);
       return true;
    },
  });

  document.body.addEventListener('keypress', function(evt) {
    $('.jquery-console-typer').focus();
  });
};

