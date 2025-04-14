const express = require("express");

const app = express();

// routing is very very important...................
app.get("/yoo/23/:userId", (req, res) => {
  console.log(req.params);
  res.send("yoo yoo from the 23");
});

app.use("/yoo", (req, res) => {
  res.send("yoo yoo from the server...");
});

app.use("/", (req, res) => {
  res.send("from the server");
});

app.listen(4000, () => {
  console.log("server is connected...");
});
