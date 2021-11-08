const express = require('express');
const controller = require('./controller');
const response = require('../../network/response');

const router = express.Router();

router.post('/', (req, res) => {
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
    disabled,
    idTypeClient,
    idWaterConnection,
    dateInitTime,
    dateFinishTime,
    dateStartPayment,
    timeConnectionIsActive
  } = req.body;
  controller.setClientAndWaterConnection({
    street,
    houseNumber,
    idColonia,
    reference,
    dateConnection,
    dateInitPayment,
    idClient,
    name,
    lastName,
    disabled,
    idTypeClient,
    idWaterConnection,
    dateInitTime,
    dateFinishTime,
    dateStartPayment,
    timeConnectionIsActive
  })
    .then((clientAndWaterConnection) => {
      response.success({req, res, message: 'El cliente y la toma de agua se han agregado con exito'});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al dar de alta el cliente y la toma de agua', status: 400, details: err});
    });
});

module.exports = router;