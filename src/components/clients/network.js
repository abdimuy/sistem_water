const express = require('express');

const router = express.Router();
const response = require('../../network/response');
const controller = require('./controller');

router.get('/', (req, res) => {
  controller.getClients()
    .then((clientsList) => {
      response.success({req, res, message: clientsList})
    })
    .catch((err) => {
      response.error({req, res, details: 'Unexpected Error', status: 500, error: err})
    })
});

router.get('/hidrantes', (req, res) => {
  controller.getHidrantes()
    .then((hidrantesList) => {
      response.success({req, res, message: hidrantesList})
    })
    .catch((err) => {
      response.error({req, res, details: 'Unexpected Error', status: 500, error: err})
    });
});

router.get('/:id', (req, res) => {
  const { id: ID_CLIENT} = req.params;
  
  controller.getClients(ID_CLIENT)
    .then((clientsList) => {
      response.success({req, res, message: clientsList});
    })
    .catch((err) => {
      response.error({req, res, details: 'Unexpected Error', status: 500, error: err})
    })
});

router.post('/', (req, res) => {
  controller.addClient(req.body)
  .then((clientAdded) => {
    response.success({req, res, message: clientAdded});
  })
  .catch((err) => {
    response.error({req, res, details: 'Error al agregar nuevo cliente', error: err})
  });
});

router.put('/:id', (req, res) => {
  const { id: ID_CLIENT } = req.params;
  const { name, lastName, disabled, idTypeClient, idWaterConnection } = req.body;
  controller.updateClient({
    idClient: ID_CLIENT,
    name,
    lastName,
    disabled,
    idTypeClient,
    idWaterConnection
  })
  .then((clientEdited) => {
    response.success({req, res, message: clientEdited});
  })
  .catch((err) => {
    response.error({req, res, details: 'Error al actualizar el cliente',  error: err})
  });
});

router.delete('/:id', (req, res) => {
  const { id: ID_CLIENT } = req.params;
  controller.deleteClient(ID_CLIENT)
    .then((clientDeleted) => {
      response.success({req, res, message: clientDeleted});
    })
    .catch((err) => {
      response.error({req, res, details: 'Error al eliminar cliente', error: err});
    })
})

module.exports = router;