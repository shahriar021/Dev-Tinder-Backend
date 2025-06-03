const express = require("express");

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

module.exports = profileRouter;
