const mySqlConnection = require('../../database/connection');
const { table_users } = require('../../database/constants');
const { createQueryUpdate, checkExitsFields } = require('../functions');

const getUser = (idUser) => {
  return new Promise((resolve, reject) => {
    let query;
    let variablesQuery = [];
    if(idUser) {
      query = `SELECT * FROM ${table_users} WHERE id = ?`;
      variablesQuery.push(idUser);
    } else {
      query = `SELECT * FROM ${table_users}`;
    };
    mySqlConnection.query(
      query,
      variablesQuery,
      (err, results, fields) => {
        if(!err) {
          resolve(idUser ? results[0] : results);
        } else {
          console.log(err);
          reject('Error al obtener los datos');
        };
      }
    );
  });
};

const setUser = (userArgs) => {
  const { name, lastName, email, password } = userArgs;
  return new Promise((resolve, reject) => {
    if(!name || !lastName || !email || !password) {
      reject('Agregue todos campos necesarios para crear un usuario');
      return null;
    };
    const query = `
      INSERT INTO ${table_users} 
      (name, lastName, email, password)
      VALUES (?, ?, ?, ?);
    `;
    mySqlConnection.query(
      query,
      [name, lastName, email, password],
      (err, results, fields) => {
        if(!err) {
          resolve('El usuario se ha creado correctamente');
        } else {
          console.log(err);
          reject('Error al crear el usuario');
        };
      }
    );
  });
};

const updateUser = (userArgs) => {
  const { name, lastName, email, password, idUser } = userArgs;
  return new Promise((resolve, reject) => {
    const arrayTransactionArgs = [
      {field: name, column: 'name', notNull: true},
      {field: lastName, column: 'lastName', notNull: true},
      {field: email, column: 'email', notNull: true},
      {field: password, column: 'password', notNull: true}
    ];
    if(checkExitsFields(arrayTransactionArgs)) {
      reject('Agregue todos los campos necesarios para actualizar el usuario');
      return null;
    };
    const [query, variablesQuery] = createQueryUpdate(
      arrayTransactionArgs,
      table_users,
      idUser
    );

    mySqlConnection.query(
      query,
      variablesQuery,
      (err, result, fields) => {
        if(!err) {
          resolve('El usuario se ha editado con exito');
        } else {
          console.log(err);
          reject('Error al editar el usuario');
        };
      }
    );
  });
};

const deleteUser = (idUser) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM ${table_users} WHERE id = ?`;
    mySqlConnection.query(
      query,
      [idUser],
      (err, results, fields) => {
        if(!err) {
          resolve('El usuario ha sido eliminado correctamente');
        } else {
          console.log(err);
          reject('Error al eliminar el usuario');
        };
      }
    );
  });
};

module.exports = {
  list: getUser,
  add: setUser,
  update: updateUser,
  delete: deleteUser
};