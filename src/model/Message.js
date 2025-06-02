const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  roomId: {
    type: String,
    required: true, // ✅ important to identify the chat room
  },
  sender: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
