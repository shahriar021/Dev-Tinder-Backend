const jwt = require("jsonwebtoken");

const authCheck = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Please log in!" });
  }

  try {
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedObj;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = { authCheck };
