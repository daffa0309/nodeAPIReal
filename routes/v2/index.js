const express = require("express");

const router = express.Router();

const loginRoutes = require("./login");
const userRoutes = require("./user");

/**
 * @TODO sort alphabetical ascending!
 */
router.use("/api/v2", [
  loginRoutes,
  userRoutes,
]);

module.exports = router;
