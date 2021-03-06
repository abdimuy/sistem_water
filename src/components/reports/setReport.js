const mySqlConnectionPromise = require('../../database/connectionPromise');
const { table_reports, table_transaction, table_clients, table_time_connection, table_debts, idIgnoreTransaction } = require('../../database/constants');
const { list_transactions, list: list_clients } = require('../clients/store');
const moment = require('moment');

const setReport = (args) => {
  return new Promise(async (resolve, reject) => {
    const {
      idTypeReport,
      idTimeConnection,
      noteReport,
      dateReport,
      transactionsArray,
      idUser,
    } = args;
    try {
      if (await !validateParameters(idTypeReport, idTimeConnection, dateReport, idUser)) {
        reject('Faltan parametros');
        return null;
      }
      await validateArray(transactionsArray);
    } catch (err) {
      reject(err);
      return null;
    }

    const query = `
    INSERT INTO ${table_reports} (idTypeReport, idTimeConnection, note, date, idUser)
    VALUES (?, ?, ${argIsNull(noteReport)}, ?, ?);
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
        idUser
      },
      variablesQuery
    );


    try {
      const [clientsDetails] = await queryDB(queryClient, [idTimeConnection]);
      const ID_CLIENT = clientsDetails[0].id;
      const clients = await list_clients({idClient: ID_CLIENT});
      // console.log({clients})

      const transactionsAndLatePayment = await list_transactions(clients);
      const { latePayments } = transactionsAndLatePayment[0];
      latePayments.sort((a, b) => a.order - b.order);

      await validatePayments(transactionsArray, latePayments);
      // resolve({ transactionsArray, latePayments });
      let newTransactionsArray = [];
      transactionsArray.forEach(transaction => {
        const { name: TYPE_PAYMENT } = transaction;
        if (TYPE_PAYMENT === 'PAGO MENSUAL') {
          const { paymentToReport  } = transaction;
          const newPaymentToReport = [
            ...paymentToReport.map(payment => {
              return {...payment, note: payment.fullName}
            })
          ];
          newTransactionsArray.push(...newPaymentToReport);
        } else {
          newTransactionsArray.push(transaction);
        }
      })

      await (await mySqlConnectionPromise).beginTransaction();
      const [rows, fields] = await (await mySqlConnectionPromise).execute(query, variablesQuery);
      const ID_REPORT = rows.insertId;
      const [
        queryTransactions,
        variablesQueryTransactions,
        querySetDebts,
        variablesQuerySetDebts
      ] = createQueryTransactions(newTransactionsArray, ID_REPORT);
      await querySetDebts.forEach(async (query, index) => {
        const variableQuerySetDebts = [variablesQuerySetDebts[index]];
        await (await mySqlConnectionPromise).execute(query, variableQuerySetDebts);
      });
      // await (await mySqlConnectionPromise).execute(queryTransactions, variablesQueryTransactions);
      // console.log({ queryTransactions, variablesQueryTransactions });
      await (await mySqlConnectionPromise).execute(queryTransactions, variablesQueryTransactions);
      await (await mySqlConnectionPromise).commit();
      resolve(rows);
    } catch (err) {
      console.log(err);
      reject(err);
    };
  });
};

const validateParameters = (...args) => {
  return args.every(arg => arg !== undefined)
};

const validatePayments = (paymentsArray, latePaymentsArray) => {
  return new Promise((resolve, reject) => {
    const paymentsArrayEdited = [...paymentsArray];
    // console.log({paymentsArray, latePaymentsArray})
    let latePaymentsArrayEdited = [...latePaymentsArray];
    let acumPaymentCounter = 0;
    paymentsArrayEdited.forEach((payment, index) => {
      if(payment.order !== idIgnoreTransaction) {
        if (!(payment?.order === latePaymentsArrayEdited[acumPaymentCounter]?.order)) {
          reject('El orden de pago no coincide con el orden de vencimiento');
        };
        acumPaymentCounter += 1;
      };
    });
    resolve(true);
  });
};

const validateArray = (array) => {
  return new Promise(async (resolve, reject) => {
    // console.log({ array })
    if (!Array.isArray(array)) {
      reject('El array no es valido');
      return null;
    };
    const result = array.every(transaction => {
      // console.log(transaction)
      const {
        price: amount,
        date,
        idTypeTransaction,
      } = transaction;
      // console.log({ amount, date, idTypeTransaction })
      // console.log(validateParameters(amount, date, idTypeTransaction));

      // resolve(!validateParameters(amount, date, idTypeTransaction));
      return validateParameters(amount, date, idTypeTransaction);
    });
    if (result) {
      // console.log({ result })
      resolve(true);
    } else {
      // console.log({ result })
      reject('El array no es valido');
    }
  })
};

const createQueryTransactions = (transactionsArray, ID_REPORT) => {
  let query = '';
  let variablesQuery = [];
  let queryChangeToPayment = [];
  let variablesQueryChangeToPayment = [];
  transactionsArray.forEach((transaction, index) => {
    const {
      price: amount,
      date,
      note,
      idTypeTransaction,
    } = transaction;
    const transactionArgs = {
      amount,
      date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
      note,
      idTypeTransaction,
      ID_REPORT
    };
    if (transaction.id !== undefined) {
      queryChangeToPayment.push(`UPDATE ${table_debts} SET isPaid = 1 WHERE id = ?;`);
      variablesQueryChangeToPayment.push(transaction.id);
    };
    // console.log({ transactionArgs });
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
        VALUES (?, ?, '${moment().format('YYYY-MM-DD HH:mm:ss')}', ${argIsNull(note)}, ?, ?)
      `;
    } else {
      query += `, (?, ?, '${moment().format('YYYY-MM-DD HH:mm:ss')}', ${argIsNull(note)}, ?, ?)`
    };

    loopTransactionArgs(transactionArgs, variablesQuery);
  });
  // console.log([query, variablesQuery]);
  return [query, variablesQuery, queryChangeToPayment, variablesQueryChangeToPayment];
};

const argIsNull = (arg) => (arg === undefined || arg === null) ? 'null' : '?';

const loopTransactionArgs = (transactionArgs, variablesQuery) => {
  for (const key in transactionArgs) {
    if (transactionArgs.hasOwnProperty(key)) {
      if (transactionArgs[key] !== undefined && transactionArgs[key] !== null) {
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