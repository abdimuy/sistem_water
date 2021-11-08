const router = require('express').Router();
const controller = require('./controller');
const response = require('../../network/response');

router.get('/:id', (req, res) => {
  controller.getReports()
    .then(reports => {
      response.success({req, res, message: reports});
    })
    .catch(err => {
      response.error({req, res, error: 'Error al obtener los reportes', status: 500, details: err});
    });
});

router.get('/client/:id_client', (req, res) => {
  const { id_client: ID_CLIENT } = req.params;
  controller.getReportsClient(ID_CLIENT)
    .then(reports => {
      response.success({req, res, message: reports});
    })
    .catch(err => {
      response.error({req, res, error: 'Error al obtener los reportes del cliente', status: 500, details: err});
    })
})

router.post('/', (req, res) => {
  const {
    idTypeReport,
    idTimeConnection,
    noteReport,
    dateReport,
    transactionsArray
  } = req.body;
  controller.setReport({
    idTypeReport,
    idTimeConnection,
    noteReport,
    dateReport,
    transactionsArray
  })
  .then(reportAdded => {
    response.success({req, res, message: reportAdded});
  })
  .catch(err => {
    response.error({req, res, error: 'Error al crear el reporte', status: 500, details: err});
  })
});

module.exports = router;