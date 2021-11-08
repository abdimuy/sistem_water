const mySqlConnectionPromise = require("../../database/connectionPromise");
const { table_clients, table_water_connection, table_time_connection } = require('../../database/constants');
const { functionsDB: { queryDB } } = require('../functions');
const setReport = require("../reports/setReport");

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
    // let queryEditWaterconnection = `
    //   UPDATE ${table_water_connection} SET idClient = ? WHERE id = ?;
    // `;
    let queryTimeConnection = `
      INSERT INTO ${table_time_connection} (idWaterConnection, idClient, dateInitPayment, dateStartPayment, active)
      VALUES (?, ? ,? ,?, ?);
    `


    try {
      await (await mySqlConnectionPromise).beginTransaction();

      const [results] = await queryDB(queryGetNewId, [idColonia]);
      const NEW_NUMBER_CONNECTION = results[0].lastId + 1;

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
      // const [rowsWaterConnection, fieldsWaterConnection] = await (await mySqlConnectionPromise).execute(
      //   queryWaterConnection,
      //   variablesQuery
      // );
      const ID_WATER_CONNECTION = rowsWaterConnection.insertId;

      const [rowsClient, fieldsClient] = await (await mySqlConnectionPromise).execute(
        queryClient,
        [name, lastName, idTypeClient]
      );
      const ID_CLIENT = rowsClient.insertId;
      // await (await mySqlConnectionPromise).execute(
      //   queryEditWaterconnection,
      //   [ID_CLIENT, ID_WATER_CONNECTION]
      // );
      await (await mySqlConnectionPromise).execute(
        queryTimeConnection,
        [ID_WATER_CONNECTION, ID_CLIENT, dateInitTime, dateStartPayment, timeConnectionIsActive]
      );

      createReportConnection({

      })

      await (await mySqlConnectionPromise).commit();
      resolve('El cliente se ha agregado con exito')
    } catch (err) {
      console.log(err);
      // reject('Error al agregar el cliente y la toma de agua');
      reject(err);
    };

  });
};

const createReportConnection = (args) => {
  return new Promise(async (resolve, reject) => {
    // const await setReport(args)
  })
}

module.exports = {
  add: setClientAndWaterConnection
}