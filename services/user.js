const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");

router
  .post("/register", controller.register)
  .post("/login", controller.login)
  .get("/logout", controller.logout);

module.exports = router;
