const express = require("express");
const {
  loginGet,
  loginPost,
} = require("./../controllers/login-controllers.js");

loginRouter = express.Router();

loginRouter.post("/", loginPost);

loginRouter.get("/", loginGet);

module.exports = loginRouter;
