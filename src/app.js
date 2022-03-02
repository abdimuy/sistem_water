const express = require('express');
// const ClientsRoutes = require('./components/clients/network');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const moment = require('moment');
require('moment/locale/es-mx');

const router = require('./network/routes');
const cors = require('cors');
// const auth = require('./authentication/auth');

const app = express();

app.use(express.static('src/uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({credentials: true, origin: true}));
moment.locale('es-mx');
dotenv.config({ path: './env/.env' });

app.use(cookieParser());

app.set('port', process.env.PORT || 3000);

router(app)

module.exports = app;