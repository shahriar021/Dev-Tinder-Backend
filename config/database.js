const mongose = require("mongoose");

const connectDB = async () => {
  await mongose.connect(
    "mongodb+srv://shahriar:mongo123@deepnode.3xosx9i.mongodb.net/lern"
  );
};

module.exports = connectDB;
