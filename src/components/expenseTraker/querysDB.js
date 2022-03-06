const {
  table_transaction,
  table_other_transactions,
  table_type_transactions,
  table_type_income_or_expense
} = require('../../database/constants');

const queryGetAllTransactions = `
SELECT SUM(amount) AS total_incomes
FROM(
  (
    SELECT
      ${table_transaction}.amount,
      ${table_type_transactions}.idTypeIncomeOrExpense
    FROM sistem_water.${table_transaction}
    INNER JOIN ${table_type_transactions} ON ${table_type_transactions}.id = sistem_water.${table_transaction}.idTypeTransaction
    INNER JOIN ${table_type_income_or_expense} ON ${table_type_income_or_expense}.id = ${table_type_transactions}.idTypeIncomeOrExpense
    WHERE ${table_type_transactions}.idTypeIncomeOrExpense = ?
  )
  UNION ALL
  (
    SELECT
      amount,
      "" as idTypeIncomeOrExpense
    FROM sistem_water.other_transactions
    INNER JOIN ${table_type_transactions} ON ${table_type_transactions}.id = other_transactions.idTypeTransaction
    INNER JOIN ${table_type_income_or_expense} ON ${table_type_income_or_expense}.id = ${table_type_transactions}.idTypeIncomeOrExpense
    WHERE ${table_type_transactions}.idTypeIncomeOrExpense = ?
  ) 
) T1
`;

const queryGetAllTransactionsLastMonth = `
SELECT SUM(amount) AS total_incomes
FROM(
  (
    SELECT
      ${table_transaction}.amount,
      ${table_type_transactions}.idTypeIncomeOrExpense,
      ${table_transaction}.dateCreate
    FROM sistem_water.${table_transaction}
    INNER JOIN ${table_type_transactions} ON ${table_type_transactions}.id = sistem_water.${table_transaction}.idTypeTransaction
    INNER JOIN ${table_type_income_or_expense} ON ${table_type_income_or_expense}.id = ${table_type_transactions}.idTypeIncomeOrExpense
    WHERE ${table_type_transactions}.idTypeIncomeOrExpense = ? AND ${table_transaction}.dateCreate >= ?
  )
  UNION ALL
  (
    SELECT
      amount,
      "" as idTypeIncomeOrExpense,
      dateCreate
    FROM sistem_water.other_transactions
    INNER JOIN ${table_type_transactions} ON ${table_type_transactions}.id = other_transactions.idTypeTransaction
    INNER JOIN ${table_type_income_or_expense} ON ${table_type_income_or_expense}.id = ${table_type_transactions}.idTypeIncomeOrExpense
    WHERE ${table_type_transactions}.idTypeIncomeOrExpense = ? AND ${table_other_transactions}.dateCreate >= ?
  ) 
) T1
`;

module.exports = {
  queryGetAllTransactions,
  queryGetAllTransactionsLastMonth
};