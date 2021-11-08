const express = require('express');
// const ClientsRoutes = require('./components/clients/network');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const router = require('./network/routes');
const cors = require('cors');
// const auth = require('./authentication/auth');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({credentials: true, origin: true}));
// app.use(auth);

dotenv.config({ path: './env/.env' });

app.use(cookieParser());
// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

app.set('port', process.env.PORT || 3000);

router(app)

module.exports = app;