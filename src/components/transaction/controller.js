const store = require('./store');

const getTransactions = (idTransaction) => {
  return new Promise((resolve, reject) => {
    resolve(store.list(idTransaction));
  });
};

const setTransaction = (args) => {
  return new Promise((resolve, reject) => {
    resolve(store.add(args));
  });
};

const updateTransaction = (args) => {
  return new Promise((resolve, reject) => {
    resolve(store.update(args));
  });
};

const deleteTransaction = (idTransaction) => {
  return new Promise((resolve, reject) => {
    resolve(store.delete(idTransaction));
  });
};

module.exports = {
  getTransactions,
  setTransaction,
  updateTransaction,
  deleteTransaction
};