const bcrypt = require("bcryptjs");

const saltRounds = 10;
const jwt = require("jsonwebtoken");

const encryptPassword = (req, res, next) => {
  console.log("Request Body:", req.body);

  // Check if password exists directly in req.body
  if (!req.body || !req.body.password) {
    return res.status(400).send("Password is Must");
  }

  const password = req.body.password;

  // Hash the password
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send("Error hashing password");
    }

    req.body.password = hash;

    // Proceed to the next middleware or route handler
    next();
  });
};

const verifytoken = (req, res, next) => {
  console.log(req.body, "token");
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract the token from the "Authorization" header

  if (token) {
    jwt.verify(token, "mysecretkey", (err, decoded) => {
      if (err) {
        res.status(401).json({
          message: "Failed",
          data: null,
          error: "Invalid or expired token",
        });
      } else {
        req.user = decoded; // Attach decoded token data to `req.user` for access in other parts
        next();
      }
    });
  } else {
    res.status(401).json({
      message: "Failed",
      data: null,
      error: "Token not provided",
    });
  }
};

module.exports = { encryptPassword, verifytoken };
