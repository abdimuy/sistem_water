const { functionsDB: { queryDB } } = require('../functions');
const { table_colonias } = require('../../database/constants');

const getColonias = () => {
  return new Promise((resolve, reject) => {
    queryDB(`SELECT id, name FROM ${table_colonias} WHERE isDelete = 0`)
      .then(([rows, fields]) => {
        resolve(rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const setColonia = (name) => {
  return new Promise((resolve, reject) => {
    queryDB(`INSERT INTO ${table_colonias} (name) VALUES (?)`, [name])
      .then(([rows, fields]) => {
        resolve(rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const updateColonia = (idColonia, name) => {
  return new Promise((resolve, reject) => {
    queryDB(`UPDATE ${table_colonias} SET name = ? WHERE id = ?`, [name, idColonia])
      .then(([rows, fields]) => {
        resolve(rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteColonia = (idColonia) => {
  return new Promise((resolve, reject) => {
    queryDB(`UPDATE ${table_colonias} SET isDelete = 1 WHERE id = ?`, [idColonia])
      .then(([rows, fields]) => {
        resolve(rows);
      })
      .catch((err) => {
        reject(err);
      });
  })
}

module.exports = {
  getColonias,
  setColonia,
  updateColonia,
  deleteColonia
};