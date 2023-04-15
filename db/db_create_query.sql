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
    user_id integer NOT NULL DEFAULT nextval('"UsersTest_user_id_seq"'::regclass),
    username character varying(30) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    salt character varying(255) COLLATE pg_catalog."default" NOT NULL,
    bcrypt_hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    user_location character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "UsersTest_pkey" PRIMARY KEY (user_id),
    CONSTRAINT unique_email UNIQUE (email),
    CONSTRAINT unique_salt UNIQUE (salt),
    CONSTRAINT unique_username UNIQUE (username)
)

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