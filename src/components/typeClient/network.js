const express = require('express');
const controller = require('./controller');
const response = require('../../network/response');

const router = express.Router();

router.get('/', (req, res) => {
  controller.getTypeClients()
    .then((typeClientList) => {
      response.success({req, res, message: typeClientList});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener los tipos de clientes', status: 500, details: err});
    });
});

router.get('/:id', (req, res) => {
  const { id: ID_TYPE_CLIENT } = req.params;
  controller.getTypeClients(ID_TYPE_CLIENT)
    .then((typeClient) => {
      response.success({req, res, message: typeClient});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener el tipo de cliente', status: 500, details: err});
    });
});

router.post('/', (req, res) => {
  const { name, idClientLevel } = req.body;
  controller.setTypeClient({
    name,
    idClientLevel
  })
  .then((typeClientAdded) => {
    response.success({req, res, message: typeClientAdded});
  })
  .catch((err) => {
    response.error({req, res, error: 'Error al agregar tipo de cliente', status: 500, details: err});
  });
});

router.put('/:id', (req, res) => {
  const { id: ID_TYPE_CLIENT } = req.params;
  const { name, idClientLevel } = req.body;
  controller.updateTypeClient({
    name,
    idClientLevel,
    idTypeClient: ID_TYPE_CLIENT
  })
    .then((typeClientEdited) => {
      response.success({req, res, message: typeClientEdited});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al editar el tipo de cliente', status: 500, details: err});
    });
});

router.delete('/:id', (req, res) => {
  const { id: ID_TYPE_CLIENT } = req.params;
  controller.deleteTypeClient(ID_TYPE_CLIENT)
    .then((typeClientDeleted) => {
      response.success({req, res, message: typeClientDeleted});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al borrar el tipo de cliente', status: 500, details: err});
    });
});

module.exports = router;