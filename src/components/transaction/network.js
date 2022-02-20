const express = require('express');
const controller = require('./controller');
const response = require('../../network/response');
const pdf = require('html-pdf');
const reportTransactions = require('./reportTransactions');

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

router.get('/reportTransactions', async (req, res) => {
  try {
    const { dateStart, dateEnd } = req.query;
    const transactions = await controller.getTransactionsRange(dateStart, dateEnd)
    pdf.create(reportTransactions(transactions, [dateStart, dateEnd]), {border: { bottom: 20, top: 20}}).toStream((error, stream) => {
      if (error) {
        res.end("Error creando PDF: ")
      } else {
        res.setHeader("Content-Type", "application/pdf");
        stream.pipe(res);
      }
    }, { height: '11in', width: '8.5in' });
  } catch(err) {
    response.error({req, res, error: 'Error al generar el reporte', status: 500, details: err});
  }
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