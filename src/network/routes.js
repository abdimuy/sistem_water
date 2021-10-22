const express = require('express');

const clients = require('../components/clients/network');
const waterConnection = require('../components/waterConnections/network');
const prices = require('../components/prices/network');
const typeClients = require('../components/typeClient/network');
const transactions = require('../components/transaction/network');
const users = require('../components/users/network');
const clientAndWaterConnection = require('../components/clientAndWaterConnection/network');

const router = (server) => {
  server.use('/clients', clients);
  server.use('/water_connections', waterConnection);
  server.use('/prices', prices);
  server.use('/type_clients', typeClients);
  server.use('/transactions', transactions);
  server.use('/users', users);
  server.use('/clientAndWaterConnection', clientAndWaterConnection);
};

module.exports = router;