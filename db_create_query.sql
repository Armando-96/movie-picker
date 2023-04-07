--Una volta creato il database, 
--eseguire questo file per creare le tabelle
--con postgresql
CREATE TABLE USERS (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
);

CREATE TABLE SESSIONS (
    id SERIAL PRIMARY KEY,
    id_user INTEGER,
    n_likes INTEGER,
    n_views INTEGER,
    FOREIGN KEY (id_user) REFERENCES USERS(id)
);

CREATE TABLE INTERACTION (
    id_session INTEGER,
    id_film TEXT,
    preference TEXT CHECK(preference IN ('like', 'dislike', 'selected')),
    PRIMARY KEY (id_session, id_film),
    FOREIGN KEY (id_session) REFERENCES SESSIONS(id) ON DELETE CASCADE
);