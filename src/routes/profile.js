const express = require("express");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();
const { authCheck } = require("../middlewares/auth");
const User = require("../model/User");

profileRouter.use("/specifcuser", authCheck, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId); // You might need to import User

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in /specifcuser:", err);
    res.status(500).send("Something went wrong.");
  }
});

profileRouter.patch("/profile/edit", authCheck, async (req, res) => {
  try {
    const loggedinuser = req.user;

    console.log(
      Object.keys(req.body).forEach(
        (key) => (loggedinuser[key] = req.body[key])
      )
    );
    // console.log(loggedinuser)
    await loggedinuser.save();
    res.json({ message: `${loggedinuser.name} changed his profile` });
  } catch (err) {
    res.send("something went werong again.!");
  }
});

profileRouter.patch("/profile/password", authCheck, async (req, res) => {
  try {
    const loggedinuser = req.user;
    const isMatchedPassword = await bcrypt.compare(
      req.body.oldPassword,
      loggedinuser.password
    );
    console.log(isMatchedPassword);
    if (!isMatchedPassword) {
      res.send("not matched.");
    } else {
      loggedinuser.password = await bcrypt.hash(req.body.newPassword, 10);
      loggedinuser.save();
      res.send("password changed.");
    }
  } catch (err) {
    res.send("someting went wrong");
  }
});

module.exports = profileRouter;
