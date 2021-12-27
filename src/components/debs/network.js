const express = require('express');
const router = express.Router();
const response = require('../../network/response');
const controller = require('./controller');

router.post('/:idTimeConnection', (req, res) => {
  const { idTimeConnection } = req.params;
  const deb = req.body;
  controller.setDeb(idTimeConnection, deb)
    .then(debAdded => {
      response.success({req, res, message: debAdded});
    })
    .catch(err => {
      response.error({req, res, error: 'Error al crear el deb', status: 500, details: err});
    });
});

module.exports = router;