const express = require('express')
const router = express.Router();
const response = require('../../network/response');
const controller = require('./controller');
const controllerClient = require('../clients/controller');
const resivo = require('./resivo');

const pdf = require("html-pdf");
const fs = require("fs");


router.get('/:idReport', async (req, res) => {
  const { idReport } = req.params;
  let report;
  try {
    report = await controller.getReport(idReport);
    pdf.create(resivo(report)).toStream((error, stream) => {
      if (error) {
        res.end("Error creando PDF: ")
      } else {
        res.setHeader("Content-Type", "application/pdf");
        stream.pipe(res);
      }
    });
    
    // const client = await controllerClient.getClients(ID_CLIENT);
  } catch (err) {
    response.error({ req, res, error: 'Error al obtener el reporte', status: 500, details: err });
  };
});

module.exports = router;