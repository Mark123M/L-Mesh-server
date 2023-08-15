/* Replace with your SQL commands */

-- Table: public.Constant

-- DROP TABLE IF EXISTS public."Constant";

CREATE TABLE IF NOT EXISTS public."Constant"
(
    constant_id SERIAL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    value character varying COLLATE pg_catalog."default" NOT NULL,
    lsystem_id integer NOT NULL,
    CONSTRAINT "Constant_pkey" PRIMARY KEY (constant_id),
    CONSTRAINT "Constant_name_lsystem_id_key" UNIQUE (name, lsystem_id),
    CONSTRAINT "Constant_lsystem_id_fkey" FOREIGN KEY (lsystem_id)
        REFERENCES public."LSystem" (lsystem_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Constant"
    OWNER to postgres;