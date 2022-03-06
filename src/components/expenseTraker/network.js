const express = require('express');
const controller = require('./controller');
const response = require('../../network/response');

const router = express.Router();

router.get('/', (req, res) => {
  controller.getAll()
    .then(result => {
      response.success({req, res, message: result})
    })
    .catch(err => {
      response.error({req, res, error: 'Error al obtener los datos', details: err})
    });
});

module.exports = router;