BEGIN;

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS columns CASCADE;
DROP TABLE IF EXISTS board_members CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS users CASCADE;

\echo 'Creating users table...'
CREATE TABLE IF NOT EXISTS public.users
(
    id serial NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

\echo 'Creating boards table...'
CREATE TABLE IF NOT EXISTS public.boards
(
    id serial NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    owner_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT boards_pkey PRIMARY KEY (id)
);

\echo 'Creating board_members table...'
CREATE TABLE IF NOT EXISTS public.board_members
(
    board_id integer NOT NULL,
    user_id integer NOT NULL,
    role character varying(20) COLLATE pg_catalog."default" DEFAULT 'member'::character varying,
    CONSTRAINT board_members_pkey PRIMARY KEY (board_id, user_id)
);

\echo 'Creating columns table...'
CREATE TABLE IF NOT EXISTS public.columns
(
    id serial NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "position" integer NOT NULL,
    board_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT columns_pkey PRIMARY KEY (id)
);

\echo 'Creating cards table...'
CREATE TABLE IF NOT EXISTS public.cards
(
    id serial NOT NULL,
    title character varying(200) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    "position" integer NOT NULL,
    board_id integer,
    column_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cards_pkey PRIMARY KEY (id)
);

\echo 'Creating notifications table...'
CREATE TABLE IF NOT EXISTS public.notifications
(
    id serial NOT NULL,
    user_id integer NOT NULL,
    type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    message text COLLATE pg_catalog."default" NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

\echo 'DONE...'

END;