const mySqlConnectionPromise = require('../../database/connectionPromise');
const { table_reports, table_type_reports, table_transaction } = require('../../database/constants');
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

getReportsClient = (idClient) => {
  return new Promise(async(resolve, reject) => {
    const queryReport = `
      SELECT 
        ${table_reports}.id,
        ${table_type_reports}.name,
        ${table_reports}.idTimeConnection,
        ${table_reports}.date,
        ${table_reports}.note
      FROM ${table_reports}
      INNER JOIN ${table_transaction} ON ${table_reports}.id = ${table_transaction}.idReport
      INNER JOIN ${table_type_reports} ON ${table_reports}.idTypeReport = ${table_type_reports}.id
      GROUP BY ${table_reports}.id;
      `;
      
      const queryTransaction = `
        SELECT 
          ${table_transaction}.idReport,
          ${table_transaction}.id AS idTransaction,
          ${table_transaction}.amount,
          ${table_transaction}.date AS dateTransaction
        FROM ${table_reports}
        INNER JOIN ${table_transaction} ON ${table_reports}.id = ${table_transaction}.idReport
        INNER JOIN ${table_type_reports} ON ${table_reports}.idTypeReport = ${table_type_reports}.id
      `;
      // WHERE ${table_reports}.id = ?
    try {
      const [reports] = await queryDB(queryReport);
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