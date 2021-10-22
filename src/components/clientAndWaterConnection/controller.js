const store = require('./store');

const setClientAndWaterConnection = (args) => {
  return new Promise((resolve, reject) => {
    resolve(store.add(args));
  });
};

module.exports = {
  setClientAndWaterConnection
}