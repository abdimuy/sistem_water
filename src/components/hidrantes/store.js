const { functionsDB: { queryDB } } = require('../functions')
const { table_clients, table_time_connection } = require('../../database/constants');

const unsubscribeHidrante = (idHidrante) => {
  return new Promise(async (resolve, reject) => {
    const queryGetHidrante = `
      SELECT 
        ${table_time_connection}.id
      FROM ${table_time_connection}
      INNER JOIN ${table_clients} ON ${table_clients}.id = ${table_time_connection}.idClient
      WHERE ${table_time_connection}.idClient = ? AND ${table_time_connection}.active = 1
      LIMIT 1
    `;

    const queryUpdateHidrante = `
      UPDATE ${table_time_connection}
      SET ${table_time_connection}.active = 0
      WHERE ${table_time_connection}.id = ?
    `;

    try {
      const [res] = await queryDB(queryGetHidrante, [idHidrante]);
      const { id: ID_TIME_CONNECTION } = res[0];
      await queryDB(queryUpdateHidrante, [ID_TIME_CONNECTION]);
      resolve('Hidrante se ha dado de baja con exito');
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  unsubscribeHidrante
};