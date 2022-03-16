const { functionsDB: { queryDB } } = require('../functions');
const { queryGetAllTransactions, queryGetAllTransactionsLastMonth } = require('./querysDB');
const {
  ID_TYPE_INCOME,
  ID_TYPE_EXPENSE,
} = require('../../database/constants');
const moment = require('moment');

const getAllTransactions = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateInitTracker = moment('2022-03-07 00:00:00').format('YYYY-MM-DD HH:mm:ss');
      const [incomes] = await queryDB(queryGetAllTransactions, [
        ID_TYPE_INCOME,
        dateInitTracker,
        ID_TYPE_INCOME,
        dateInitTracker
      ]);
      const [expenses] = await queryDB(queryGetAllTransactions, [
        ID_TYPE_EXPENSE,
        dateInitTracker,
        ID_TYPE_EXPENSE,
        dateInitTracker
      ]);

      resolve([
        incomes[0].total_incomes,
        expenses[0].total_incomes,
      ]);
    } catch (err) {
      reject(err);
    }
  });
};

const getAllTransactionsByMonth = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const lastMonth = moment().startOf('day').subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss');
      const [incomes] = await queryDB(queryGetAllTransactionsLastMonth, [
        ID_TYPE_INCOME,
        lastMonth,
        ID_TYPE_INCOME,
        lastMonth,
      ]);
      const [expenses] = await queryDB(queryGetAllTransactionsLastMonth, [
        ID_TYPE_EXPENSE,
        lastMonth,
        ID_TYPE_EXPENSE,
        lastMonth,
      ]);
      resolve([
        incomes[0].total_incomes,
        expenses[0].total_incomes,
      ]);
    } catch (err) {
      reject(err);
    }
  })
}
module.exports = {
  getAllTransactions,
  getAllTransactionsByMonth,
}