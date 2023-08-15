/* Replace with your SQL commands */

-- Table: public.LSystem

-- DROP TABLE IF EXISTS public."LSystem";

CREATE TABLE IF NOT EXISTS public."LSystem"
(
    lsystem_id SERIAL,
    axiom character varying COLLATE pg_catalog."default" NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    profile_id integer NOT NULL,
    CONSTRAINT "LSystem_pkey" PRIMARY KEY (lsystem_id),
    CONSTRAINT "LSystem_name_profile_id_key" UNIQUE (name, profile_id),
    CONSTRAINT profile_id FOREIGN KEY (profile_id)
        REFERENCES public."Profile" (profile_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."LSystem"
    OWNER to postgres;