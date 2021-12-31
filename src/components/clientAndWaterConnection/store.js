const mySqlConnectionPromise = require("../../database/connectionPromise");
const {
  table_clients,
  table_water_connection,
  table_time_connection,
  table_debts,
  idTypeDebtConnectionPayment: ID_TYPE_DEBT_CONNECTION_PAYMENT,
  table_prices,
  idTypeClientTitular: ID_TYPE_CLIENT_TITULAR,
} = require('../../database/constants');
const { functionsDB: { queryDB } } = require('../functions');
const moment = require('moment');

const setClientAndWaterConnection = (Args) => {
  const {
    street,
    houseNumber,
    idColonia,
    reference,
    dateConnection,
    dateInitPayment,
    idClient,
    name,
    lastName,
    idTypeClient,
    idWaterConnection,
    dateInitTime,
    dateFinishTime,
    dateStartPayment,
    timeConnectionIsActive
  } = Args;

  return new Promise(async (resolve, reject) => {
    if (!street || !idColonia || !dateConnection || !name || !lastName || !idTypeClient || !dateInitTime || !dateStartPayment || !timeConnectionIsActive) {
      reject('Ingrese toda la información necesaria para agregar un cliente y una toma de agua');
      return null;
    };

    let variablesQuery = [];
    let queryWaterConnection = ``;
    let queryGetNewId = `
      SELECT
      MAX(numberConnection) AS lastId
      FROM ${table_water_connection}
      WHERE idColonia = ?;
    `;
    let queryClient = `
      INSERT INTO ${table_clients} (name, lastName, idTypeClient)
      VALUES (?, ?, ?);
    `;
    let queryTimeConnection = `
      INSERT INTO ${table_time_connection} (idWaterConnection, idClient, dateInitPayment, dateStartPayment, active)
      VALUES (?, ? ,? ,?, ?);
    `;
    const queryConnectionPayment = `
      INSERT INTO ${table_debts} SET ?;
    `;
    // console.log(queryConnectionPayment)
    const queryPrices = `
      SELECT
        id,
        price,
        latePrice,
        priceConnection,
        priceAnnuity
      FROM ${table_prices}
      WHERE idTypeClient = ? AND (dateInit <= ? AND dateFinish >= ?);
    `;
    let debtConnectionPayment = {
      idTypeDebts: ID_TYPE_DEBT_CONNECTION_PAYMENT,
      price: null,
      dateToPay: moment(dateConnection).format('YYYY-MM-DD HH:mm:ss'),
      idTimeConnection: null
    };
    const queryPricesArray = [
      ID_TYPE_CLIENT_TITULAR,
      moment(dateConnection).format('YYYY-MM-DD'),
      moment(dateConnection).format('YYYY-MM-DD')
    ];
    
    try {
      await (await mySqlConnectionPromise).beginTransaction();

      const [results] = await queryDB(queryGetNewId, [idColonia]);
      const NEW_NUMBER_CONNECTION = results[0].lastId + 1;
      const [PRICES_CLIENT] = await queryDB(queryPrices, queryPricesArray);

      if (!idClient) {
        queryWaterConnection = `INSERT INTO ${table_water_connection} (street, houseNumber, idColonia, reference, dateConnection, numberConnection)
        VALUES (?, ?, ?, ?, ?, ?);`
        variablesQuery = [street, houseNumber, idColonia, reference, dateConnection, NEW_NUMBER_CONNECTION];
      } else {
        queryWaterConnection = `INSERT INTO ${table_water_connection} (street, houseNumber, idColonia, reference, dateConnection, idClient, numberConnection)
        VALUES (?, ?, ?, ?, ?, ?, ?);`
        variablesQuery = [street, houseNumber, idColonia, reference, dateConnection, idClient, NEW_NUMBER_CONNECTION]
      }
      const [rowsWaterConnection, fieldsWaterConnection] = await queryDB(
        queryWaterConnection,
        variablesQuery
      );
      const ID_WATER_CONNECTION = rowsWaterConnection.insertId;
      const [rowsClient, fieldsClient] = await (await mySqlConnectionPromise).execute(
        queryClient,
        [name, lastName, idTypeClient]
      );
      const ID_CLIENT = rowsClient.insertId;
      const [rowsTimeConnection] = await (await mySqlConnectionPromise).execute(
        queryTimeConnection,
        [ID_WATER_CONNECTION, ID_CLIENT, dateInitTime, dateStartPayment, timeConnectionIsActive]
      );
      const ID_TIME_CONNECTION = rowsTimeConnection.insertId;
      debtConnectionPayment.idTimeConnection = ID_TIME_CONNECTION;
      debtConnectionPayment.price = PRICES_CLIENT[0].priceConnection;
      await (await mySqlConnectionPromise).query(queryConnectionPayment, [debtConnectionPayment])

      await (await mySqlConnectionPromise).commit();
      resolve('El cliente se ha agregado con exito')
    } catch (err) {
      console.log(err);
      // reject('Error al agregar el cliente y la toma de agua');
      reject(err);
    };

  });
};

module.exports = {
  add: setClientAndWaterConnection
}