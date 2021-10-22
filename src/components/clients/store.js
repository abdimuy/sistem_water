const mySqlConnection = require('../../database/connection');
const { table_clients, table_transaction, table_water_connection, table_type_clients, table_client_level } = require('../../database/constants');

const getClients = (idClient) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        ${table_clients}.id,
        ${table_clients}.name,
        ${table_clients}.lastName,
        ${table_water_connection}.street,
        ${table_water_connection}.houseNumber,
        ${table_water_connection}.colonia,
        ${table_water_connection}.reference,
        ${table_water_connection}.id AS idWaterConnection,
        ${table_water_connection}.dateConnection,
        ${table_water_connection}.dateInitPayment,
        ${table_type_clients}.id AS idTypeClient,
        ${table_type_clients}.name AS typeClient,
        ${table_client_level}.id AS idClientLevel,
        ${table_client_level}.clientLevel,
        ${table_clients}.disabled
      FROM ${table_clients}
      INNER JOIN ${table_water_connection} ON ${table_clients}.idWaterConnection = ${table_water_connection}.id
      INNER JOIN ${table_type_clients} ON ${table_clients}.idTypeClient = ${table_type_clients}.id
      INNER JOIN ${table_client_level} ON ${table_type_clients}.idClientLevel = ${table_client_level}.id
    `;
    let variablesQuery = [];

    if (idClient) {
      query += `WHERE ${table_clients}.id = ?`
      variablesQuery = [idClient];
    };

    mySqlConnection.query(
      query,
      variablesQuery,
      async (err, results, fields) => {
        if (!err) {
          resolve(idClient ? results[0] : results);
        } else {
          console.log(err);
          reject(err);
        };
      }
    );

  });
};

const getTransactionsClients = async (arrayOrObject) => {
  return new Promise(async (resolve, reject) => {
    let newArray = [];
    const query = `
      SELECT
        amount,
        date,
        note,
        dateAdded
      FROM ${table_transaction}
      WHERE idClient = ?;
    `;
    try {
      if (Array.isArray(arrayOrObject)) {
        const arrayClients = arrayOrObject;
        for (const item of arrayClients) {
          const transactionsClients = await getTransactions(query, item.id);
          newArray.push({ ...item, transactions: transactionsClients });
        };
        resolve(newArray);
      } else {
        const objectClient = arrayOrObject;
        const transactionsClients = await getTransactions(query, objectClient.id);
        resolve({ ...arrayOrObject, transactions: transactionsClients })
      }

    } catch (err) {
      console.log(err);
      reject('Error al unir las transacciones con los clientes');
    };
  });
};


const getTransactions = (query, id) => {
  return new Promise((resolve, reject) => {
    mySqlConnection.query(
      query,
      [id],
      (err, results, fields) => {
        if (!err) {
          resolve(results)
        } else {
          reject('Error al obtner example')
        }
      }
    )
  })
}

const setClient = ({ name, lastName, disabled, idTypeClient, idWaterConnection }) => {
  return new Promise((resolve, reject) => {
    // console.log({name, lastName, disabled, idTypeClient, idWaterConnection})
    if (!name || !lastName || !idTypeClient) {
      reject('Agregue toda la informacion necesaria para agregar un cliente');
      return null;
    }
    let variablesQuery = [];
    let query = ``;
    if (!idWaterConnection) {
      query = `
        INSERT INTO ${table_clients} (name, lastName, disabled, idTypeClient)
        VALUES (?, ?, ?, ?)
      `;
      variablesQuery = [name, lastName, disabled, idTypeClient];
    } else {
      query = `
        INSERT INTO ${table_clients} (name, lastName, disabled, idTypeClient, idWaterConnection)
        VALUES (?, ?, ?, ?, ?)
      `;
      variablesQuery = [name, lastName, disabled, idTypeClient, idWaterConnection];
    };

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if (!err) {
          resolve('Cliente agregado con exito');
        } else {
          console.log(err);
          reject(err)
          return null
        };
      }
    );
  });
};

const addSeparator = (element => element ? ',' : '');

const updateClient = ({ idClient, name, lastName, disabled, idTypeClient, idWaterConnection }) => {
  console.log({ idClient, name, lastName, disabled, idTypeClient, idWaterConnection })
  return new Promise((resolve, reject) => {
    if (!idClient) {
      reject('Agregue el id del cliente');
      return null
    };
    if (!name && !lastName && !disabled && !idTypeClient && !idWaterConnection) {
      reject('Agregue información para actualizar');
      return null
    };

    let variablesQuery = [];

    let query = `UPDATE ${table_clients}
      SET 
        ${name ? (variablesQuery.push(name), `name = ?`) : ''}
        ${lastName ? (variablesQuery.push(lastName), `${addSeparator(name)}lastName = ?`) : ''}
        ${!isNaN(disabled) ? (variablesQuery.push(disabled), `${addSeparator(lastName || name)}disabled = ?`) : ''}
        ${idTypeClient ? (variablesQuery.push(idTypeClient), `${addSeparator(disabled || lastName || name)}idTypeClient = ?`) : ''}
        ${idWaterConnection ? (variablesQuery.push(idWaterConnection), `${addSeparator(idTypeClient || disabled || lastName || name)}idWaterConnection = ?`) : ''}
      WHERE id = ?
    `;
    variablesQuery.push(idClient);

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if (!err) {
          resolve('Cliente actualizado correctamente');
        } else {
          console.log(err);
          reject('Error al actualizar el cliente');
        };
      }
    );
  });
};


const deleteClient = (idClient) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM ${table_clients} WHERE id = ?`;
    mySqlConnection.query(
      query,
      [idClient],
      (err, results, fields) => {
        if (!err) {
          resolve('Cliente eliminado exitosamente');
        } else {
          console.log(err);
          reject('Error al eliminar usuario');
        };
      }
    );
  });
};

module.exports = {
  list: getClients,
  add: setClient,
  update: updateClient,
  delete: deleteClient,
  list_transactions: getTransactionsClients
};