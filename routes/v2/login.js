const express = require("express");
const routes = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../connection/data");
const userMiddleware = require("../../middlewares/user");

routes.post("/register", userMiddleware.validateRegister, (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = {
      username: req.body.username,
      password: hash,
    };
    db.query("INSERT INTO user SET ?", user, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      res.status(201).json({
        message: "User created!",
      });
    });
  });
});
routes.post("/login", (req, res, next) => {
  db.query(
    "SELECT * FROM user WHERE username = ?",
    [req.body.username],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      if (result.length < 1) {
        return res.status(401).json({
          message: "Username or Password Doesnt Exist",
        });
      }
      bcrypt.compare(req.body.password, result[0].password, async(err, response) => {
        if (err) {
          return res.status(401).json({
            message: "Username or Password Doesnt Exist",
          });
        }
        if (response) {
          const token = jwt.sign(
            {
              username: result[0].username,
              userId: result[0].id,
            },
            "secret_this_should_be_longer",
            {
              expiresIn: "1h",
            }
          );
          console.log(token);
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        return res.status(401).json({
          message: "Auth Failed",
        });
      });
    }
  );
});
module.exports = routes;
