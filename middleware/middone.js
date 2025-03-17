const jwt = require("jsonwebtoken");

const roleCheck = (allowedRoles) => (req, res, next) => {
  const userRole = req.user.role; // Assuming user role is available in req.user
  if (allowedRoles.includes(userRole)) {
    return next();
  }
  res.status(403).json({ message: "Access denied" });
};

module.exports = { roleCheck };
