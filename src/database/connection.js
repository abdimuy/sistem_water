const mysql = require('mysql2');

const mySqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'db_sistem_water',
  password: 'admin'
});

module.exports = mySqlConnection;