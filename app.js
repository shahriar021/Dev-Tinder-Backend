const express = require("express");
const { authCheck } = require("./middlewares/auth");

const app = express();

// routing is very very important...................
// app.get("/yoo/23/:userId", (req, res) => {
//   console.log(req.params);
//   res.send("yoo yoo from the 23");
// });

// app.use("/admin/getData", authCheck, (req, res) => {
//   res.status(200).send("get all data...");
// });

// app.use("/admin/deleteData", authCheck, (req, res) => {
//   res.send("deleted data..");
// });

app.use("/user", (req, res) => {
  throw new Error("something went wrong.");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.send("something went wrong..");
  }
});

app.listen(4000, () => {
  console.log("server is connected...");
});
