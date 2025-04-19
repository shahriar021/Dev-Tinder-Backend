const express = require("express");

const app = express();

// routing is very very important...................
// app.get("/yoo/23/:userId", (req, res) => {
//   console.log(req.params);
//   res.send("yoo yoo from the 23");
// });

app.use(
  "/yoo",
  (req, res, next) => {
    console.log("route handle 1");
    res.send("yoo yoo from the server...");
    next();
  },
  [
    (req, res, next) => {
      console.log("route handle 2 ");
      res.send("yoo from 2");
      next();
    },
    (req, res, next) => {
      console.log("yoo from 3");
    },
  ]
);

app.listen(4000, () => {
  console.log("server is connected...");
});
