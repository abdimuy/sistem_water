const mysql = require('mysql2/promise');

  const mySqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sistem_water',
    password: 'abdidev'
  });

  const mySqlConnectionPromise = async () => {
    try {
      return (await mySqlConnection);
    } catch(error) {
      console.log(error);
    }
  };

module.exports = mySqlConnectionPromise();