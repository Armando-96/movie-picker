const bcrypt = require("bcrypt");
const pool = require("./../db/db.js");
const path = require("path");
const queries = require("./../db/queries.js");
const { initializeSession } = require("./session-controllers.js");

let session;
module.exports.loginPost = async (req, res) => {
  const { username, password } = req.body;
  const results = await pool.query(
    "SELECT user_id, username, bcrypt_hash FROM users WHERE username = $1",
    [username]
  );
  if (results.rows.length) {
    const { bcrypt_hash } = results.rows[0];
    bcrypt.compare(password, bcrypt_hash, async (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send("Errore elaborazione password");
      }
      if (result) {
        const user = results.rows[0];
        req.session.username = username;
        console.log("req.session:", req.session);
        res.send(
          `Hey there, welcome ${username} <a href=\'/logout'>click to logout</a>`
        );
        //initializeSession(user, res);
        // res.send("Complimenti ti sei loggato con successo!");
      } else res.status(400).send("Password errata");
    });
  } else {
    res.status(400).send("Username doesn't exist");
  }
};

module.exports.loginGet = (req, res) => {
  console.log("req.session", req.session);
  if (req.session.username) {
    let username = req.session.username;
    res.send(
      `Hey there, welcome ${username} <a href=\'/logout'>click to logout</a>`
    );
  } else res.sendFile(path.resolve("./public/login.html"));
};
