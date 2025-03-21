const { saveData, getDataByUserName } = require("../repository/repo");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const saltRounds = 10;

const Signup = (req, res) => {
  // Ensure required fields are provided
  console.log(req.body, "testing");
  const { name, email, username, password, about, role } = req.body;
  console.log(req.body, "testing");
  if (!username || !password) {
    return res.status(400).json({
      message: "Failed",
      data: null,
      error:
        "All required fields (name, email, username,about, password) must be provided.",
    });
  }

  // Construct user data with a default role of 'employee'
  const userData = {
    name,
    email,
    about,
    username,
    password, // Password is assumed to be hashed by middleware
    role: role || "employee", // Default to 'employee' if role is not provided
  };

  // Save user data
  saveData(userData)
    .then((result) => {
      res.json({
        message: "Success",
        data: result,
        error: null,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed",
        data: null,
        error: err.toString(),
      });
    });
};

const Login = (req, res) => {
  console.log(req.body, "login");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Failed",
      data: null,
      error: "Username and password are required.",
    });
  }

  getDataByUserName(username)
    .then((result) => {
      if (result) {
        bcrypt.compare(password, result.password, (err, isMatch) => {
          if (err || !isMatch) {
            return res.status(401).json({
              message: "Failed",
              data: null,
              error: "Invalid password.",
            });
          }

          const token = jwt.sign(
            { username: result.username, id: result.id, role: result.role },
            "mysecretkey",
            { expiresIn: "2h" }
          );

          let redirectPage;
          switch (result.role) {
            case "admin":
              redirectPage = "admindashboard";
              break;

            default:
              redirectPage = "dashboard";
          }

          res.json({
            message: "Login successful",
            data: {
              token,
              redirectPage,
            },
            error: null,
          });
        });
      } else {
        res.status(404).json({
          message: "Failed",
          data: null,
          error: "Username not found.",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed",
        data: null,
        error: err.toString(),
      });
    });
};

module.exports = { Signup, Login };
