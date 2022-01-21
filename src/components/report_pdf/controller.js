const controller = require('../clients/controller');
const controllerReport = require('../reports/controller');
const { table_signing } = require('../../database/constants');
const { functionsDB: { queryDB } } = require('../functions');

const getReport = (idReport) => {
  return new Promise(async (resolve, reject) => {
    let report;
    try {
      report = await controllerReport.getReportsClient(idReport);
      const signings = await getSignins();
      const urlSignings = [
        {
          url: "http://localhost:3000/firma1.png",
          name: signings[0]?.name
        },
        {
          url: "http://localhost:3000/firma2.png",
          name: signings[1]?.name
        }
      ]
      // report = report[0];
      const ID_CLIENT = report[0].idClient;
      let client = await controller.getClients(ID_CLIENT);
      client = client[0];
      const clientDetails = {
        name: client.name,
        lastName: client.lastName,
        street: client.street,
        houseNumber: client.houseNumber,
        colonia: client.colonia,
        numberWaterConnection: client.numberWaterConnection,
        typeClient: client.typeClient,
        urlSignings
      }

      resolve({
        ...clientDetails,
        report: report[0]
      });
    } catch (err) {
      reject(err);
    }
  })
};

const getSignins = (idName) => {
  return new Promise(async(resolve, reject) => {
    let query = `
      SELECT
        ${table_signing}.id,
        ${table_signing}.name
      FROM ${table_signing}
      `;

      if( idName !== undefined ) {
        query += `WHERE ${table_signing}.id = ${idName}`;
      };

    try {
      const [signings] = await queryDB(query);
      resolve(signings);
    } catch (err) {
      reject(err);
    };

  });
};

const updateSigningName = (idSigning, name) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE ${table_signing}
      SET name = '${name}'
      WHERE id = ${idSigning}
    `;

    try {
      queryDB(query);
      resolve('El nombre de la firma se ha actualizado correctamente');
    } catch (err) {
      reject(err);
    };
  })
}

module.exports = {
  getReport,
  getSignins,
  updateSigningName
}