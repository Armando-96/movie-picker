const express = require("express");
const axios = require("axios");
const path = require("path");
const {
  loginGet,
  loginPost,
} = require("./../controllers/login-controllers.js");
const sessions = require("express-session");

loginRouter = express.Router();

loginRouter.post("/", loginPost);

loginRouter.get("/", loginGet);

module.exports = loginRouter;
