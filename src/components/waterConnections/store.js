const mySqlConnection = require('../../database/connection');
const mySqlConnectionPromise = require("../../database/connectionPromise");
const { table_water_connection, table_clients, table_debts, table_type_debts, table_colonias } = require('./../../database/constants');

const getWaterConnections = (idWaterConnection) => {
  return new Promise((resolve, reject) => {
    let query;
    let variablesQuery = [];

    if (idWaterConnection) {
      query = `SELECT * FROM ${table_water_connection} WHERE id = ?`;
      variablesQuery.push(idWaterConnection)
    } else {
      query = `SELECT * FROM ${table_water_connection}`
    };

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if (!err) {
          if (results.length === 0) {
            resolve('No hay datos disponibles para la consulta solicitada');
          } else {
            resolve(idWaterConnection ? results[0] : results);
          };
        } else {
          console.log(err);
          reject(err);
        };
      }
    );
  });
};

const getWaterConnectionWithoutClient = () => {
  return new Promise(async (resolve, reject) => {
    const query = `
      SELECT
        ${table_water_connection}.id,
        ${table_water_connection}.street,
        ${table_water_connection}.houseNumber,
        ${table_colonias}.name AS colonia,
        ${table_water_connection}.reference,
        ${table_water_connection}.dateConnection
      FROM ${table_water_connection}
      INNER JOIN ${table_colonias} ON ${table_water_connection}.idColonia = ${table_colonias}.id
      LEFT JOIN ${table_clients} ON ${table_water_connection}.id = ${table_clients}.idWaterConnection
    `;

    try {
      const [rowsWaterConnectionWithoutClient] = await (await mySqlConnectionPromise).execute(query);
      resolve(rowsWaterConnectionWithoutClient);
    } catch (err) {
      console.log(err);
      reject('Error al obtener los datos');
    };
  });
};

const setWaterConnection = ({ street, houseNumber, colonia, reference, dateConnection, idClient }) => {
  return new Promise((resolve, reject) => {
    if (!street || !colonia || !dateConnection) {
      reject('Ingrese toda la información necesaria para agregar una toma de agua');
      return null;
    };
    const query = `
      INSERT INTO ${table_water_connection} (street, houseNumber, colonia, reference, dateConnection, idClient)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    mySqlConnection.query(
      query,
      [street, houseNumber, colonia, reference, dateConnection, idClient],
      (err, results, fields) => {
        if (!err) {
          resolve('Toma de agua agregada con exito');
        } else {
          console.log(err);
          reject('Error al agregar toma de agua');
        };
      }
    );
  });
};

const addSeparator = (element => element ? ',' : '');

const updateWaterConnection = ({ idWaterConnection, street, houseNumber, colonia, reference, dateConnection, idClient }) => {
  return new Promise((resolve, reject) => {
    if (!idWaterConnection) {
      reject('Agregue el id de la toma de agua');
      return null;
    };
    if (!street && !houseNumber && !colonia && !reference && !dateConnection && !idClient) {
      reject('Agregue todos los campos necesarios para actualizar una toma de agua');
      return null;
    };
    let variablesQuery = [];
    let query = `UPDATE ${table_water_connection}
      SET 
        ${street ? (variablesQuery.push(street), `street = ?`) : ''}
        ${houseNumber ? (variablesQuery.push(houseNumber), `${addSeparator(street)}houseNumber = ?`) : ''}
        ${colonia ? (variablesQuery.push(colonia), `${addSeparator(houseNumber || street)}colonia = ?`) : ''}
        ${reference ? (variablesQuery.push(reference), `${addSeparator(colonia || houseNumber || street)}reference = ?`) : ''}
        ${dateConnection ? (variablesQuery.push(dateConnection), `${addSeparator(reference || colonia || houseNumber || street)}dateConnection = ?`) : ''}
        ${idClient ? (variablesQuery.push(idClient), `${addSeparator(dateConnection || reference || colonia || houseNumber || street)}idClient = ?`) : ''}
      WHERE id = ?
    `;
    variablesQuery.push(idWaterConnection);

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if (!err) {
          resolve('Toma de agua actualizado correctamente');
        } else {
          console.log(err);
          reject('Error al actualizar la toma de agua');
        };
      }
    );
  });
};

const deleteWaterConnection = (idWaterConnection) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM ${table_water_connection} WHERE id = ?`;
    mySqlConnection.query(
      query,
      [idWaterConnection],
      (err, results, fields) => {
        if (!err) {
          resolve('La toma de agua se ha eliminado con exito');
        } else {
          console.log(err);
          reject('Error al eliminar la toma de agua');
        };
      }
    )
  });
};

module.exports = {
  list: getWaterConnections,
  add: setWaterConnection,
  update: updateWaterConnection,
  delete: deleteWaterConnection,
  listWithoutClient: getWaterConnectionWithoutClient
};