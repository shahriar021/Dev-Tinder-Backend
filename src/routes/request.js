const express = require("express");
const { authCheck } = require("../middlewares/auth");
const Connection = require("../model/Connection");
const User = require("../model/User");
const requestRouter = express.Router();

requestRouter.post("/request/:status/:id", authCheck, async (req, res) => {
  try {
    const sender = req.user._id;
    const receiver = req.params.id;
    const status = req.params.status;
    const statusBox = ["ignored", "interested"];
    const isValidStatus = statusBox.includes(req.params.status);
    const toUser = await User.findById(receiver);
    if (!toUser) {
      return res.send("User not found!");
    }
    if (sender.toString() === receiver.toString()) {
      return res.json({ message: "sender can't send request to sender!" });
    }
    if (!isValidStatus) {
      return res.json({ message: "Pick the correct Staus plz!" });
    }

    // const isExistConnection = await Connection.findOne({ sender: sender });
    // if (!isExistConnection) {
    //   return res.status(404).json({ message: "Connection not found" });
    // }
    // const idMatched = isExistConnection.receiver == receiver;
    // if (idMatched) {
    //   return res.send("Already sent..!");
    // }

    const existingConnectionRequest = await Connection.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });
    if (existingConnectionRequest) {
      return res
        .status(400)
        .send({ message: "Connection Request Already Exists!!" });
    }

    const connection = new Connection({ sender, receiver, status });
    await connection.save();
    res.send(`${req.user.name} choose ${status}`);
  } catch (err) {
    console.log(err);
  }
});

requestRouter.post(
  "/request/review/:status/:Rid",
  authCheck,
  async (req, res) => {
    const { status, Rid } = req.params;
    const statusBox = ["accepted", "review"];
    const loggedinuser = req.user;
    console.log(loggedinuser);

    const existingConnection = await Connection.findOne({
      _id: Rid,
      receiver: loggedinuser._id,
      status: "interested",
    });

    const validStatus = statusBox.includes(status);

    if (!validStatus) {
      return res.send("invalid status!!");
    }

    if (!existingConnection) {
      return res.status(400).json({ message: "connection not found!" });
    }

    existingConnection.status = status;

    const data = await existingConnection.save();

    res.json({
      message: "status updated successfully!",
      data,
    });
  }
);

module.exports = requestRouter;
