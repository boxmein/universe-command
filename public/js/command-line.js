window.onload = function() {
  'use strict';

  var container = $('<div class="console">');
  $('body').append(container);

  var user = "universe";
  var wd = "~";
  var shell = "#";

  // I'll figure out a way to make the prompt change
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
      console.log('handling a command...');

      line = line.replace(/^\s+|\s+$/,'');
      var handled = 0;
      // 0 = not handled at all
      // 1 = handled, no result
      // 2 = handled, result sent via callback

      // local commands
      switch (line) {
        case 'whoami': 
          callback(user);
          handled = 2;
          break;
        case 'pwd': 
          callback(wd);
          handled = 2;
          break;

        default: break;
      }

      // not handled yet, so let's send it to our magical command server
      // yay! command server!
      if (handled != 2) {
        console.log('wasn\'t handled yet, sending XHR.');

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/command');
        var postdata = "cmd=" + encodeURIComponent(line);

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
          if (xhr.status == 200 && xhr.readyState == 4) {
            if (xhr.responseText == "!nocmd")
              callback("command not found: " + line);
            callback(xhr.responseText);
          }
        };

        xhr.onerror = function(err) {
          callback({msg: err, className: "error xhr-error"});
        };

        xhr.send(postdata);
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
};

