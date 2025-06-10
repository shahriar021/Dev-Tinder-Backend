const express = require("express");
const { authCheck } = require("../middlewares/auth");
const userConnectionRouter = express.Router();
const Connection = require("../model/Connection");
const User = require("../model/User");

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

userConnectionRouter.get("/feed", authCheck, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await Connection.find({
      $or: [{ sender: loggedInUser._id }, { receiver: loggedInUser._id }],
    }).select("sender  receiver");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.sender.toString());
      hideUsersFromFeed.add(req.receiver.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("cell name")
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userConnectionRouter;
