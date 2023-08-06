/* Replace with your SQL commands */

-- Table: public.Profile

-- DROP TABLE IF EXISTS public."Profile";

CREATE TABLE IF NOT EXISTS public."Profile"
(
    profile_id SERIAL,
    username character varying(64) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    isadmin boolean NOT NULL,
    CONSTRAINT "Profile_pkey" PRIMARY KEY (profile_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Profile"
    OWNER to postgres;