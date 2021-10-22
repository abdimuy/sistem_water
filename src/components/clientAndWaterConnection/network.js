const express = require('express');
const controller = require('./controller');
const response = require('../../network/response');

const router = express.Router();

router.post('/', (req, res) => {
  const {
    street,
    houseNumber,
    colonia,
    reference,
    dateConnection,
    dateInitPayment,
    idClient,
    name,
    lastName,
    disabled,
    idTypeClient,
    idWaterConnection
  } = req.body;
  controller.setClientAndWaterConnection({
    street,
    houseNumber,
    colonia,
    reference,
    dateConnection,
    dateInitPayment,
    idClient,
    name,
    lastName,
    disabled,
    idTypeClient,
    idWaterConnection
  })
    .then((clientAndWaterConnection) => {
      response.success({req, res, message: 'El cliente y la toma de agua se han agregado con exito'});
    })
    .catch((err) => {
      response.error({req, res, error: 'Asegurece de agregar toda la información obligatoria en el formulario', status: 400, details: err});
    });
});

module.exports = router;