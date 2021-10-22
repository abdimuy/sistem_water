const mySqlConnection = require('../../database/connection');
const { table_transaction } = require('../../database/constants');
const { createQueryUpdate, checkExitsFields } = require('../functions');

const getTransactions = (idTransaction) => {
  return new Promise((resolve, reject) => {
    let query;
    let variablesQuery = [];
    if(idTransaction) {
      query = `SELECT * FROM ${table_transaction} WHERE id = ?`;
      variablesQuery.push(idTransaction);
    } else {
      query = `SELECT * FROM ${table_transaction}`;
    };

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if(!err) {
          resolve(idTransaction ? results[0] : results);
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
    if(!amount || !date || !idTypeTransaction || !dateAdded) {
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
        if(!err) {
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
    {field: amount, column: 'amount', notNull: true},
    {field: date, column: 'date', notNull: true},
    {field: idTypeTransaction, column: 'idTypeTransaction', notNull: true},
    {field: dateAdded, column: 'dateAdded', notNull: true},
    {field: note, column: 'note', notNull: false},
    {field: idUser, column: 'idUser', notNull: false},
    {field: idWaterConnection, column: 'idWaterConnection', notNull: false},
    {field: idClient, column: 'idClient', notNull: false},
  ];

  return new Promise((resolve, reject) => {
    if(checkExitsFields(arrayTransactionArgs)) {
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
        if(!err) {
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
        if(!err) {
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
  add: setTransaction,
  update: updateTransaction,
  delete: deleteTransaction
};