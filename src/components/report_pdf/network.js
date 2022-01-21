const express = require('express')
const router = express.Router();
const response = require('../../network/response');
const controller = require('./controller');
const multer = require('multer');
const resivo = require('./resivo');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'firma1.png');
  }
});
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'firma2.png');
  }
});
const uploads = multer({ storage: storage });
const uploads2 = multer({ storage: storage2 });
const pdf = require("html-pdf");

router.get('/signing_image_1', (req, res) => {
  const options = {
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  res.sendFile(path.resolve(__dirname + '../../../uploads/firma1.png'), options, function (err) {
    if (err) {
      response.error(req, res, 'Error al enviar el archivo', 500, err)
    }
  });
});

router.get('/signing_image_2', (req, res) => {
  const options = {
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  res.sendFile(path.resolve(__dirname + '../../../uploads/firma2.png'), options, function (err) {
    if (err) {
      response.error({ req, res, error: 'Error al enviar la imagen', status: 500, details: err })
    }
  });
})

router.post('/signing_image_1', uploads.single('image'), (req, res) => {
  response.success({ req, res, message: 'La imagen se ha subido con exito' });
});

router.post('/signing_image_2', uploads2.single('image'), (req, res) => {
  response.success({ req, res, message: 'La imagen se ha subido con exito' });
});

router.get('/signing_name/:id', (req, res) => {
  const id = req.params.id;
  controller.getSignins(id)
    .then(signingNames => {
      const signingName = { name: signingNames[0]?.name };
      response.success({ req, res, message: signingName });
    })
    .catch(err => {
      response.error({ req, res, error: 'Error al obtener el nombre de la primera firma', status: 500, details: err });
    });
})

router.put('/signing_name/:id', (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  controller.updateSigningName(id, name)
    .then(() => {
      response.success({ req, res, message: 'El nombre de la primera firma se ha guardado con exito' });
    })
    .catch(err => {
      response.error({ req, res, error: 'Error al actualizar el nombre de la primera firma', status: 500, details: err });
    });
});

router.get('/:idReport', async (req, res) => {
  const { idReport } = req.params;
  let report;
  try {
    report = await controller.getReport(idReport);
    pdf.create(resivo(report)).toStream((error, stream) => {
      if (error) {
        res.end("Error creando PDF: ")
      } else {
        res.setHeader("Content-Type", "application/pdf");
        stream.pipe(res);
      }
    }, { height: '11in', width: '8.5in' });

    // const client = await controllerClient.getClients(ID_CLIENT);
  } catch (err) {
    response.error({ req, res, error: 'Error al obtener el reporte', status: 500, details: err });
  };
});

module.exports = router;