const path = require("path");
const bcrypt = require("bcrypt");
const pool = require("./../db/db.js");
const queries = require("./../db/queries.js");

module.exports.createUser = (req, res) => {
  const { username, email, location, password } = req.body;
  // Verifica la presenza dell'username nel database
  pool.query(
    "SELECT username FROM users_test WHERE username = $1",
    [username],
    async (error, results) => {
      if (error) throw error;
      const exist = results.rows.length;
      if (exist) {
        res.status(400).send("Username already exists");
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        pool.query(
          "INSERT INTO users_test (username, email, salt, bcrypt_hash, user_location) VALUES ($1, $2, $3, $4, $5)",
          [username, email, salt, hashedPassword, location],
          (error, result) => {
            if (error) throw error;
            res.status(201).sendFile(path.resolve("./public/login.html"));
          }
        );
      }
    }
  );
};
