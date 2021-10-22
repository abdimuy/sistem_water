const mySqlConnectionPromise = require("../../database/connectionPromise");
const { table_clients, table_water_connection } = require('../../database/constants');

const setClientAndWaterConnection = (Args) => {
  const {street, houseNumber, colonia, reference, dateConnection, dateInitPayment, idClient, name, lastName, disabled, idTypeClient, idWaterConnection} = Args;
  return new Promise(async(resolve, reject) => {
    if(!street || !colonia || !dateConnection || !name || !lastName || !idTypeClient) {
      reject('Ingrese toda la información necesaria para agregar un cliente y una toma de agua');
      return null;
    };

    let variablesQuery = [];
    let queryWaterConnection = ``;
    let queryClient = `
      INSERT INTO ${table_clients} (name, lastName, disabled, idTypeClient, idWaterConnection)
      VALUES (?, ?, ?, ?, ?);
    `;
    let queryEditWaterconnection = `
      UPDATE ${table_water_connection} SET idClient = ? WHERE id = ?;
    `;

    if(!idClient) {
      queryWaterConnection = `INSERT INTO ${table_water_connection} (street, houseNumber, colonia, reference, dateConnection, dateInitPayment)
      VALUES (?, ?, ?, ?, ?, ?);`
      variablesQuery = [street, houseNumber, colonia, reference, dateConnection, dateInitPayment];
    } else {
      queryWaterConnection = `INSERT INTO ${table_water_connection} (street, houseNumber, colonia, reference, dateConnection, dateInitPayment, idClient)
      VALUES (?, ?, ?, ?, ?, ?, ?);`
      variablesQuery = [street, houseNumber, colonia, reference, dateConnection, dateInitPayment, idClient]
    }

    try {
      await (await mySqlConnectionPromise).beginTransaction();
      const [rowsWaterConnection, fieldsWaterConnection] = await (await mySqlConnectionPromise).execute(
        queryWaterConnection,
        variablesQuery
      );
      const ID_WATER_CONNECTION = rowsWaterConnection.insertId;
      const [rowsClient, fieldsClient] = await (await mySqlConnectionPromise).execute(
        queryClient,
        [name, lastName, disabled, idTypeClient, ID_WATER_CONNECTION]
      );
      const ID_CLIENT = rowsClient.insertId;
      await (await mySqlConnectionPromise).execute(
        queryEditWaterconnection,
        [ID_CLIENT, ID_WATER_CONNECTION]
      )
      await (await mySqlConnectionPromise).commit();
      resolve('El cliente se ha agregado con exito')
    } catch(err) {
      console.log(err);
      reject('Error al agregar el cliente la toma de agua')
    };

  });
};

module.exports = {
  add: setClientAndWaterConnection
}