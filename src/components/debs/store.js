const mySqlConnection = require('../../database/connectionPromise');
const moment = require('moment');
const { checkIsUndifinedObj } = require('../functions');

const setDeb = (idTimeConnection, deb) => {
  return new Promise(async (resolve, reject) => {
    
    const {
      idTypeDebts,
      price,
      note,
      dateToPay,
      isPaid = 0,
      dateCreate = moment().format('YYYY-MM-DD HH:mm:ss')
    } = deb;
    const paramsRequired = {
      idTypeDebts,
      price,
      dateToPay,
      idTimeConnection
    }
    if(checkIsUndifinedObj(paramsRequired)) {
      reject('Falto algun parametro requerido');
      return null;
    }
    const dataDeb = {
      idTypeDebts,
      price,
      note,
      isPaid,
      dateCreate,
      dateToPay,
      idTimeConnection
    }
    const query = `INSERT INTO debts SET ?`;
    try {
      const result = await (await mySqlConnection).query(query, [dataDeb]);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};



module.exports = {
  setDeb
}