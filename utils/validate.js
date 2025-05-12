const validate = require("validator");

const validateData = (req) => {
  const { name, cell, password } = req.body;

  if (!name) {
    throw new Error("name is not validate...!");
  }
  if (!cell) {
    throw new Error("cell is not validate");
  }
  if (!password) {
    throw new Error("no password");
  }
  if (!validate.isStrongPassword(password)) {
    throw new Error("password is very weak.");
  }
};

module.exports = { validateData };
