const express = require('express');
// const ClientsRoutes = require('./components/clients/network');
const router = require('./network/routes');
const cors = require('cors');
// const auth = require('./authentication/auth');

const app = express();

app.use(express.json());
app.use(cors());
// app.use(auth);

// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

app.set('port', process.env.PORT || 3000);

router(app)

module.exports = app;