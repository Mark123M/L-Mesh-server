/* Replace with your SQL commands */

-- Table: public.Ruleset

-- DROP TABLE IF EXISTS public."Ruleset";

CREATE TABLE IF NOT EXISTS public."Ruleset"
(
    ruleset_id SERIAL,
    condition character varying COLLATE pg_catalog."default" NOT NULL,
    production_id integer NOT NULL,
    CONSTRAINT "Ruleset_pkey" PRIMARY KEY (ruleset_id),
    CONSTRAINT production_id FOREIGN KEY (production_id)
        REFERENCES public."Production" (production_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Ruleset"
    OWNER to postgres;