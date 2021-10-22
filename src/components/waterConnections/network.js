const express = require('express');

const router = express.Router();
const response = require('../../network/response');
const controller = require('../waterConnections/controller');

router.get('/', (req, res) => {
  controller.getWaterConnections()
    .then((listWaterConnections) => {
      response.success({req, res, message: listWaterConnections});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener los datos', status: 500, details: err});
    });
});

router.get('/without_client', (req, res) => {
  controller.getWaterConnectionWithoutClient()
    .then((listWaterConnection) => {
      response.success({req, res, message: listWaterConnection});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener los datos', status: 500, details: err});
    });
});

router.get('/:id', (req, res) => {
  const { id: ID_WATER_CONNECTION } = req.params;
  controller.getWaterConnections(ID_WATER_CONNECTION)
    .then((listWaterConnections) => {
      response.success({req, res, message: listWaterConnections});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener los datos', status: 500, details: err});
    });
});

router.post('/', (req, res) => {
  const {street, houseNumber, colonia, reference, dateConnection, idClient} = req.body;
  controller.addWaterConnection({
    street,
    houseNumber,
    colonia,
    reference,
    dateConnection,
    idClient
  })
  .then((waterConnectionAdded) => {
    response.success({req, res, message: waterConnectionAdded});
  })
  .catch((err) => {
    response.error({req, res, error: 'Error al agregar toma de agua', status: 500, details: err});
  });
});

router.put('/:id', (req, res) => {
  const { id: ID_WATER_CONNECTION } = req.params;
  const {street, houseNumber, colonia, reference, idClient} = req.body;
  controller.updateWaterConnection({
    idWaterConnection: ID_WATER_CONNECTION,
    street,
    houseNumber,
    colonia,
    reference,
    idClient
  })
  .then((waterConnectionEdited) => {
    response.success({req, res, message: waterConnectionEdited});
  })
  .catch((err) => {
    response.error({req, res, error: 'Error al actualizar la toma de agua', status: 500, details: err});
  });
});

router.delete('/:id', (req, res) => {
  const { id: ID_WATER_CONNECTION } = req.params;
  controller.deleteWaterConnection(ID_WATER_CONNECTION)
    .then((waterConnectionDeleted) => {
      response.success({req, res, message: waterConnectionDeleted});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al eliminar la toma de agua', status: 500, details: err});
    });
});

module.exports = router;