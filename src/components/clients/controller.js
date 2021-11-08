const store = require('./store');

const getClients = (idClient) => {
  return new Promise(async (resolve, reject) => {
    try {
      const clients = await store.list(idClient);
      const clientsTransactions = await store.list_transactions(clients);
      resolve(clientsTransactions);
    } catch (err) {
      console.log(err);
      reject('Error al los datos del cliente');
      return null;
    };
  });
};

const addClient = ({ name, lastName, disabled, idTypeClient, idWaterConnection }) => {
  return new Promise((resolve, reject) => {
    resolve(store.add({
      name,
      lastName,
      disabled,
      idTypeClient,
      idWaterConnection
    }));
  });
};

const updateClient = ({ idClient, name, lastName, disabled, idTypeClient, idWaterConnection }) => {
  return new Promise((resolve, reject) => {
    resolve(store.update({
      idClient,
      name,
      lastName,
      disabled,
      idTypeClient,
      idWaterConnection
    }));
  });
};

const deleteClient = (idClient) => {
  return new Promise((resolve, reject) => {
    resolve(store.delete(idClient));
  })
}

module.exports = {
  getClients,
  addClient,
  updateClient,
  deleteClient
};