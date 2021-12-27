const express = require('express');
const router = express.Router();
const response = require('../../network/response');
const controller = require('./controller');

router.get('/', (req, res) => {
  controller.getColonias()
    .then((coloniasList) => {
      response.success({ req, res, message: coloniasList })
    })
    .catch((err) => {
      response.error({ req, res, error: 'Error al obtener las colonias', status: 500, details: err })
      console.log({ err });
    });
});

router.post('/', (req, res) => {
  const { name } = req.body;
  controller.setColonia(name)
    .then((coloniaAdded) => {
      response.success({ req, res, message: 'La colonia se ha agregado correctamente' });
    })
    .catch((err) => {
      response.error({ req, res, error: 'Error al agregar nueva colonia', details: err });
    });
});

router.put('/:idColonia', (req, res) => {
  const { idColonia } = req.params;
  const { name } = req.body;
  controller.updateColonia(idColonia, name)
    .then((coloniaEdited) => {
      response.success({ req, res, message: 'La colonia se ha actualizado correctamente' });
    })
    .catch((err) => {
      response.error({ req, res, error: 'Error al actualizar colonia', details: err });
    });
});

router.delete('/:idColonia', (req, res) => {
  const { idColonia } = req.params;
  controller.deleteColonia(idColonia)
    .then((coloniaDeleted) => {
      response.success({ req, res, message: 'La colonia se ha eliminado correctamente' });
    })
    .catch((err) => {
      response.error({ req, res, error: 'Error al eliminar colonia', details: err });
    });
});

module.exports = router;