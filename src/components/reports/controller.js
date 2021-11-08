const store = require('./store');

const getReports = (idReport) => {
  return new Promise((resolve, reject) => {
    resolve(store.list(idReport));
  });
};

const getReportsClient = (idClient) => {
  return new Promise((resolve, reject) => {
    resolve(store.listReportsClient(idClient));
  }) 
}

const setReport = (args) => {
  return new Promise((resolve, reject) => {
    resolve(store.listReportsClient(args));
  });
};

module.exports = {
  getReports,
  setReport,
  getReportsClient
};