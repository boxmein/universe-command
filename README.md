universe-command
================

  A command line for the entire universe. What would _you_ do when stumbling
  upon something like this? 


## Setup

1. Install the dependencies, their dependencies, their dependencies'
   dependencies, (you get the point)

    npm install

2. Create a sqlite3 database that keeps track of commands and their responses.
   Check out the example database file added in the next commit. You can add 
   stuff to the command line via a SQLite shell or database browser or whatnot.
   If you're willing, you can use the below SQL to generate a database inside
   the SQLite shell.

    sqlite3> CREATE TABLE commands (
                          line TEXT UNIQUE ON CONFLICT REPLACE,
                          response TEXT);
    sqlite3> INSERT INTO commands VALUES ("hello", "hi");

3. Cross your fingers, and `node server-main.js`.