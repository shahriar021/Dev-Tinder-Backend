const express = require("express");
const { authCheck } = require("./middlewares/auth");
const connectDb = require("./config/database");
const User = require("./model/User");
const { validateData } = require("./utils/validate");
const bcrypt = require("bcrypt");
const salt = 10;

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
app.post("/signUp", async (req, res) => {
  try {
    validateData(req);
    const { name, cell, password } = req.body;
    const hasP = bcrypt.hashSync(password, salt);
    console.log(hasP);
    const user = new User({ name, cell, password: hasP });
    console.log(user);
    await user.save();
    res.send("user added.");
  } catch (err) {
    console.log("some error.", err);
    res.send("some error.");
  }
});

app.post("/login", async (req, res) => {
  const { cell, password } = req.body;

  try {
    const user = await User.findOne({ cell: cell.trim() });
    if (!user) {
      res.send("user not found.");
    }

    console.log(user, "login ");
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user.save();
  res.send("user added.");
});

app.use("/specifcuser", async (req, res) => {
  try {
    const specificUser = await User.find({ name: "dhruvo   " });
    res.status(200).send(specificUser);
  } catch (err) {
    console.log("relax..");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.send("something went wrong..");
  }
});

connectDb().then(() => {
  console.log("database conncted");
  app.listen(4000, () => {
    console.log("server is connected...");
  });
});
