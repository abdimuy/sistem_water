const store = require('./store');

const getWaterConnections = (idWaterConnetion) => {
  return new Promise((resolve, reject) => {
    resolve(store.list(idWaterConnetion));
  });
};

const getWaterConnectionWithoutClient = () => {
  return new Promise((resolve, reject) => {
    resolve(store.listWithoutClient());
  });
};

const addWaterConnection = ({street, houseNumber, colonia, reference, dateConnection, idClient}) => {
  return new Promise((resolve, reject) => {
    resolve(store.add({
      street,
      houseNumber,
      colonia,
      reference,
      dateConnection,
      idClient
    }));
  });
};

const updateWaterConnection = ({idWaterConnection, street, houseNumber, colonia, reference, idClient}) => {
  return new Promise((resolve, reject) => {
    resolve(store.update({
      idWaterConnection,
      street,
      houseNumber,
      colonia,
      reference,
      idClient
    }));
  });
};

const deleteWaterConnection = (idWaterConnection) => {
  return new Promise((resolve, reject) => {
    resolve(store.delete(idWaterConnection));
  })
}

module.exports = {
  getWaterConnections,
  addWaterConnection,
  updateWaterConnection,
  deleteWaterConnection,
  getWaterConnectionWithoutClient
};