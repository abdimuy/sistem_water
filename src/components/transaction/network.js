const express = require('express');
const controller = require('./controller');
const response = require('../../network/response');

const router = express.Router();

router.get('/', (req, res) => {
  controller.getTransactions()
    .then((transaction) => {
      response.success({req, res, message: transaction});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener las transacciones', status: 500, details: err});
    });
});

router.get('/range', (req, res) => {
  const { dateStart, dateEnd } = req.query;
  controller.getTransactionsRange(dateStart, dateEnd)
    .then((transaction) => {
      response.success({req, res, message: transaction});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener las transacciones', status: 500, details: err});
    });
});

router.get('/:id', (req, res) => {
  const { id: ID_TRANSACTION } = req.params;
  controller.getTransactions(ID_TRANSACTION)
    .then((transaction) => {
      response.success({req, res, message: transaction});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener la transacción', status: 500, details: err})
    });
});

router.post('/', (req, res) => {
  const {
    amount,
    date,
    note,
    dateAdded,
    idUser,
    idWaterConnection,
    idTypeTransaction,
    idClient
  } = req.body;
  controller.setTransaction({
    amount,
    date,
    note,
    dateAdded,
    idUser,
    idWaterConnection,
    idTypeTransaction,
    idClient
  })
    .then((transactionAdded) => {
      response.success({req, res, message: transactionAdded});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al crear la transacción',status: 500, details: err});
    });
});

router.put('/:id', (req, res) => {
  const { id: ID_TRANSACTION } = req.params;
  const {
    amount,
    date,
    note,
    dateAdded,
    idUser,
    idWaterConnection,
    idTypeTransaction,
    idClient
  } = req.body;
  controller.updateTransaction({
    idTransaction: ID_TRANSACTION,
    amount,
    date,
    note,
    dateAdded,
    idUser,
    idWaterConnection,
    idTypeTransaction,
    idClient
  })
    .then((transactionEdited) => {
      response.success({req, res, message: transactionEdited});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al editar la transacción', status: 500, details: err});
    });
});

router.delete('/:id', (req, res) => {
  const { id: ID_TRANSACTION } = req.params;
  controller.deleteTransaction(ID_TRANSACTION)
    .then((transactionDeleted) => {
      response.success({req, res, message: transactionDeleted});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al eliminar la transacción'});
    });
});

module.exports = router;