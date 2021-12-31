const mysql = require('mysql2/promise');

  const mySqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db_sistem_water',
    password: 'admin'
  });

  const mySqlConnectionPromise = async () => {
    return (await mySqlConnection);
  };

module.exports = mySqlConnectionPromise();