const mysql = require('mysql2');

const mySqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'sistem_water',
  password: '1AdminSistemWater$',
});

module.exports = mySqlConnection;
