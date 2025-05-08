const express = require("express");
const { authCheck } = require("./middlewares/auth");
const connectDb = require("./config/database");
const User = require("./model/User");

const app = express();
app.use(express.json());

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

app.post("/user", (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user.save();
  res.send("user added.");
});

app.use("/user", (req, res) => {
  throw new Error("something went wrong.");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.send("something went wrong..");
  }
});

connectDb().then(() => console.log("database conncted"));

app.listen(4000, () => {
  console.log("server is connected...");
});
