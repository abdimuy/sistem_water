const mysql = require('mysql2');

const mySqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'sistem_water',
  password: 'abdidev'
});

module.exports = mySqlConnection;