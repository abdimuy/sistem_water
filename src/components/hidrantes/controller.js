const store = require('./store');
const controllerClients = require('../clients/controller');

const unsubscribeHidrante = (idHidrante) => {
  return new Promise((resolve, reject) => {
    resolve(store.unsubscribeHidrante(idHidrante));
  });
};

const validateHidrante = (idHidrante) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hidrantes = await controllerClients.getHidrantes(idHidrante);
      const hidrante = hidrantes[0];
      const hidrantesWithTransactions = await controllerClients.getClients(hidrante.titular.id);
      const hidranteWithTransactions = hidrantesWithTransactions[0];
      // reject(false)
      if(hidranteWithTransactions.totalLastPayments > 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    } catch(err) {
      reject(err)
    }
  });
};

module.exports = {
  unsubscribeHidrante,
  validateHidrante
}