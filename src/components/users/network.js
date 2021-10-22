const express = require('express');
const controller = require('./controller');
const response = require('../../network/response');

const router = express.Router();

router.get('/', (req, res) => {
  controller.getUsers()
    .then((usersList) => {
      response.success({req, res, message: usersList});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener los usuarios', status: 500, details: err});
    });
});

router.get('/:id', (req, res) => {
  const { id: ID_USER } = req.params;
  controller.getUsers(ID_USER)
    .then((user) => {
      response.success({req, res, message: user});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al obtener los datos', status: 500, details: err});
    });
});

router.post('/', (req, res) => {
  const { name, lastName, email, password } = req.body;
  controller.setUser({
    name,
    lastName,
    email,
    password
  })
    .then((userCreated) => {
      response.success({req, res, message: userCreated});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al crear el usuario', status: 500, details: err});
    });
});

router.put('/:id', (req, res) => {
  const { id: ID_USER } = req.params;
  const { name, lastName, email, password } = req.body;
  controller.updateUser({
    name,
    lastName,
    email,
    password,
    idUser: ID_USER
  })
    .then((userEdited) => {
      response.success({req, res, message: userEdited});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al editar usuario', status: 500, details: err});
    });
});

router.delete('/:id', (req, res) => {
  const { id: ID_USER } = req.params;
  controller.deleteUser(ID_USER)
    .then((userDeleted) => {
      response.success({req, res, message: userDeleted});
    })
    .catch((err) => {
      response.error({req, res, error: 'Error al eliminar el usuario'});
    });
});

module.exports = router;