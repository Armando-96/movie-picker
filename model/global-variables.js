const { initialConfiguration } = require("./configuration.js");

const TMDB_API_KEY = "fcece093f96283eb8c3865c3be14e4d4"; // APY KEY per il database TMDB
const DB_PASSWORD = "postgres";
const DB_USER = "postgres";
const CONFIGURATION = initialConfiguration(TMDB_API_KEY); // Promise
module.exports = {
  TMDB_API_KEY,
  DB_PASSWORD,
  DB_USER,
  CONFIGURATION,
};
