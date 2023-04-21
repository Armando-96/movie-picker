const os = require("node:os");
const { initialConfiguration } = require("./configuration.js");

const TMDB_API_KEY = "fcece093f96283eb8c3865c3be14e4d4"; // APY KEY per il database TMDB
const DB_PASSWORD = "postgres";
const DB_USER = "postgres";
const DB_PORT = os.type() === "Windows_NT" ? 5432 : 8080;
const CONFIGURATION = initialConfiguration(TMDB_API_KEY); // Promise
const THRESHOLD_FOR_FILTERING = 50;
const TOTAL_PAGES_DISCOVER = 500;//Le api di tmdb per la sezione discover, limitano il numero di pagine accessibili a 500
const TOTAL_PAGES_TRENDING = 1000;//in trending a 1000
module.exports = {
  TMDB_API_KEY,
  DB_PASSWORD,
  DB_USER,
  DB_PORT,
  CONFIGURATION,
  THRESHOLD_FOR_FILTERING,
  TOTAL_PAGES_DISCOVER,
  TOTAL_PAGES_TRENDING,
};
