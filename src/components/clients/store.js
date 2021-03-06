const mySqlConnection = require('../../database/connection');
const mySqlConnectionPromise = require('../../database/connectionPromise');
const { querysClients } = require('./querys')
const {
  table_clients,
  table_transaction,
  table_time_connection,
  table_prices,
  table_reports,
  table_type_transactions,
  table_debts,
  table_type_debts,
  idTypeTransactionPagoPorMantenimiento: ID_TYPE_TRANSACTION_PAGO_POR_MANTENIMIENTO,
  idTypeClientTitular: ID_TYPE_CLIENT_TITULAR,
  idTypeClientHidrante: ID_TYPE_CLIENT_HIDRANTE,
  idTypeTransactionPagoMensual,
  idTypeTransactionPagoPorConexion,
  ID_TYPE_DEBTS_MANTENIMIENTO_ANUAL,
  ID_TYPE_DEBTS_MONTHLY_PAYMENT,
  idTypeTransactionPagoPorMantenimiento,
  idIgnoreTransaction,
} = require('../../database/constants');
const { functionsDB: { queryDB } } = require('../functions');
const moment = require('moment');

const getClients = ({ idClient, typeClient = ID_TYPE_CLIENT_TITULAR }) => {
  const { getAllClients, getOnlyHidrantes } = querysClients
  return new Promise(async (resolve, reject) => {
    let query = getAllClients;
    let variablesQuery = [];
    let queryWithIdClient = query;
    let queryWithHidrantes = query;


    if (idClient) {
      queryWithIdClient += `AND ${table_clients}.id = ?`
      variablesQuery = [idClient];
    };
    try {
      if (idClient !== undefined) {
        const [results] = await queryDB(queryWithIdClient, variablesQuery);
        const [allResults] = await queryDB(getOnlyHidrantes);
        const clients = results.map(clientTitular => {
          if (clientTitular.idTypeClient === ID_TYPE_CLIENT_TITULAR) {
            clientTitular.hidrantes = allResults.filter(client => (
              client.idWaterConnection === clientTitular.idWaterConnection &&
              client.idTypeClient === ID_TYPE_CLIENT_HIDRANTE
            ));
          } else {
            clientTitular.hidrantes = [];
          }
          return clientTitular;
        });

        resolve(clients[0]);
      } else {
        const [results] = await queryDB(query, variablesQuery);
        const clients = results.map(clientTitular => {
          if (clientTitular.idTypeClient === ID_TYPE_CLIENT_TITULAR) {
            clientTitular.hidrantes = results.filter(client => (
              client.idWaterConnection === clientTitular.idWaterConnection &&
              client.idTypeClient === ID_TYPE_CLIENT_HIDRANTE
            ));
          } else {
            clientTitular.hidrantes = [];
          }
          return clientTitular;
        });

        resolve(clients);
      }
    } catch (err) {
      console.log(err);
      reject(err);
    };
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
        ${table_transaction}.dateCreate,
        ${table_transaction}.idTypeTransaction,
        ${table_type_transactions}.name,
        ${table_reports}.id AS idReport,
        ${table_time_connection}.id AS idTimeConnection
      FROM ${table_transaction}
      INNER JOIN ${table_reports} ON ${table_transaction}.idReport = ${table_reports}.id
      INNER JOIN ${table_time_connection} ON ${table_reports}.idTimeConnection = ${table_time_connection}.id
      INNER JOIN ${table_type_transactions} ON ${table_transaction}.idTypeTransaction = ${table_type_transactions}.id
      WHERE ${table_time_connection}.id = ?
      ORDER BY ${table_transaction}.date ASC;
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
      ORDER BY idTypeClient ASC, dateInit ASC;
    `;
    try {
      const waterConnectionPrices = await getData(queryPrices, []);
      // console.log({ waterConnectionPrices });

      if (Array.isArray(arrayOrObject)) {
        const arrayClients = arrayOrObject;

        for (const client of arrayClients) {
          const {
            idTypeClient: ID_TYPE_CLIENT,
            dateStartPayment,
            idTimeConnection: ID_TIME_CONNECTION,
            name: NAME_CLIENT,
            lastName: LAST_NAME_CLIENT,
          } = client;
          let latePaymentsHidrantes = []
          // console.log({ ID_TYPE_CLIENT, dateStartPayment, ID_TIME_CONNECTION });
          const transactionsClients = await getData(queryTransactions, [ID_TIME_CONNECTION]);
          const [latePayments, totalLastPayments] = await generateLatePayment({
            idTimeConnection: ID_TIME_CONNECTION,
            idTypeClient: ID_TYPE_CLIENT,
            prices: waterConnectionPrices,
            dateStartClient: dateStartPayment,
            paymentsArray: transactionsClients,
            fullName: `${NAME_CLIENT} ${LAST_NAME_CLIENT}`,
          });

          for (const hidrante of client.hidrantes) {
            const {
              idTimeConnection: ID_TIME_CONNECTION_HIDRANTE,
              idTypeClient: ID_TYPE_CLIENT_HIDRANTE,
              dateStartPayment: DATE_START_PAYMENT_HIDRANTE,
              name: NAME_HIDRANTE,
              lastName: LAST_NAME_HIDRANTE,
            } = hidrante;
            const transactionsHidrante = await getData(queryTransactions, [ID_TIME_CONNECTION_HIDRANTE]);
            const [latePaymentsHidrante] = await generateLatePayment({
              idTimeConnection: ID_TIME_CONNECTION_HIDRANTE,
              idTypeClient: ID_TYPE_CLIENT_HIDRANTE,
              prices: waterConnectionPrices,
              dateStartClient: DATE_START_PAYMENT_HIDRANTE,
              paymentsArray: transactionsHidrante,
              fullName: `${NAME_HIDRANTE} ${LAST_NAME_HIDRANTE}`,
            });
            // hidrante.latePayments = latePaymentsHidrante;
            latePaymentsHidrantes.push(...latePaymentsHidrante);
          };
          const transactionsClientsAndHidrantes = sumarPagosConLaMismaFecha(latePayments, latePaymentsHidrantes);
          newArray.push({
            ...client,
            totalLastPayments,
            transactions: transactionsClients,
            latePayments: transactionsClientsAndHidrantes,
          });
        };
        resolve(newArray);
      } else {
        const {
          idTimeConnection: ID_TIME_CONNECTION,
          idTypeClient: ID_TYPE_CLIENT,
          dateStartPayment,
          name: NAME_CLIENT,
          lastName: LAST_NAME_CLIENT,
        } = arrayOrObject;
        const client = arrayOrObject;
        const transactionsClients = await getData(queryTransactions, [ID_TIME_CONNECTION]);
        // console.log({ dateStartPayment })
        const [latePayments, totalLastPayments] = await generateLatePayment({
          idTimeConnection: ID_TIME_CONNECTION,
          idTypeClient: ID_TYPE_CLIENT,
          prices: waterConnectionPrices,
          dateStartClient: dateStartPayment,
          paymentsArray: transactionsClients,
          fullName: `${NAME_CLIENT} ${LAST_NAME_CLIENT}`,
        });
        let latePaymentsHidrantes = []
        // console.log({client})
        for (const hidrante of client.hidrantes) {
          const {
            idTimeConnection: ID_TIME_CONNECTION_HIDRANTE,
            idTypeClient: ID_TYPE_CLIENT_HIDRANTE,
            dateStartPayment: DATE_START_PAYMENT_HIDRANTE,
            name: NAME_HIDRANTE,
            lastName: LAST_NAME_HIDRANTE,
          } = hidrante;
          const transactionsHidrante = await getData(queryTransactions, [ID_TIME_CONNECTION_HIDRANTE]);
          const [latePaymentsHidrante] = await generateLatePayment({
            idTimeConnection: ID_TIME_CONNECTION_HIDRANTE,
            idTypeClient: ID_TYPE_CLIENT_HIDRANTE,
            prices: waterConnectionPrices,
            dateStartClient: DATE_START_PAYMENT_HIDRANTE,
            paymentsArray: transactionsHidrante,
            fullName: `${NAME_HIDRANTE} ${LAST_NAME_HIDRANTE}`,
          });
          // hidrante.latePayments = latePaymentsHidrante;
          latePaymentsHidrantes.push(...latePaymentsHidrante);
        };
        const transactionsClientsAndHidrantes = sumarPagosConLaMismaFecha(latePayments, latePaymentsHidrantes);
        resolve([{
          ...arrayOrObject,
          totalLastPayments,
          transactions: transactionsClients,
          latePayments: transactionsClientsAndHidrantes,
        }]);
      };

    } catch (err) {
      console.log(err);
      reject('Error al unir las transacciones con los clientes');
    };
  });
};

const sumarPagosConLaMismaFecha = (pagosTitular, pagosHidrantes) => {
  // console.log(pagosHidrantes)
  // console.log(pagosTitular)
  let newArray = [];
  let primaryPagos;
  let secondaryPagos;
  // if(pagosTitular.length > pagosHidrantes.length) {
  primaryPagos = pagosTitular;
  secondaryPagos = pagosHidrantes;
  // } else {
  //   primaryPagos = pagosHidrantes;
  //   secondaryPagos = pagosTitular;
  // };

  for (const primaryClient of primaryPagos) {
    const { date: DATE_TO_PAY_TITULAR, price: PRICE_TO_PAY_TITULAR, name: TYPE_PAYMENT } = primaryClient;
    const pagosHidranteSelected = secondaryPagos.filter(pagoHidrante => {
      const { date: DATE_TO_PAY_HIDRANTE } = pagoHidrante;
      return (
        moment(DATE_TO_PAY_TITULAR).isSame(moment(DATE_TO_PAY_HIDRANTE), 'month') &&
        TYPE_PAYMENT === 'PAGO MENSUAL'
      );
    });
    // console.log({pagosHidranteSelected})
    const listPagosHidrantes = pagosHidranteSelected.map(pagoHidrante => pagoHidrante.price);
    let newPayment = {
      ...primaryClient,
      date: DATE_TO_PAY_TITULAR,
      price: sumar(...listPagosHidrantes, PRICE_TO_PAY_TITULAR),
      note: secondaryPagos.length > 0 ?
        (`TITULAR: $${primaryClient.price} HIDRANTES: ${pagosHidranteSelected === 0 ?
          'No hay pagos de hidrantes' :
          pagosHidranteSelected.map(pagoHidrante => `${pagoHidrante.fullName} $${pagoHidrante.price}`).join(',\n ')
          }`)
        :
        '',
      paymentToReport: [primaryClient, ...pagosHidranteSelected],
    }
    newArray.push(newPayment);
  };
  return newArray;
};

const sumar = (...numbers) => {
  return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

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

const generateLatePayment = async ({ idTimeConnection, idTypeClient, prices, dateStartClient, paymentsArray, fullName }) => {
  if (!Array.isArray(paymentsArray) || paymentsArray === undefined) {
    paymentsArray = [];
  };

  try {

    let paymentList = [];
    const newDateStartClient = moment(dateStartClient);
    const dateCurrent = moment();
    const newPrices = prices.filter(price => price.idTypeClient === idTypeClient);

    const debts = await getDebts(idTimeConnection);
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

    let indexDateStart = editPrices.findIndex(price => newDateStartClient < moment(price.dateInit));

    if (indexDateStart === -1) {
      indexDateStart = editPrices.length - 1;
    } else {
      indexDateStart -= 1
    }
    let numberMonths = dateCurrent.diff(newDateStartClient, 'months', true);
    numberMonths = numberMonths % 1 === 0 ? numberMonths + 1 : Math.ceil(numberMonths);
    numberMonths += 24;
    let countLastPayments = 0;
    
    for (let i = 0; i < numberMonths; i++) {
      const dateMonthlyPayment = moment(newDateStartClient).add(i, 'month');
      const paymentExist = paymentsArray.find(payment => {
        // return moment(payment.date).year() === dateMonthlyPayment.year() && moment(payment.date).month() === dateMonthlyPayment.month()
        return moment(payment.date).isSame(dateMonthlyPayment, 'month') && payment?.idTypeTransaction === idTypeTransactionPagoMensual
      });

      const selectedPrice = editPrices.find(price => dateMonthlyPayment >= moment(price.dateInit) && dateMonthlyPayment < moment(price.dateFinish));
      const typePaymentMonth = dateMonthlyPayment.month();

      if (typePaymentMonth === 11 && idTypeClient === ID_TYPE_CLIENT_TITULAR) {

        const paymentAnualExist = paymentsArray.find(payment => {
          return moment(payment.date).isSame(moment(dateMonthlyPayment), 'year') && payment.idTypeTransaction === 4;
        });

        if (paymentAnualExist === undefined) {
          const anualPayment = {
            date: dateMonthlyPayment,
            price: selectedPrice.priceAnnuity,
            name: 'PAGO POR MANTENIMIENTO ANUAL',
            typePayment: 'Pago pendiente',
            idTypeTransaction: ID_TYPE_TRANSACTION_PAGO_POR_MANTENIMIENTO,
            idTimeConnection,
            fullName,
            idTypeDebts: ID_TYPE_DEBTS_MANTENIMIENTO_ANUAL,
          };
          paymentList = [...paymentList, anualPayment];
        }
      };

      if (paymentExist !== undefined) {
        continue;
      }

      // const typePaymentYear = dateMonthlyPayment.year();
      const typePayment = createTypePayment({
        dateCurrent,
        dateMonthlyPayment
      }) ? ('Pago pendiente') : ('Pago atrasado');

      if(typePayment === 'Pago atrasado'){
        countLastPayments++;
      }

      const price = typePayment === 'Pago atrasado' ? selectedPrice.latePrice : selectedPrice.price

      const monthlyPayment = {
        date: dateMonthlyPayment,
        price: price,
        typePayment,
        idTypeTransaction: 1,
        name: 'PAGO MENSUAL',
        idTimeConnection,
        fullName,
        idTypeDebts: ID_TYPE_DEBTS_MONTHLY_PAYMENT,
      };

      paymentList = [...paymentList, monthlyPayment];
      // paymentList = [...paymentList, {dateStartPayment: moment(newDateStartClient).add(i, 'month').format('YYYY-MM-DD')}]
    };


    // console.log(paymentList)
    paymentList = [...debts, ...paymentList].sort(compare);
    let acumPayment = 0;
    const orderedPayments = paymentList.map((payment, index) => {
      if ([
        idTypeTransactionPagoMensual,
        idTypeTransactionPagoPorConexion,
        // idTypeTransactionPagoPorMantenimiento
      ].includes(payment.idTypeTransaction)) {
        acumPayment += 1;
        return ({
          ...payment,
          order: acumPayment
        });
      } else {
        return ({
          ...payment,
          order: idIgnoreTransaction
        });
      }
    });
    return [orderedPayments, countLastPayments];
  } catch (err) {
    console.log(err);
  }
};

const compare = (a, b) => {
  if (moment(a.date).isAfter(moment(b.date), 'day')) return 1;
  else if (moment(a.date).isBefore(moment(b.date), 'day')) return -1;
  else {
    if (a.idTypeDebts < b.idTypeDebts) return -1;
    else if (a.idTypeDebts > b.idTypeDebts) return 1;
    return 0;
  };
};

const createTypePayment = ({ dateCurrent, dateMonthlyPayment }) => {
  return moment(dateCurrent).isSameOrBefore(dateMonthlyPayment, 'month');
}

const getDebts = (idTimeConnection) => {
  return new Promise(async (resolve, reject) => {
    if (!idTimeConnection) {
      reject('No se recibio el id de la conexion');
    };
    const query = `
      SELECT 
        ${table_debts}.id,
        ${table_type_debts}.name AS typePayment,
        ${table_debts}.note,
        ${table_debts}.dateToPay AS date,
        ${table_debts}.price,
        ${table_type_debts}.idTypeTransaction,
        ${table_debts}.idTypeDebts
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

const getHidrantes = (idHidrante) => {
  return new Promise(async(resolve, reject) => {
    const {
      getHidrantes: GET_HIDRANTES,
      getOneHidrante: GET_ONE_HIDRANTE,
    } = querysClients;
    try {
      if (idHidrante) {
        const [results] = await queryDB(GET_ONE_HIDRANTE, [idHidrante])
        resolve(results);
      } else {
        const [results] = await queryDB(GET_HIDRANTES, []);
        resolve(results);
      }
    } catch (err) {
      reject(err);
    }
  });
};

const getOnlyHidrantes = (idHidrante) => {
  return new Promise(async(resolve, reject) => {
    const {
      getOnlyHidrantes: GET_ONLY_HIDRANTES,
      getOnlyOneHidrante: GET_ONLY_ONE_HIDRANTE,
    } = querysClients;
    try {
      if(idHidrante) {
        const [results] = await queryDB(GET_ONLY_ONE_HIDRANTE, [idHidrante]);
        resolve(results);
      } else {
        const [results] = await queryDB(GET_ONLY_HIDRANTES, []);
        resolve(results);
      }
    } catch (err) {
      reject(err);
    }
  })
}

const setClientHidrante = (data) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      lastName,
      disabled,
      idTypeClient,
      idWaterConnection,
      dateInitPayment,
      active,
      dateStartPayment
    } = data;

    const client = {
      name,
      lastName,
      disabled,
      idTypeClient
    }

    const timeConnection = {
      idWaterConnection,
      dateInitPayment,
      active,
      dateStartPayment
    };
    if (!name || !lastName || !idTypeClient || !idWaterConnection || !dateInitPayment || !active || !dateStartPayment) {
      reject('Agregue toda la informacion necesaria para agregar un cliente');
      return null;
    };

    let variablesQuery = [];
    let query = ``;

    query = `
      INSERT INTO ${table_clients} SET ?
    `;
    variablesQuery = [client];
    const queryTimeConnection = `
      INSERT INTO ${table_time_connection} SET ?
    `;

    try {
      (await mySqlConnectionPromise).beginTransaction()
      // const [rowsClient] = await queryDB(query, variablesQuery)
      const [rowsClient] = await (await mySqlConnectionPromise).query(query, variablesQuery)
      const ID_CLIENT = rowsClient.insertId;
      timeConnection.idClient = ID_CLIENT;
      // const [rowsTimeConnection] = await queryDB(queryTimeConnection, [timeConnection]);
      const [rowsTimeConnection] = await (await mySqlConnectionPromise).query(queryTimeConnection, [timeConnection]);
      (await mySqlConnectionPromise).commit();
      resolve('Hidrante agregado con exito');
    }
    catch (err) {
      (await mySqlConnectionPromise).rollback()
      console.log(err)
      reject(err)
    }


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
      reject('Agregue informaci??n para actualizar');
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
  list_hidrantes: getHidrantes,
  list_only_hidrantes: getOnlyHidrantes,
  add: setClientHidrante,
  update: updateClient,
  delete: deleteClient,
  list_transactions: getTransactionsClients
};