const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const mySqlConnection = require('../database/connectionPromise');
const { promisify } = require('util');

//Procedimiento para registrar un usuario

exports.register = async (req, res) => {
  const { name, lastName, nameUser, password } = req.body;
  console.log({ name, lastName, nameUser, password });
  try {
    const [userExists] = await (await mySqlConnection).query(
      'SELECT * FROM users WHERE nameUser = ?', [nameUser]
    );
    if (userExists.length > 0) {
      // console.log({ userExists });
      return res.status(400).send({ error: 'User already exists' });
      // return response
    }
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);
    const userData = {
      name,
      lastName,
      nameUser,
      password: hash,
    };
    await (await mySqlConnection).query('INSERT INTO users SET ?', [userData]);
    return res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Internal server error' });
  };
};

exports.login = async (req, res) => {
  const { user, password } = req.body;
  // console.log({ user, password });
  try {
    const [userExists] = await (await mySqlConnection).query(
      'SELECT * FROM users WHERE nameUser = ?', [user]
    );
    if (userExists.length === 0) {
      return res.status(400).send({ error: 'User not found' });
    }
    const isPasswordValid = await bcryptjs.compare(password, userExists[0].password);
    if (!isPasswordValid) {
      return res.status(400).send({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: userExists[0].id }, 'secret', {
      expiresIn: '1d',
    });
    // return res.status(200).send({ token });
    const cookieOptions = {
      expires: new Date(
        (Date.now() + 90 * 60 * 60 * 24 * 30)
      ),
      httpOnly: false,
    };
    res.cookie('token', token, cookieOptions);
    return res.status(200).send({ message: 'Logged in successfully', token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Internal server error' });
  };
};

// exports.isAuthenticated = async (req, res, next) => {
//   if (req.cookies.token) {
//     try {
//       const decodicatedToken = await promisify(jwt.verify)(req.cookies.token, 'secret');
//       const [user] = await (await mySqlConnection).query('SELECT * FROM users WHERE id = ?', [decodicatedToken.id]);
//       if (user.length > 0) {
//         req.user = user[0];
//         return next();
//       } else {
//         return next();
//       }
//     } catch (error) {
//       console.log(error);
//       // return next
//     }
//   } else {
//     res.status(401).send({ error: 'You must be logged in' });
//   };
// };

exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.token) {
    console.log({ req: req.cookies.token });
    try {
      const decodicatedToken = await promisify(jwt.verify)(req.cookies.token, 'secret');
      const [user] = await (await mySqlConnection).query('SELECT * FROM users WHERE id = ?', [decodicatedToken.id]);
      if (user.length > 0) {
        return res.status(200).send({ message: user });
        req.user = user[0];
      } else {
        return res.status(401).send({ error: 'You must be logged in' });
      };

    } catch (error) {
      console.log(error);
      return res.status(401).send({ error: 'You must be logged in' });
    }
  } else {
    return res.status(401).send({ error: 'You must be logged in' });
  };
}

exports.logout = async (req, res) => {
  res.clearCookie('token');
  return res.status(200).send({ message: 'Logged out successfully' });
};