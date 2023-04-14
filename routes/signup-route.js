const express = require("express");
const axios = require("axios");
const path = require("path");
const { createUser } = require("./../controllers/signup-controllers.js");
signupRouter = express.Router();

signupRouter.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/register.html"));
});

signupRouter.post("/", createUser);

module.exports = signupRouter;
