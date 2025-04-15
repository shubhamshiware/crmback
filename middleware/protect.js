const jwt = require("jsonwebtoken");
const User = require("../model/user"); // make sure you import User

const protect = async (req, res, next) => {
  let token;

  // ✅ The token is passed in the headers as:
  // Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(token, "token form frontend ");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 👇 This is important: attach the user to the request
      req.user = await User.findById(decoded.id).select("-password");

      // 🟢 Proceed to next middleware/route
      return next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // ❌ If there's no token at all
  return res.status(401).json({ message: "Not authorized, no token" });
};

module.exports = { protect };
