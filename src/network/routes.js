const express = require('express');

const home = require('../components/home/network');
const clients = require('../components/clients/network');
const waterConnection = require('../components/waterConnections/network');
const prices = require('../components/prices/network');
const typeClients = require('../components/typeClient/network');
const transactions = require('../components/transaction/network');
const users = require('../components/users/network');
const clientAndWaterConnection = require('../components/clientAndWaterConnection/network');
const reports = require('../components/reports/network');
const auth = require('../authentication/auth');
const debs = require('../components/debs/network');
const report_pdf = require('../components/report_pdf/network');
const colonias = require('../components/colonias/network');
const hidrantes = require('../components/hidrantes/network');

const router = (server) => {
  server.use('/', home);
  server.use('/register', auth.register);
  server.use('/login', auth.login);
  server.use('/logout', auth.logout);
  server.use('/is_authenticated' , auth.isAuthenticated);
  server.use('/clients', clients);
  server.use('/water_connections', waterConnection);
  server.use('/prices', prices);
  server.use('/type_clients', typeClients);
  server.use('/transactions', transactions);
  server.use('/users', users);
  server.use('/client_and_water_connection', clientAndWaterConnection);
  server.use('/reports', reports);
  server.use('/debs', debs);
  server.use('/report_pdf', report_pdf);
  server.use('/colonias', colonias);
  server.use('/hidrantes', hidrantes);
};

module.exports = router;