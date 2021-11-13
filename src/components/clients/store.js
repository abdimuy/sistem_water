const mySqlConnection = require('../../database/connection');
const {
  table_clients,
  table_transaction,
  table_water_connection,
  table_type_clients,
  table_client_level,
  table_time_connection,
  table_prices,
  table_reports,
  table_colonias,
  table_type_transactions,
  table_debts,
  table_type_debts
} = require('../../database/constants');
const { functionsDB: { queryDB } } = require('../functions');
const moment = require('moment');

const getClients = (idClient) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        ${table_clients}.id,
        ${table_clients}.name,
        ${table_clients}.lastName,
        ${table_water_connection}.street,
        ${table_water_connection}.houseNumber,
        ${table_water_connection}.reference,
        ${table_water_connection}.id AS idWaterConnection,
        ${table_water_connection}.dateConnection,
        concat(${table_water_connection}.numberConnection, ' - ', ${table_colonias}.name) AS numberWaterConnection,
        ${table_colonias}.name AS colonia, 
        ${table_type_clients}.id AS idTypeClient,
        ${table_type_clients}.name AS typeClient,
        ${table_client_level}.id AS idClientLevel,
        ${table_client_level}.clientLevel,
        ${table_clients}.disabled,
        ${table_time_connection}.id AS idTimeConnection,
        ${table_time_connection}.dateStartPayment
      FROM ${table_clients}
      INNER JOIN ${table_time_connection} ON ${table_clients}.id = ${table_time_connection}.idClient
      INNER JOIN ${table_water_connection} ON ${table_time_connection}.idWaterConnection = ${table_water_connection}.id
      INNER JOIN ${table_type_clients} ON ${table_clients}.idTypeClient = ${table_type_clients}.id
      INNER JOIN ${table_client_level} ON ${table_type_clients}.idClientLevel = ${table_client_level}.id
      INNER JOIN ${table_colonias} ON ${table_water_connection}.idColonia = ${table_colonias}.id
      WHERE ${table_time_connection}.active = 1
    `;
    let variablesQuery = [];

    if (idClient) {
      query += `AND ${table_clients}.id = ?`
      variablesQuery = [idClient];
    };

    mySqlConnection.query(
      query,
      variablesQuery,
      async (err, results, fields) => {
        if (!err) {
          resolve(idClient ? results[0] : results);
        } else {
          console.log(err);
          reject(err);
        };
      }
    );

  });
};


const getTransactionsClients = async (arrayOrObject) => {
  return new Promise(async (resolve, reject) => {
    let newArray = [];
    const queryTransactions = `
      SELECT
        ${table_transaction}.id,
        ${table_type_transactions}.name,
        ${table_transaction}.amount,
        ${table_transaction}.date,
        ${table_transaction}.note,
        ${table_transaction}.dateCreate
      FROM ${table_transaction}
      INNER JOIN ${table_reports} ON ${table_transaction}.idReport = ${table_reports}.id
      INNER JOIN ${table_time_connection} ON ${table_reports}.idTimeConnection = ${table_time_connection}.id
      INNER JOIN ${table_type_transactions} ON ${table_transaction}.idTypeTransaction = ${table_type_transactions}.id
      WHERE ${table_time_connection}.id = ?
      `;
    const queryPrices = `
      SELECT
        id AS idPrice,
        price,
        latePrice,
        dateInit,
        dateFinish,
        priceAnnuity,
        priceConnection,
        idTypeClient
      FROM ${table_prices}
      ORDER BY idTypeClient ASC, dateInit ASC
      ;
    `

    try {
      const waterConnectionPrices = await getData(queryPrices, []);
      // console.log({ waterConnectionPrices });

      if (Array.isArray(arrayOrObject)) {
        const arrayClients = arrayOrObject;
        for (const client of arrayClients) {
          const { idTypeClient: ID_TYPE_CLIENT, dateStartPayment, idTimeConnection: ID_TIME_CONNECTION } = client;
          // console.log({ ID_TYPE_CLIENT, dateStartPayment, ID_TIME_CONNECTION });
          const transactionsClients = await getData(queryTransactions, [ID_TIME_CONNECTION]);
          const latePayments = await generateLatePayment({
            idTimeConnection: ID_TIME_CONNECTION,
            idTypeClient: ID_TYPE_CLIENT,
            prices: waterConnectionPrices,
            dateStartClient: dateStartPayment,
            paymentsArray: transactionsClients
          });
          newArray.push({ ...client, transactions: transactionsClients, latePayments });
        };
        resolve(newArray);
      } else {
        const { idTimeConnection: ID_TIME_CONNECTION, idTypeClient: ID_TYPE_CLIENT, dateStartPayment } = arrayOrObject;
        const transactionsClients = await getData(queryTransactions, [ID_TIME_CONNECTION]);
        // console.log({ dateStartPayment })
        const latePayments = await generateLatePayment({
          idTimeConnection: ID_TIME_CONNECTION,
          idTypeClient: ID_TYPE_CLIENT,
          prices: waterConnectionPrices,
          dateStartClient: dateStartPayment,
          paymentsArray: transactionsClients
        });
        resolve([{
          ...arrayOrObject,
          transactions: transactionsClients,
          latePayments
        }]);
      };

    } catch (err) {
      console.log(err);
      reject('Error al unir las transacciones con los clientes');
    };
  });
};

const getData = (query, arrayVariables) => {
  return new Promise((resolve, reject) => {
    mySqlConnection.query(
      query,
      arrayVariables,
      (err, results, fields) => {
        if (!err) {
          resolve(results);
        } else {
          console.log('Error al hacer la consulta con la base de datos');
          reject(err);
        }
      }
    );
  });
};

const generateLatePayment = async ({ idTimeConnection, idTypeClient, prices, dateStartClient, paymentsArray }) => {
  // console.log({prices, idTypeClient})
  if (!Array.isArray(paymentsArray) || paymentsArray === undefined) {
    paymentsArray = [];
  };

  let paymentList = [];
  const newDateStartClient = moment(dateStartClient);
  // console.log({ newDateStartClient, dateStartClient });
  const dateCurrent = moment();
  const newPrices = prices.filter(price => price.idTypeClient === idTypeClient);

  try {
    const debts = await getDebts(idTimeConnection);
    console.log({ debts });
    const editPrices = newPrices.map(price => {
      return price.dateFinish ?
        ({
          ...price,
          dateInit: moment(moment(price.dateInit).format('YYYY-MM-DD')).format(),
          dateFinish: moment(moment(price.dateFinish).format('YYYY-MM-DD')).format(),
        }) : ({
          ...price,
          dateInit: moment(moment(price.dateInit).format('YYYY-MM-DD')).format()
        });
    });
    // console.log(editPrices)
  
    let indexDateStart = editPrices.findIndex(price => newDateStartClient < moment(price.dateInit));

    // console.log({ newDateStartClient })
    // console.log({ indexDateStart })
    if (indexDateStart === -1) {
      indexDateStart = editPrices.length - 1;
    } else {
      indexDateStart -= 1
    }
    // console.log({ indexDateStart })
    let numberMonths = dateCurrent.diff(newDateStartClient, 'months', true);
    numberMonths = numberMonths % 1 === 0 ? numberMonths + 1 : Math.ceil(numberMonths);
    // console.log({ numberMonths })
  
    // let dateStartPayment = newDateStartClient;
    for (let i = 0; i < numberMonths; i++) {
      // console.log(dateStartPayment)
      const dateMonthlyPayment = moment(newDateStartClient).add(i, 'month')
      const paymentExist = paymentsArray.find(payment => moment(payment.date).year() === dateMonthlyPayment.year() && moment(payment.date).month() === dateMonthlyPayment.month())
      if (paymentExist !== undefined) {
        // console.log('Ya existe un pago para este mes');
        // console.log('No se agrego el pago con fecha: ', dateMonthlyPayment);
        continue;
      }
      // console.log({ dateMonthlyPayment, editPrices })
      const selectedPrice = editPrices.find(price => dateMonthlyPayment >= moment(price.dateInit) && dateMonthlyPayment < moment(price.dateFinish));
      // console.log({ selectedPrice })
  
      const typePaymentMonth = dateMonthlyPayment.month();
      const typePaymentYear = dateMonthlyPayment.year();
      // console.log({typePaymentMonth, comparate1: moment().month(), typePaymentYear, comparate2: moment().year()})
      const typePayment = dateCurrent.month() === typePaymentMonth && dateCurrent.year() === typePaymentYear ?
        ('Pago pendiente') :
        ('Pago atrasado');
      const price = typePayment === 'Pago atrasado' ? selectedPrice.latePrice : selectedPrice.price

      // console.log({price, typePayment})
      const monthlyPayment = { date: dateMonthlyPayment, price: price, typePayment, idTypeTransaction: 1 };

      
      
      if(typePaymentMonth === 0) {

        const anualPayment = {
          date: dateMonthlyPayment,
          price: selectedPrice.priceAnnuity,
          name: 'Pago de mantenimiento anual',
          typePayment: 'Pago pendiente'
        };
        paymentList = [...paymentList, anualPayment, monthlyPayment];
      } else {
        paymentList = [...paymentList, monthlyPayment];
      };
      // paymentList = [...paymentList, {dateStartPayment: moment(newDateStartClient).add(i, 'month').format('YYYY-MM-DD')}]
    };
  
    // console.log(paymentList)
    paymentList = [...debts, ...paymentList].sort((a, b) => moment(a.date).diff(moment(b.date)));
    // console.log(paymentList.map((payment, index) => ({...payment, order: index + 1})));
    return paymentList.map((payment, index) => ({...payment, order: index + 1}));
  } catch (err) {
    console.log(err);
  }


};

const getDebts = (idTimeConnection) => {
  return new Promise(async (resolve, reject) => {
    if (!idTimeConnection) {
      reject('No se recibio el id de la conexion');
    };
    const query = `
      SELECT 
        ${table_debts}.id,
        ${table_type_debts}.name,
        ${table_debts}.note,
        ${table_debts}.dateToPay AS date,
        ${table_debts}.price
      FROM ${table_debts}
      INNER JOIN ${table_type_debts} ON ${table_debts}.idTypeDebts = ${table_type_debts}.id
      WHERE (${table_debts}.idTimeConnection = ? AND ${table_debts}.isPaid = 0);
    `;

    try {
      const [debts] = await queryDB(query, [idTimeConnection]);
      // console.log({ debts, idTimeConnection });
      resolve(debts);
    } catch (err) {
      console.log(err);
      reject('Error al obtener las deudas');
    }
  });
};

const setClient = ({ name, lastName, disabled, idTypeClient, idWaterConnection }) => {
  return new Promise((resolve, reject) => {
    // console.log({name, lastName, disabled, idTypeClient, idWaterConnection})
    if (!name || !lastName || !idTypeClient) {
      reject('Agregue toda la informacion necesaria para agregar un cliente');
      return null;
    }
    let variablesQuery = [];
    let query = ``;
    if (!idWaterConnection) {
      query = `
        INSERT INTO ${table_clients} (name, lastName, disabled, idTypeClient)
        VALUES (?, ?, ?, ?)
      `;
      variablesQuery = [name, lastName, disabled, idTypeClient];
    } else {
      query = `
        INSERT INTO ${table_clients} (name, lastName, disabled, idTypeClient, idWaterConnection)
        VALUES (?, ?, ?, ?, ?)
      `;
      variablesQuery = [name, lastName, disabled, idTypeClient, idWaterConnection];
    };

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if (!err) {
          resolve('Cliente agregado con exito');
        } else {
          console.log(err);
          reject(err)
          return null
        };
      }
    );
  });
};

const addSeparator = (element => element ? ',' : '');

const updateClient = ({ idClient, name, lastName, disabled, idTypeClient, idWaterConnection }) => {
  // console.log({ idClient, name, lastName, disabled, idTypeClient, idWaterConnection })
  return new Promise((resolve, reject) => {
    if (!idClient) {
      reject('Agregue el id del cliente');
      return null
    };
    if (!name && !lastName && !disabled && !idTypeClient && !idWaterConnection) {
      reject('Agregue información para actualizar');
      return null
    };

    let variablesQuery = [];

    let query = `UPDATE ${table_clients}
      SET 
        ${name ? (variablesQuery.push(name), `name = ?`) : ''}
        ${lastName ? (variablesQuery.push(lastName), `${addSeparator(name)}lastName = ?`) : ''}
        ${!isNaN(disabled) ? (variablesQuery.push(disabled), `${addSeparator(lastName || name)}disabled = ?`) : ''}
        ${idTypeClient ? (variablesQuery.push(idTypeClient), `${addSeparator(disabled || lastName || name)}idTypeClient = ?`) : ''}
        ${idWaterConnection ? (variablesQuery.push(idWaterConnection), `${addSeparator(idTypeClient || disabled || lastName || name)}idWaterConnection = ?`) : ''}
      WHERE id = ?
    `;
    variablesQuery.push(idClient);

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if (!err) {
          resolve('Cliente actualizado correctamente');
        } else {
          console.log(err);
          reject('Error al actualizar el cliente');
        };
      }
    );
  });
};


const deleteClient = (idClient) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM ${table_clients} WHERE id = ?`;
    mySqlConnection.query(
      query,
      [idClient],
      (err, results, fields) => {
        if (!err) {
          resolve('Cliente eliminado exitosamente');
        } else {
          console.log(err);
          reject('Error al eliminar usuario');
        };
      }
    );
  });
};

module.exports = {
  list: getClients,
  add: setClient,
  update: updateClient,
  delete: deleteClient,
  list_transactions: getTransactionsClients
};