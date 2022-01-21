const mySqlConnection = require('../../database/connection');
const {
  table_transaction,
  table_type_transactions,
  table_reports,
  table_time_connection,
  table_clients,
  table_water_connection,
  table_colonias,
  table_type_clients,
  table_type_income_or_expense
} = require('../../database/constants');
const { createQueryUpdate, checkExitsFields } = require('../functions');
const moment = require('moment')

const getTransactions = (idTransaction) => {
  return new Promise((resolve, reject) => {
    let query;
    let variablesQuery = [];
    if (idTransaction) {
      query = `SELECT * FROM ${table_transaction} WHERE id = ?`;
      variablesQuery.push(idTransaction);
    } else {
      query = `SELECT
        ${table_transaction}.id,
        ${table_transaction}.amount,
        ${table_transaction}.date,
        ${table_transaction}.note,
        ${table_transaction}.idTypeTransaction,
        ${table_transaction}.dateCreate,
        ${table_transaction}.idReport,
        ${table_type_transactions}.name AS typeTransaction
      FROM ${table_transaction}
      INNER JOIN ${table_type_transactions} ON ${table_transaction}.idTypeTransaction = ${table_type_transactions}.id
      `;
    };

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if (!err) {
          resolve(idTransaction ? results[0] : results);
        } else {
          console.log(err);
          reject('Error al obtener las transacciones');
        };
      }
    );
  });
};

const getTransactionsRange = (dateStart, dateEnd) => {
  return new Promise((resolve, reject) => {
    const datesRange = [
      moment(dateStart).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      moment(dateEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    ];
    // console.log(datesRange);
    const query = `
      SELECT
        ${table_transaction}.id,
        ${table_transaction}.amount,
        ${table_transaction}.date,
        ${table_transaction}.note,
        ${table_transaction}.idTypeTransaction,
        ${table_transaction}.dateCreate,
        ${table_transaction}.idReport,
        concat(${table_clients}.name, ' ', ${table_clients}.lastName) AS clientName,
        concat(${table_water_connection}.numberConnection, ' - ', ${table_colonias}.name) AS numberWaterConnection,
        ${table_type_transactions}.name AS typeTransaction,
        ${table_type_clients}.name AS typeClient,
        ${table_type_income_or_expense}.name AS typeIncomeOrExpense
      FROM ${table_transaction}
      INNER JOIN ${table_type_transactions} ON ${table_transaction}.idTypeTransaction = ${table_type_transactions}.id
      INNER JOIN ${table_reports} ON ${table_transaction}.idReport = ${table_reports}.id
      INNER JOIN ${table_time_connection} ON ${table_reports}.idTimeConnection = ${table_time_connection}.id
      INNER JOIN ${table_clients} ON ${table_time_connection}.idClient = ${table_clients}.id
      INNER JOIN ${table_water_connection} ON ${table_time_connection}.idWaterConnection = ${table_water_connection}.id
      INNER JOIN ${table_colonias} ON ${table_water_connection}.idColonia = ${table_colonias}.id
      INNER JOIN ${table_type_clients} ON ${table_clients}.idTypeClient = ${table_type_clients}.id
      INNER JOIN ${table_type_income_or_expense} ON ${table_type_transactions}.idTypeIncomeOrExpense = ${table_type_income_or_expense}.id
      WHERE dateCreate >= ? AND dateCreate < ? 
      ORDER BY ${table_transaction}.dateCreate DESC
      LIMIT 100000000
    `;
    mySqlConnection.query(
      query,
      datesRange,
      (err, results, fields) => {
        if (!err) {
          resolve(results);
        } else {
          console.log(err);
          reject('Error al obtener las transacciones');
        };
      }
    );
  });
};

const setTransaction = (transactionArgs) => {
  const {
    amount,
    date,
    note,
    dateAdded,
    idUser,
    idWaterConnection,
    idTypeTransaction,
    idClient
  } = transactionArgs;
  return new Promise((resolve, reject) => {
    if (!amount || !date || !idTypeTransaction || !dateAdded) {
      reject('Agregue todos campos necesarios para crear una transacción');
      return null;
    };
    const query = `
      INSERT INTO ${table_transaction} 
      (amount, date, note, dateAdded, idUser, idWaterConnection, idTypeTransaction, idClient)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    mySqlConnection.query(
      query,
      [amount, date, note, dateAdded, idUser, idWaterConnection, idTypeTransaction, idClient],
      (err, results, fields) => {
        if (!err) {
          resolve('La transacción se ha creado con exito');
        } else {
          console.log(err);
          reject('Error al crear la transacción');
        };
      }
    );
  });
};

const updateTransaction = (transactionArgs) => {
  const {
    idTransaction,
    amount,
    date,
    note,
    dateAdded,
    idUser,
    idWaterConnection,
    idTypeTransaction,
    idClient
  } = transactionArgs;
  const arrayTransactionArgs = [
    { field: amount, column: 'amount', notNull: true },
    { field: date, column: 'date', notNull: true },
    { field: idTypeTransaction, column: 'idTypeTransaction', notNull: true },
    { field: dateAdded, column: 'dateAdded', notNull: true },
    { field: note, column: 'note', notNull: false },
    { field: idUser, column: 'idUser', notNull: false },
    { field: idWaterConnection, column: 'idWaterConnection', notNull: false },
    { field: idClient, column: 'idClient', notNull: false },
  ];

  return new Promise((resolve, reject) => {
    if (checkExitsFields(arrayTransactionArgs)) {
      reject('Agregue todos los campos necesarios para actualizar el la transacción');
      return null;
    };
    const [query, variablesQuery] = createQueryUpdate(
      arrayTransactionArgs,
      table_transaction,
      idTransaction
    );

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, result, fields) => {
        if (!err) {
          resolve('Las transacción se ha editado con exito');
        } else {
          console.log(err);
          reject('Error al editar la transacción');
        };
      }
    );
  });
};

const deleteTransaction = (idTransaction) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM ${table_transaction} WHERE id = ?`;
    mySqlConnection.query(
      query,
      [idTransaction],
      (err, results, fields) => {
        if (!err) {
          resolve('La transacción ha sido eliminada correctamente');
        } else {
          console.log(err);
          reject('Error al eliminar la transacción');
        };
      }
    );
  });
};

module.exports = {
  list: getTransactions,
  listRange: getTransactionsRange,
  add: setTransaction,
  update: updateTransaction,
  delete: deleteTransaction
};