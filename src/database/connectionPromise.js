const mysql = require('mysql2/promise');

  const mySqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sistem_water',
    password: 'abdidev'
  });

  const mySqlConnectionPromise = async () => {
    return (await mySqlConnection);
  };

module.exports = mySqlConnectionPromise();