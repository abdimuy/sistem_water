const mySqlConnection = require('../../database/connection');
const { table_prices } = require('../../database/constants');

const getPrices = (idPrice) => {
  return new Promise((resolve, reject) => {
    let query;
    let variablesQuery = [];
    if(!idPrice) {
      query = `SELECT * FROM ${table_prices}`;
    } else {
      query = `SELECT * FROM ${table_prices} WHERE id = ?`;
      variablesQuery = [idPrice];
    };
    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if(!err) {
          if(results.length === 0) {
            resolve('No hay datos disponibles para la consulta solicitada');
          } else {
            resolve(idPrice ? results[0] : results);
          };
        } else {
          reject('Error al obtener los precios');
        };
      }
    );
  });
};

const setPrice = (args) => {
  const { price, dateInit, dateFinish, idTypeClient, idTypePrice } = args;
  return new Promise((resolve, reject) => {
    if(!price || !dateInit || !dateFinish || !idTypePrice) {
      reject('Ingrese toda la información necesaria para agregar un precio');
      return null;
    };

    const query = `
      INSERT INTO ${table_prices} (price, dateInit, dateFinish, idTypeClient, idTypePrice)
      VALUES (?, ?, ?, ?, ?)
    `;

    mySqlConnection.query(
      query,
      [price, dateInit, dateFinish, idTypeClient, idTypePrice],
      (err, results, fields) => {
        if(!err) {
          resolve('Precio agregado con exito');
        } else {
          console.log(err);
          reject('Error al agregar precio');
        };
      }
    );
  });
};

const addSeparator = (element => element ? ',' : '');

const updatePrice = (args) => {
  const { price, dateInit, dateFinish, idTypeClient, idTypePrice, idPrice } = args;
  return new Promise((resolve, reject) => {
    if(!idPrice) {
      reject('Agregue el id del precio');
      return null;
    };
    if(!price && !dateInit && !dateFinish && !idTypeClient && !idTypePrice) {
      reject('Agregue todos los campos necesarios para actualizar el precio');
      return null;
    };
    let variablesQuery = [];
    let query = `UPDATE ${table_prices}
      SET 
        ${price ? (variablesQuery.push(price), `price = ?`) : ''}
        ${dateInit ? (variablesQuery.push(dateInit), `${addSeparator(price)}dateInit = ?`) : ''}
        ${dateFinish ? (variablesQuery.push(dateFinish), `${addSeparator(dateInit || price)}dateFinish = ?`) : ''}
        ${idTypeClient ? (variablesQuery.push(idTypeClient), `${addSeparator(dateFinish || dateInit || price)}idTypeClient = ?`) : ''}
        ${idTypePrice ? (variablesQuery.push(idTypePrice), `${addSeparator(dateFinish || dateInit || price || idTypeClient)}idTypePrice = ?`) : ''}
      WHERE id = ?
    `;

    variablesQuery.push(idPrice);

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if(!err) {
          resolve('El precio se ha editado correctamente');
        } else {
          console.log(err);
          reject('Error al editar el precio');
        };
      }
    );
  });
};

const deletePrice = (idPrice) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM ${table_prices} WHERE id = ?`;
    mySqlConnection.query(
      query,
      [idPrice],
      (err, results, fields) => {
        if(!err) {
          resolve('El precio se ha eliminado correctamente');
        } else {
          console.log(err);
          reject('Error al eliminar el precio');
        };
      }
    );
  });
};

module.exports = {
  list: getPrices,
  add: setPrice,
  update: updatePrice,
  delete: deletePrice
};