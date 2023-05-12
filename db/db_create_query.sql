--Una volta creato il database, 
--eseguire questo file per creare le tabelle
--con postgresql
--I nomi delle tabelle users e sessions sono al prulare perchè user e session sono parole chiave di postgresql

CREATE TABLE USERS
(
    user_id SERIAL PRIMARY KEY,
    username varchar(30) NOT NULL,
    email varchar(255) NOT NULL,
    salt varchar(255) NOT NULL,
    bcrypt_hash varchar(255) NOT NULL,
    user_location varchar(50) NOT NULL,
    CONSTRAINT unique_email UNIQUE (email),
    CONSTRAINT unique_salt UNIQUE (salt),
    CONSTRAINT unique_username UNIQUE (username)
);

CREATE TABLE FAVOURITES (
    user_id INTEGER,
    movie_id TEXT,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES MOVIES(movie_id) ON DELETE CASCADE
);

CREATE TABLE MOVIES (
    movie_id TEXT,
    title TEXT NOT NULL,
    overview TEXT NOT NULL,
    duration INTEGER NOT NULL,
    poster_path varchar(255) NOT NULL,
    rating REAL NOT NULL,
    PRIMARY KEY (movie_id)
);

CREATE TABLE SESSIONS (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    n_likes INTEGER DEFAULT 0 NOT NULL,
    n_views INTEGER DEFAULT 0 NOT NULL,
    CONSTRAINT unique_user_id_creation_date UNIQUE (user_id, creation_date),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE INTERACTIONS (
    session_id INTEGER,
    movie_id TEXT,
    preference TEXT CHECK(preference IN ('like', 'dislike', 'selected')),
    interaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id, movie_id),
    FOREIGN KEY (session_id) REFERENCES SESSIONS(session_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES MOVIES(movie_id) ON DELETE CASCADE
);

CREATE TABLE SELECTED  (
    session_id INTEGER,
    movie_id TEXT NOT NULL,
    PRIMARY KEY (session_id),
    FOREIGN KEY (session_id) REFERENCES SESSIONS(session_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES MOVIES(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (session_id, movie_id) REFERENCES INTERACTIONS(session_id, movie_id) ON DELETE CASCADE
);

CREATE TABLE GENRES (
    genre_id INTEGER,
    genre_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (genre_id)
);

CREATE TABLE MOVIES_GENRES (
    movie_id TEXT,
    genre_id INTEGER,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES MOVIES(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES GENRES(genre_id) ON DELETE CASCADE
);