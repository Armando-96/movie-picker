--Una volta creato il database, 
--eseguire questo file per creare le tabelle
--con postgresql
--I nomi delle tabelle users e sessions sono al prulare perchè user e session sono parole chiave di postgresql

CREATE TABLE USERS (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
);

CREATE TABLE IF NOT EXISTS public.users_test
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
    id SERIAL PRIMARY KEY,
    id_user INTEGER,
    n_likes INTEGER DEFAULT 0,
    n_views INTEGER DEFAULT 0,
    FOREIGN KEY (id_user) REFERENCES USERS(id)
);

CREATE TABLE INTERACTION (
    id_session INTEGER,
    id_film TEXT,
    preference TEXT CHECK(preference IN ('like', 'dislike', 'selected')),
    PRIMARY KEY (id_session, id_film),
    FOREIGN KEY (id_session) REFERENCES SESSIONS(id) ON DELETE CASCADE
);