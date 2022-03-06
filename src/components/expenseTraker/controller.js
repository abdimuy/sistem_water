const store = require('./store');

const getAll = () => {
  return new Promise(async(resolve, reject) => {
    try {
      let [incomes, expenses] = await store.getAllTransactions();
      let totalBalance = incomes - expenses;
      let [incomesByMonth, expensesByMonth] = await store.getAllTransactionsByMonth();
      incomes = incomes === null ? 0 : incomes;
      expenses = expenses === null ? 0 : expenses;
      incomesByMonth = incomesByMonth === null ? 0 : incomesByMonth;
      expensesByMonth = expensesByMonth === null ? 0 : expensesByMonth;
      resolve({
        balance: {
          incomes,
          expenses,
          totalBalance,
        },
        incomesByMonth,
        expensesByMonth,
      });
    } catch(err) {
      reject(err);
    };
  });
};

module.exports = {
  getAll
};