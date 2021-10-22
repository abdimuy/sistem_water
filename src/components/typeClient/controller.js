const store = require('./store');

const getTypeClients = (idTypeClient) => {
  return new Promise((resolve, reject) => {
    resolve(store.list(idTypeClient));
  });
};

const setTypeClient = (args) => {
  return new Promise((resolve, reject) => {
    resolve(store.add(args));
  });
};

const updateTypeClient = (args) => {
  return new Promise((resolve, reject) => {
    resolve(store.update(args));
  });
};

const deleteTypeClient = (idTypeClient) => {
  return new Promise((resolve, reject) => {
    resolve(store.delete(idTypeClient));
  });
};

module.exports = {
  getTypeClients,
  setTypeClient,
  updateTypeClient,
  deleteTypeClient
};