const express = require('express');
const controller = require('./controller');
const response = require('../../network/response');

const router = express.Router();

router.get('/', (req, res) => {
  controller.getPrices()
    .then((pricesList) => {
      response.success({req, res, message: pricesList});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener los datos'});
    });
});

router.get('/:id', (req, res) => {
  const { id: ID_PRICE } = req.params;
  controller.getPrices(ID_PRICE)
    .then((price) => {
      response.success({req, res, message: price});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener los datos', status: 500, details: err});
    });
});

router.post('/', (req, res) => {
  const { price, dateInit, dateFinish, idTypeClient, idTypePrice } = req.body;
  controller.setPrice({
    price,
    dateInit,
    dateFinish,
    idTypeClient,
    idTypePrice
  })
  .then((priceAdded) => {
    response.success({req, res, message: 'Precio agregado correctamente'});
  })
  .catch((err) => {
    response.error({req, res, error: 'Error al agregar precio', status: 500, details: err});
  });
});

router.put('/:id', (req, res) => {
  const { id: ID_PRICE } = req.params;
  const { price, dateInit, dateFinish, idTypeClient, idTypePrice } = req.body;
  controller.updatePrice({
    price,
    dateInit,
    dateFinish,
    idTypeClient,
    idTypePrice,
    idPrice: ID_PRICE
  })
    .then((priceEdited) => {
      response.success({req, res, message: 'Precio actualizado correctamente'});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al editar precio', status: 500, details: err});
    });
});

router.delete('/:id', (req, res) => {
  const { id: ID_PRICE } = req.params;
  controller.deletePrice(ID_PRICE)
    .then((priceDeleted) => {
      response.success({req, res, message: 'El precio se ha eliminado correctamente'});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al eliminar precio', status: 500, details: err});
    });
});

module.exports = router;