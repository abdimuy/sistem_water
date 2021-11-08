const mySqlConnectionPromise = require('../../database/connectionPromise');
const { table_reports, table_transaction, table_clients, table_time_connection } = require('../../database/constants');
const { list_transactions } = require('../clients/store');
const moment = require('moment')

const setReport = (args) => {
  return new Promise(async (resolve, reject) => {
    const {
      idTypeReport,
      idTimeConnection,
      noteReport,
      dateReport,
      transactionsArray
    } = args;
    // console.log(noteReport);

    await !validateParameters(idTypeReport, idTimeConnection, dateReport) ? reject('Faltan parametros') : null;
    await !validateArray(transactionsArray) ? reject('El array de transacciones no es valido') : null;

    const query = `
    INSERT INTO ${table_reports} (idTypeReport, idTimeConnection, note, date)
    VALUES (?, ?, ${argIsNull(noteReport)}, ?);
    `;
    // console.log(query);
    const variablesQuery = [];

    const queryClient = `
      SELECT 
        ${table_clients}.id,
        ${table_time_connection}.dateStartPayment,
        ${table_clients}.idTypeClient
      FROM ${table_time_connection}
      INNER JOIN ${table_clients} ON ${table_clients}.id = ${table_time_connection}.idClient
      WHERE ${table_time_connection}.id = ?;
    `;
    // console.log({queryClient})

    loopTransactionArgs(
      {
        idTypeReport,
        idTimeConnection,
        noteReport,
        dateReport,
      },
      variablesQuery
    );


    try {
      const [clients] = await queryDB(queryClient, [idTimeConnection]);
      const { id: ID_CLIENT, dateStartPayment: DATE_START_PAYMENT, idTypeClient } = clients[0];
      const client = {
        idClient: ID_CLIENT,
        dateStartPayment: DATE_START_PAYMENT,
        idTypeClient,
        idTimeConnection
      };
      // console.log({client});

      const transactionsAndLatePayment  = await list_transactions(client);
      const { latePayments } = transactionsAndLatePayment[0];
      // console.log({latePayments, transactionsArray});
      // resolve(transactions)

      await validatePayments(transactionsArray, latePayments);
      // resolve({ transactionsArray, latePayments });

      await (await mySqlConnectionPromise).beginTransaction();
      const [rows, fields] = await (await mySqlConnectionPromise).execute(query, variablesQuery);
      const ID_REPORT = rows.insertId;
      const [queryTransactions, variablesQueryTransactions] = createQueryTransactions(transactionsArray, ID_REPORT);
      await (await mySqlConnectionPromise).execute(queryTransactions, variablesQueryTransactions);
      await (await mySqlConnectionPromise).commit();
      resolve(rows);
    } catch (err) {
      console.log(err);
      reject(err);
    };
  });
};

const validateParameters = (...args) => args.every(arg => arg !== undefined);

const validatePayments = (paymentsArray, latePaymentsArray) => {
  return new Promise((resolve, reject) => {
    const paymentsArrayEdited = [...paymentsArray];
    let latePaymentsArrayEdited = [...latePaymentsArray];
    paymentsArrayEdited.forEach((payment, index) => {
      // console.log({payment: payment.date});
      const latePaymentMonth = moment(latePaymentsArrayEdited[index].date).month();
      const latePaymentYear = moment(latePaymentsArrayEdited[index].date).year();
      const paymentMonth = moment(payment.date).month();
      const paymentYear = moment(payment.date).year();
      if(!(latePaymentMonth === paymentMonth && latePaymentYear === paymentYear)) {
        reject('La fecha de pago no coincide con la fecha de vencimiento');
      };
    });
    resolve(true);
  });
};

const validateArray = (array) => {
  if (!Array.isArray(array)) return false;
  return array.every(transaction => {
    // console.log(transaction)
    const {
      amount,
      date,
      dateCreate,
      idTypeTransaction,
      idReport
    } = transaction;
    return validateParameters(amount, date, dateCreate, idTypeTransaction, idReport);
  });
};

const createQueryTransactions = (transactionsArray, ID_REPORT) => {
  let query = '';
  let variablesQuery = [];
  transactionsArray.forEach((transaction, index) => {
    const {
      amount,
      date,
      dateCreate,
      note,
      idTypeTransaction,
    } = transaction;
    const transactionArgs = {
      amount,
      date,
      dateCreate,
      note,
      idTypeTransaction,
      ID_REPORT
    }
    if (index === 0) {
      query += `
        INSERT INTO ${table_transaction} (
          amount,
          date,
          dateCreate,
          note,
          idTypeTransaction,
          idReport
        )
        VALUES (?, ?, ?, ${argIsNull(note)}, ?, ?)
      `
    } else {
      query += `, (?, ?, ?, ${argIsNull(note)}, ?, ?)`
    };

    loopTransactionArgs(transactionArgs, variablesQuery);
  });
  // console.log([query, variablesQuery]);
  return [query, variablesQuery];
};

const argIsNull = (arg) => (arg === undefined || arg === null) ? 'null' : '?';

const loopTransactionArgs = (transactionArgs, variablesQuery) => {
  for (const key in transactionArgs) {
    if (transactionArgs.hasOwnProperty(key)) {
      if (transactionArgs[key] !== undefined) {
        variablesQuery.push(transactionArgs[key]);
      };
    };
  };
};

const queryDB = (query, variablesQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Array.isArray(variablesQuery)) {
        const [rows, fields] = await (await mySqlConnectionPromise).execute(query, variablesQuery);
        resolve([rows, fields]);
      } else {
        const [rows, fields] = await (await mySqlConnectionPromise).execute(query);
        resolve([rows, fields]);
      };
    } catch (err) {
      console.log(err);
      reject(err);
    };
  });
};

module.exports = setReport;