const contentHTML = require('./resivo.js');
const fs = require('fs');
const controller = require('../clients/controller');
const controllerReport = require('../reports/controller')

const getReport = (idReport) => {
  return new Promise(async(resolve, reject) => {
    let report;
    try {
      report = await controllerReport.getReportsClient(idReport);
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

module.exports = {
  getReport
}