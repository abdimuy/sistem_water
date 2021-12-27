const mySqlConnectionPromise = require('../database/connectionPromise');

const createQueryUpdate = (arrayFields, table, idElement) => {
  let query = `UPDATE ${table} SET `;
  let variablesQuery = [];
  let counter = 0;
  arrayFields.forEach((fieldItem) => {
    if(fieldItem.field) {
      if(counter === 0) {
        query += `${fieldItem.column} = ?`;
      } else {
        query += `,${fieldItem.column} = ?`;
      };
      variablesQuery.push(fieldItem.field);
      counter++;
    };
  });
  query += ' WHERE id = ?';
  variablesQuery.push(idElement);
  return [query, variablesQuery];
};

const checkExitsFields = (arrayFields) => {
  let result;
  let counter = 0;
  arrayFields.forEach((fieldItem) => {
    if(fieldItem.notNull) {
      if(counter === 0) {
        result = !fieldItem.field;
      } else {
        result = result && !fieldItem.field;
      };
      counter++;
    };
  });
  return result;
};

const checkIsUndifinedObj = (obj) => {
  let result;
  Object.keys(obj).forEach((key) => {
    if(obj[key] === undefined) {
      result = true;
    };
  });
  return result;
};

const queryDB = (query, variablesQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Array.isArray(variablesQuery)) {
        const [rows, fields] = await (await mySqlConnectionPromise).execute(query, variablesQuery);
        resolve([rows, fields]);
      } else {
        const [rows, fields] = await (await mySqlConnectionPromise).execute(query);
        resolve([rows, fields]);
      };
    } catch (err) {
      console.log(err);
      reject(err);
    };
  });
};

const functionsDB = {
  queryDB
}

module.exports = {
  createQueryUpdate,
  checkExitsFields,
  checkIsUndifinedObj,
  functionsDB
}