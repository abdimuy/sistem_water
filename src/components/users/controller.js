const store = require('./store');

const getUsers = (idUser) => {
  return new Promise((resolve, reject) => {
    resolve(store.list(idUser));
  });
};

const setUser = (userArgs) => {
  return new Promise((resolve, reject) => {
    resolve(store.add(userArgs));
  });
};

const updateUser = (userArgs) => {
  return new Promise((resolve, reject) => {
    resolve(store.update(userArgs));
  });
};

const deleteUser = (idUser) => {
  return new Promise((resolve, reject) => {
    resolve(store.delete(idUser))
  });
};

module.exports = {
  getUsers,
  setUser,
  updateUser,
  deleteUser
};