var express = require('express')
  , http    = require('http')
  , path    = require('path')
  , logfmt  = require('logfmt')
  , error_handler  = require('errorhandler')
  , serve_favicon = require('serve-favicon')
  , command_handler = require('./command-get.js')
  , bodyparser = require('body-parser');

var app = express();

// App configuration

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.engine('jade', require('jade').__express);

app.use(logfmt.requestLogger());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

/*app.use(serve_favicon(
  path.join(__dirname, 'public/favicon.ico'))); //*/

// development only
if ('development' == app.get('env')) {
  app.use(error_handler());
}

app.get('/', function(req, res) {
  res.render('index.jade', function(err, html) {
    if (err)
      console.log(err);

    res.send(html);
  });
});

app.post('/command', function(req, res) {
  var command = req.body.cmd;
  command_handler.command(command, function(err, row) {
    if (err) {
      res.send("!error: " + err.stack + "\n" + row);
    }
    else if (row.response == "") {
      res.send("!nocmd");
    }
    else {
      res.send(row.response);
    }
  });
});

app.listen(app.get('port'));

// handle exiting

function exitHandler (opt, err) {
  if (opt.clean) {
    command_handler.onclose();
  }
  
  if (err) {
    console.log(err.stack);
  }

  if (opt.exit) {
    process.exit();
  }
}

process.on('exit', exitHandler.bind(null, {clean: true}));
process.on('SIGINT', exitHandler.bind(null, {clean: true, exit: true}));
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));