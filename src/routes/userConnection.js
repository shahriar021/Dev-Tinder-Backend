const express = require("express");
const { authCheck } = require("../middlewares/auth");
const userConnectionRouter = express.Router();
const Connection = require("../model/Connection");

userConnectionRouter.get("/request/review", authCheck, async (req, res) => {
  try {
    const loggedinuser = req.user;
    const connection = await Connection.find({
      receiver: loggedinuser._id,
      status: "interested",
    }).populate("sender", "name cell");
    res.json({
      message: "all connection fetched successfully.",
      data: connection,
    });
  } catch (err) {
    res.status(400).json({ message: "something went wrong " + err.message });
  }
});

userConnectionRouter.get(
  "/request/connections",
  authCheck,
  async (req, res) => {
    const loggedinuser = req.user;

    const connectionRequest = await Connection.find({
      $or: [
        { receiver: loggedinuser._id, status: "accepted" },
        { sender: loggedinuser._id, status: "accepted" },
      ],
    }).populate("sender", "cell name");

    const data = connectionRequest.map((row) => {
      if (row.sender._id.toString() === loggedinuser._id.toString()) {
        return row.receiver;
      }
      return row.sender;
    });

    res.json({ data });
  }
);

module.exports = userConnectionRouter;
