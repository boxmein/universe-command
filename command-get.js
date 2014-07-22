var sqlite3 = require('sqlite3')
  , path = require('path');

var db = new sqlite3.Database(path.join('data', 'commands.db'));


exports.command = function(line, callback) {
  db.get("SELECT response FROM commands WHERE line = ?", line, callback);
};


exports.onclose = function() {
  db.close();
};