const axios = require("axios");
const pug = require("pug");
const express = require("express");

const app = express();

async function initialConfiguration(API_KEY) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`
    );
    const configuration = response.data;
    return configuration;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { initialConfiguration };
