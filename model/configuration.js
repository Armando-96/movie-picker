const axios = require("axios");

class Configuration {
  constructor(obj) {
    Object.assign(this, obj);
  }

  from(obj) {
    if (Object.getOwnPropertyNames(this).length === 0) {
      Object.assign(this, obj);
    } else {
      throw new Error("L'oggetto Configuration è gia stato inizializzato");
    }
  }
}

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

module.exports = { Configuration, initialConfiguration };
