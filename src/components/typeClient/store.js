const mySqlConnection = require('../../database/connection');
const { table_type_clients, table_client_level } = require('../../database/constants');

const getTypeClients = (idTypeClient) => {
  return new Promise((resolve, reject) => {
    let query;
    let variablesQuery = [];
    if(!idTypeClient) {
      query = `SELECT ${table_type_clients}.id, ${table_type_clients}.name, ${table_client_level}.clientLevel
        FROM ${table_type_clients}
        INNER JOIN ${table_client_level}
        ON idClientLevel = ${table_client_level}.id`;
    } else {
      query = `SELECT ${table_type_clients}.id, ${table_type_clients}.name, ${table_client_level}.clientLevel
        FROM ${table_type_clients}
        INNER JOIN ${table_client_level}
        ON idClientLevel = ${table_client_level}.id
        WHERE ${table_type_clients}.id = ?`;
      variablesQuery = [idTypeClient];
    };
    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if(!err) {
          if(results.length === 0) {
            resolve('No hay datos disponibles para la consulta solicitada');
          } else {
            resolve(idTypeClient ? results[0] : results);
          };
        } else {
          console.log(err);
          reject('Error al obtener los datos');
        };
      }
    );
  });
};

const setTypeClient = (args) => {
  const { name, idClientLevel } = args;
  return new Promise((resolve, reject) => {
    if(!name || !idClientLevel) {
      reject('Ingrese toda la información necesaria para agregar un tipo de cliente');
      return null;
    };
    const query = `
      INSERT INTO ${table_type_clients} (name, idClientLevel)
      VALUES (?, ?)
    `;
    
    mySqlConnection.query(
      query,
      [name, idClientLevel],
      (err, results, fields) => {
        if(!err) {
          resolve('El tipo de cliente se ha agregado correctamente');
        } else {
          console.log(err);
          reject('Error al agregar un tipo de cliente');
        };
      }
    );
  });
};

const addSeparator = (element => element ? ',' : '');

const updateTypeClient = (args) => {
  const { idTypeClient, name, idClientLevel } = args;
  return new Promise((resolve, reject) => {
    if(!idTypeClient) {
      reject('Agregue el id del tipo de cliente');
      return null;
    };

    if(!name && !idClientLevel) {
      reject('Agregue todos los campos necesarios para actualizar el tipo de cliente');
      return null;
    };
    let variablesQuery = [];
    let query = `UPDATE ${table_type_clients}
      SET 
        ${name ? (variablesQuery.push(name), `name = ?`) : ''}
        ${idClientLevel ? (variablesQuery.push(idClientLevel), `${addSeparator(name)}idClientLevel = ?`) : ''}
      WHERE id = ?
    `;

    variablesQuery.push(idTypeClient);

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if(!err) {
          resolve('El tipo de cliente se ha editado correctamente');
        } else {
          console.log(err);
          reject('Error al editar el tipo de cliente');
        };
      }
    );
  });
};

const deleteTypeClient = (idTypeClient) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM ${table_type_clients} WHERE id = ?`;
    mySqlConnection.query(
      query,
      [idTypeClient],
      (err, results, fields) => {
        if(!err) {
          resolve('El tipo de cliente se ha eliminado correctamente');
        } else {
          console.log(err);
          reject('Error al eliminar el tipo de cliente');
        };
      }
    );
  });
};

module.exports = {
  list: getTypeClients,
  add: setTypeClient,
  update: updateTypeClient,
  delete: deleteTypeClient
};