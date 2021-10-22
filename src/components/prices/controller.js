const store = require('./store');

const getPrices = (idPrice) => {
  return new Promise((resolve, reject) => {
    resolve(store.list(idPrice));
  });
};

const setPrice = (priceArgs) => {
  return new Promise((resolve, reject) => {
    resolve(store.add(priceArgs));
  });
};

const updatePrice = (priceArgs) => {
  return new Promise((resolve, reject) => {
    resolve(store.update(priceArgs))
  });
};

const deletePrice = (idPrice) => {
  return new Promise((resolve, reject) => {
    resolve(store.delete(idPrice))
  });
};

module.exports = {
  getPrices,
  setPrice,
  updatePrice,
  deletePrice
};