const jwt = require("jsonwebtoken");
const User = require("../model/user");
require("dotenv").config(); // make sure this is loaded

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(token, "token from frontend");

      // ✅ Use the secret key here
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 👇 Attach the user to request object
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // allow access
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

module.exports = { protect };
