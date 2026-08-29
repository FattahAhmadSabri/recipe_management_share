const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "unauthorized User" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(200).json({ message: "invalid user" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "unauthorized User" });
  }
};

module.exports = authMiddleware;
