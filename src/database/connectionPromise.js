const mysql = require('mysql2/promise');

  const mySqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db_sistem_water',
    password: 'admin'
  });

  const mySqlConnectionPromise = async () => {
    try {
      return (await mySqlConnection);
    } catch(error) {
      console.log(error);
    }
  };

module.exports = mySqlConnectionPromise();