const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("from the server");
});

app.listen(4000, () => {
  console.log("server is connected...");
});
