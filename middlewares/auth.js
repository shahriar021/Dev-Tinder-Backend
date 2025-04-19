const authCheck =
  ("/admin",
  (req, res, next) => {
    const token = "xxxx";
    const isAuth = token === "xxx";
    console.log(isAuth);
    if (isAuth) {
      next();
    } else {
      res.status(401).send("not authenticated");
    }
  });

module.exports = { authCheck };
