const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["ignored", "interested", "accepted", "review"],
    },
  },
  { timestamps: true }
);

// connectionSchema.pre("save", function (next) {
//   const connectionRq = this;

//   if (String(connectionRq.sender) === String(connectionRq.receiver)) {
//     throw new Error("both id's are same!");
//   }

//   next();
// });

const Connection = mongoose.model("connection", connectionSchema);
module.exports = Connection;
