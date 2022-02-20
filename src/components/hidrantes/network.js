const express = require('express');
const router = express.Router();
const controller = require('./controller');
const response = require('../../network/response');

router.put('/:idHidrante', async (req, res) => {
  const { idHidrante: ID_HIDRANTE } = req.params;
  const isValid = await controller.validateHidrante(ID_HIDRANTE);
  if(isValid) {
    controller.unsubscribeHidrante(ID_HIDRANTE)
      .then(data => {
        response.success({ req, res, message: data });
      })
      .catch(err => {
        response.error({ req, res, error: 'Error al dar de baja el hidrante', details: err });
      });
  } else {
    response.error({ req, res, error: 'El hidrante tiene transacciones pendientes', details: 'No se puede dar de baja el hidrante porque tiene pagos atrasados' });
  }
});

module.exports = router;