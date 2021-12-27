const mySqlConnectionPromise = require('../../database/connectionPromise');
const {
  table_reports,
  table_type_reports,
  table_transaction,
  table_time_connection,
  table_clients,
  table_water_connection,
  table_type_transactions
} = require('../../database/constants');
const setReport = require('./setReport');
const { functionsDB: { queryDB } } = require('../functions')

const getReports = (idReport) => {
  return new Promise(async (resolve, reject) => {
    let query = `
      SELECT
        *
      FROM ${table_reports}
    `;
    let variablesQuery = []

    if (idReport) {
      query += 'WHERE = ?;';
      variablesQuery = [idReport];
    } else {
      query += ';';
    };

    try {
      const [rows, fields] = await (await mySqlConnectionPromise).execute(query, variablesQuery);
      resolve(idReport ? rows[0] : rows);
    } catch (err) {
      console.log(err);
      reject(err);
    };
  });
};

const getReportsClient = (idReport) => {
  return new Promise(async(resolve, reject) => {
    let queryReport = `
      SELECT 
        ${table_reports}.id,
        ${table_type_reports}.name,
        ${table_reports}.idTimeConnection,
        ${table_reports}.date,
        ${table_reports}.note,
        ${table_time_connection}.idClient
      FROM ${table_reports}
      INNER JOIN ${table_transaction} ON ${table_reports}.id = ${table_transaction}.idReport
      INNER JOIN ${table_type_reports} ON ${table_reports}.idTypeReport = ${table_type_reports}.id
      INNER JOIN ${table_time_connection} ON ${table_reports}.idTimeConnection = ${table_time_connection}.id
      `;
      
      const queryTransaction = `
        SELECT 
          ${table_transaction}.idReport,
          ${table_transaction}.id AS idTransaction,
          ${table_transaction}.amount,
          ${table_transaction}.date AS dateTransaction,
          ${table_type_transactions}.name
        FROM ${table_reports}
        INNER JOIN ${table_transaction} ON ${table_reports}.id = ${table_transaction}.idReport
        INNER JOIN ${table_type_reports} ON ${table_reports}.idTypeReport = ${table_type_reports}.id
        INNER JOIN ${table_type_transactions} ON ${table_transaction}.idTypeTransaction = ${table_type_transactions}.id
      `;

    if(idReport !== undefined) {
      queryReport += `
        WHERE ${table_reports}.id = ?
        GROUP BY ${table_reports}.id
      `;
    } else {
      queryReport += `
        GROUP BY ${table_reports}.id
      `;
    };

    try {
      const [reports] = await queryDB(queryReport, [idReport]);
      const [transactions] = await queryDB(queryTransaction);
      const reportsWithTransactions = createReportWithTransactions(reports, transactions);

      resolve(reportsWithTransactions);
    } catch (err) {
      console.log(err);
      reject(err);
    };
  });
};

const createReportWithTransactions = (reports, transactions) => {
  return new Promise((resolve, reject) => {
    reports.forEach(report => {
      report.transactions = transactions.filter(transaction => transaction.idReport === report.id);
    });
    resolve(reports);
  });
};

module.exports = {
  list: getReports,
  set: setReport,
  listReportsClient: getReportsClient
};