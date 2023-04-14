const express = require("express");
const axios = require("axios");
const path = require("path");
const { login } = require("./../controllers/login-controllers.js");

loginRouter = express.Router();

loginRouter.post("/", login);

loginRouter.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/login.html"));
});

module.exports = loginRouter;
