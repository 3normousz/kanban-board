BEGIN;


CREATE TABLE IF NOT EXISTS public.users
(
    id serial NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

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

CREATE TABLE IF NOT EXISTS public.board_members
(
    board_id integer NOT NULL,
    user_id integer NOT NULL,
    role character varying(20) COLLATE pg_catalog."default" DEFAULT 'member'::character varying,
    CONSTRAINT board_members_pkey PRIMARY KEY (board_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.columns
(
    id serial NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "position" integer NOT NULL,
    board_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT columns_pkey PRIMARY KEY (id)
);

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

ALTER TABLE IF EXISTS public.boards
    ADD CONSTRAINT boards_owner_id_fkey FOREIGN KEY (owner_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.board_members
    ADD CONSTRAINT board_members_board_id_fkey FOREIGN KEY (board_id)
    REFERENCES public.boards (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.board_members
    ADD CONSTRAINT board_members_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.columns
    ADD CONSTRAINT columns_board_id_fkey FOREIGN KEY (board_id)
    REFERENCES public.boards (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.cards
    ADD CONSTRAINT cards_board_id_fkey FOREIGN KEY (board_id)
    REFERENCES public.boards (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.cards
    ADD CONSTRAINT cards_column_id_fkey FOREIGN KEY (column_id)
    REFERENCES public.columns (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

END;