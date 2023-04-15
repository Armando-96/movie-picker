//Query per recuperare tutte le tuple da singole tabelle o da tutte le tabelle
const getUsers = "SELECT * FROM users";
const getSessions = "SELECT * FROM sessions";
const getInteractions = "SELECT * FROM interaction";
const getAll =
  "SELECT * FROM users u full join sessions s on u.user_id = s.user_id full join interaction i on s.session_id = i.session_id";
//Altre query
const getUserById = "SELECT * FROM users WHERE user_id = $1";
const getUserByUsername = "SELECT * FROM users WHERE username = $1";
const createUser = "INSERT INTO users ( username, password) VALUES ($1, $2)";
const getMaxIdSessions = "SELECT MAX(session_id) FROM sessions";
const createSession = "INSERT INTO sessions ( session_id, user_id ) VALUES ($1, $2)";
const createInteraction =
  "INSERT INTO interaction ( session_id, movie_id, preference ) VALUES ($1, $2, $3)";
const incLikes = "UPDATE sessions SET n_likes = n_likes + 1  WHERE session_id = $1";
const incViews = "UPDATE sessions SET n_views = n_views + 1  WHERE session_id = $1";
const checkFilm =
  "SELECT * FROM interaction WHERE session_id = $2 AND movie_id = $1";

module.exports = {
  getUsers,
  getSessions,
  getInteractions,
  getAll,
  getUserById,
  createUser,
  getUserByUsername,
  getMaxIdSessions,
  createSession,
  createInteraction,
  incLikes,
  incViews,
  checkFilm,
};
