const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  cell: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
