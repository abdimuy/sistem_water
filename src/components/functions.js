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
    // if(fieldItem.notNull) {
      if(counter === 0) {
        result = !fieldItem.field;
      } else {
        result = result && !fieldItem.field;
      };
      counter++;
    // };
  });
  return result;
};

module.exports = {
  createQueryUpdate,
  checkExitsFields
}