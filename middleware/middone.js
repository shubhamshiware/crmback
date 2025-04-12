const jwt = require("jsonwebtoken");

const roleCheck = (allowedRoles) => (req, res, next) => {
  const userRole = req.user.role;
  if (allowedRoles.includes(userRole)) {
    return next();
  }
  res.status(403).json({ message: "Access denied" });
};

module.exports = { roleCheck };
