const bcrypt = require("bcrypt");
const pool = require("./../db/db.js");
const queries = require("./../db/queries.js");

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  pool.query(
    "SELECT username, bcrypt_hash FROM users_test WHERE username = $1",
    [username],
    (error, results) => {
      const exist = results.rows.length;
      if (exist) {
        const { bcrypt_hash } = results.rows[0];
        bcrypt.compare(password, bcrypt_hash, (err, result) => {
          if (err) {
            console.log(err);
            res.status(400).send("Errore elaborazione password");
          }
          if (result) res.send("Complimenti ti sei loggato con successo!");
          else res.status(400).send("Password errata");
        });
        // if (user.password === password) {
        //   initializeSession(user, res); //Ora c'è solo discovery, ma poi andrà messa una schermata di scelta fra discovery e watch now
        // } else {
        //   res.status(400).send("Wrong password");
        // }
      } else {
        res.status(400).send("Username doesn't exist");
      }
    }
  );
};

const initializeSession = async (user, res) => {
  const id_session = (await getMaxIdSessions()) + 1;
  createSession(id_session, user.id);
  //Inseriamo l'id della sessione nel cookie e altri dati di convenienza
  res.cookie("id_session", String(id_session));
  res.cookie("id_user", String(user.id));
  res.cookie("username", user.username);
  renderFirstMovie(user.username, id_session, res);
};
