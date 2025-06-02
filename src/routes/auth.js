const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const { validateData } = require("../utils/validate");
const salt = 10;

const JWT = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    validateData(req);
    const { name, cell, password } = req.body;
    const hasP = bcrypt.hashSync(password, salt);
    console.log(hasP);
    const user = new User({ name, cell, password: hasP });
    console.log(user);
    await user.save();
    res.send("user added.");
  } catch (err) {
    console.log("some error.", err);
    res.send("some error.");
  }
});

authRouter.post("/login", async (req, res) => {
  const { cell, password } = req.body;

  try {
    const user = await User.findOne({ cell: cell });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    console.log(user, "user password.");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid password.");
    }
    if (isPasswordValid) {
      const token = await JWT.sign({ id: user._id }, "salamenode123");
      console.log(token, "token");
      res.cookie("token", token);
      return res.status(200).send("Login successful.");
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send("Internal server error.");
  }
});

module.exports = authRouter;
