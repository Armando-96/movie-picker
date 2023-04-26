const express = require("express");
const discoveryController = require("../controllers/discovery-controllers.js");
const discoveryRoute = express.Router();

discoveryRoute.get("/", discoveryController.initial);

module.exports = discoveryRoute;
