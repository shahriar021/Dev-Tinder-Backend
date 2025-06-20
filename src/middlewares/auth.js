const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authCheck = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Please log in!" });
  }

  try {
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedObj.id);
    req.user = user;
    console.log(req.user.name);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = { authCheck };
