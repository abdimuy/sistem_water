const {
  table_clients,
  table_water_connection,
  table_colonias,
  table_type_clients,
  table_client_level,
  table_time_connection,
  ID_LEVEL_CLIENT_TITULAR,
  ID_LEVEL_CLIENT_HIDRANTE
} = require('../../database/constants');

const query = `
  SELECT 
    ${table_clients}.id,
    ${table_clients}.name,
    ${table_clients}.lastName,
    ${table_water_connection}.street,
    ${table_water_connection}.houseNumber,
    ${table_water_connection}.reference,
    ${table_water_connection}.id AS idWaterConnection,
    ${table_water_connection}.dateConnection,
    concat(${table_water_connection}.numberConnection, ' - ', ${table_colonias}.name) AS numberWaterConnection,
    ${table_colonias}.name AS colonia, 
    ${table_type_clients}.id AS idTypeClient,
    ${table_type_clients}.name AS typeClient,
    ${table_client_level}.id AS idClientLevel,
    ${table_client_level}.clientLevel,
    ${table_clients}.disabled,
    ${table_time_connection}.id AS idTimeConnection,
    ${table_time_connection}.dateStartPayment
  FROM ${table_clients}
  INNER JOIN ${table_time_connection} ON ${table_clients}.id = ${table_time_connection}.idClient
  INNER JOIN ${table_water_connection} ON ${table_time_connection}.idWaterConnection = ${table_water_connection}.id
  INNER JOIN ${table_type_clients} ON ${table_clients}.idTypeClient = ${table_type_clients}.id
  INNER JOIN ${table_client_level} ON ${table_type_clients}.idClientLevel = ${table_client_level}.id
  INNER JOIN ${table_colonias} ON ${table_water_connection}.idColonia = ${table_colonias}.id
  WHERE ${table_time_connection}.active = 1 AND ${table_client_level}.id = ${ID_LEVEL_CLIENT_TITULAR}
`;

const queryHidrantes = `
  AND
  idWaterConnection IN (
    SELECT
      idWaterConnection
    FROM ${table_clients}
    INNER JOIN ${table_time_connection} ON ${table_clients}.id = ${table_time_connection}.idClient
    INNER JOIN ${table_type_clients} ON ${table_clients}.idTypeClient = ${table_type_clients}.id
    INNER JOIN ${table_client_level} ON idClientLevel = ${table_client_level}.id
    WHERE ${table_client_level}.id = 2
  )
`;

const queryOnlyHidrantes = `
SELECT 
  ${table_clients}.id,
  ${table_clients}.name,
  ${table_clients}.lastName,
  ${table_water_connection}.street,
  ${table_water_connection}.houseNumber,
  ${table_water_connection}.reference,
  ${table_water_connection}.id AS idWaterConnection,
  ${table_water_connection}.dateConnection,
  concat(${table_water_connection}.numberConnection, ' - ', ${table_colonias}.name) AS numberWaterConnection,
  ${table_colonias}.name AS colonia, 
  ${table_type_clients}.id AS idTypeClient,
  ${table_type_clients}.name AS typeClient,
  ${table_client_level}.id AS idClientLevel,
  ${table_client_level}.clientLevel,
  ${table_clients}.disabled,
  ${table_time_connection}.id AS idTimeConnection,
  ${table_time_connection}.dateStartPayment
FROM ${table_clients}
INNER JOIN ${table_time_connection} ON ${table_clients}.id = ${table_time_connection}.idClient
INNER JOIN ${table_water_connection} ON ${table_time_connection}.idWaterConnection = ${table_water_connection}.id
INNER JOIN ${table_type_clients} ON ${table_clients}.idTypeClient = ${table_type_clients}.id
INNER JOIN ${table_client_level} ON ${table_type_clients}.idClientLevel = ${table_client_level}.id
INNER JOIN ${table_colonias} ON ${table_water_connection}.idColonia = ${table_colonias}.id
WHERE ${table_time_connection}.active = 1 AND ${table_client_level}.id = ${ID_LEVEL_CLIENT_HIDRANTE}
`;

const querysClients = {
  getAllClients: query,
  getHidrantes: query + queryHidrantes,
  getOneHidrante: query + queryHidrantes,
  getOnlyHidrantes: queryOnlyHidrantes,
  getOnlyOneHidrante: queryOnlyHidrantes + `AND ${table_clients}.id = ?`
};

module.exports = {
  querysClients,
}