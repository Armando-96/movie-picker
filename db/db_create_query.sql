--Una volta creato il database, 
--eseguire questo file per creare le tabelle
--con postgresql
--I nomi delle tabelle users e sessions sono al prulare perchè user e session sono parole chiave di postgresql

CREATE TABLE IF NOT EXISTS public.users
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

CREATE TABLE SESSIONS (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    n_likes INTEGER DEFAULT 0,
    n_views INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE INTERACTION (
    session_id INTEGER,
    movie_id TEXT,
    preference TEXT CHECK(preference IN ('like', 'dislike', 'selected')),
    PRIMARY KEY (session_id, movie_id),
    FOREIGN KEY (session_id) REFERENCES SESSIONS(session_id) ON DELETE CASCADE
);