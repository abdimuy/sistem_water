const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'yGRpy5BNjUKDmDqJfRhv33gD0C4Y00wa',
  issuerBaseURL: 'https://dev-qtskebaf.us.auth0.com'
};

module.exports = auth(config)