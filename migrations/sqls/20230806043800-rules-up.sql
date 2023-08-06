/* Replace with your SQL commands */

-- Table: public.Rule

-- DROP TABLE IF EXISTS public."Rule";

CREATE TABLE IF NOT EXISTS public."Rule"
(
    rule_id SERIAL,
    prob character varying COLLATE pg_catalog."default" NOT NULL,
    rule character varying COLLATE pg_catalog."default" NOT NULL,
    ruleset_id integer NOT NULL,
    CONSTRAINT "Rule_pkey" PRIMARY KEY (rule_id),
    CONSTRAINT ruleset_id FOREIGN KEY (ruleset_id)
        REFERENCES public."Ruleset" (ruleset_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Rule"
    OWNER to postgres;