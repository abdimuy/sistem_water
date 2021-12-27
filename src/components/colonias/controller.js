const store = require('./store');

const getColonias = () => {
  return new Promise((resolve, reject) => {
    resolve(store.getColonias());
  });
};

const setColonia = (name) => {
  return new Promise((resolve, reject) => {
    resolve(store.setColonia(name));
  });
};

const updateColonia = (idColonia, name) => {
  return new Promise((resolve, reject) => {
    resolve(store.updateColonia(idColonia, name));
  });
};

const deleteColonia = (idColonia) => {
  return new Promise((resolve, reject) => {
    resolve(store.deleteColonia(idColonia));
  });
}

module.exports = {
  getColonias,
  setColonia,
  updateColonia,
  deleteColonia
}