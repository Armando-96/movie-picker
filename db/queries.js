//Query per recuperare tutte le tuple da singole tabelle o da tutte le tabelle
const getUsers = "SELECT * FROM users";
const getSessions = "SELECT * FROM sessions";
const getInteractions = "SELECT * FROM interactions";
const getAll =
  "SELECT * FROM users u full join sessions s on u.user_id = s.user_id full join interactions i on s.session_id = i.session_id";
//Altre query
const getUserById = "SELECT * FROM users WHERE user_id = $1";
const getUserByUsername = "SELECT * FROM users WHERE username = $1";
const createUser = "INSERT INTO users ( username, password) VALUES ($1, $2)";
const getMaxIdSessions = "SELECT MAX(session_id) FROM sessions";
const createSession =
  "INSERT INTO sessions ( session_id, user_id ) VALUES ($1, $2)";
const createInteraction =
  "INSERT INTO interactions ( session_id, movie_id, preference ) VALUES ($1, $2, $3)";
const incLikes =
  "UPDATE sessions SET n_likes = n_likes + 1  WHERE session_id = $1";
const incViews =
  "UPDATE sessions SET n_views = n_views + 1  WHERE session_id = $1";
const checkFilm =
  "SELECT * FROM interactions WHERE session_id = $2 AND movie_id = $1";
const checkMovie = "SELECT * FROM movies WHERE movie_id = $1";
const insertMovie = "INSERT INTO movies (movie_id, title, overview, duration, poster_path, rating) VALUES ($1, $2, $3, $4, $5, $6)";
const insertGenre = "INSERT INTO genres (genre_id, genre_name) VALUES ($1, $2)";
const checkGenres = "SELECT * FROM genres";
const insertMovieGenres = "INSERT INTO movies_genres (movie_id, genre_id) VALUES ($1, $2)";


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
  insertMovie,
  checkMovie,
  insertGenre,
  checkGenres,
  insertMovieGenres
};
