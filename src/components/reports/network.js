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

router.get('/client/:id_report', (req, res) => {
  const { id_report: ID_REPORT } = req.params;
  controller.getReportsClient(ID_REPORT)
    .then(reports => {
      response.success({req, res, message: reports});
    })
    .catch(err => {
      response.error({req, res, error: 'Error al obtener los reportes del cliente', status: 500, details: err});
    })
})

router.post('/', (req, res) => {
  console.log('post')
  const {
    idTypeReport,
    idTimeConnection,
    noteReport,
    dateReport,
    transactionsArray,
    idUser,
  } = req.body;
  controller.setReport({
    idTypeReport,
    idTimeConnection,
    noteReport,
    dateReport,
    transactionsArray,
    idUser,
  })
  .then(reportAdded => {
    response.success({req, res, message: reportAdded});
  })
  .catch(err => {
    response.error({req, res, error: 'Error al crear el reporte', status: 500, details: err});
  })
});

module.exports = router;