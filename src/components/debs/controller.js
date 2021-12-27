const store = require('./store');

const setDeb = (idTimeConnection, deb) => {
  return new Promise((resolve, reject) => {
    resolve(store.setDeb(idTimeConnection, deb));
  });
};

module.exports = {
  setDeb
}