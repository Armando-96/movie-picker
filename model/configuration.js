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

module.exports = Configuration;
