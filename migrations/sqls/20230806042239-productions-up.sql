/* Replace with your SQL commands */

-- Table: public.Production

-- DROP TABLE IF EXISTS public."Production";

CREATE TABLE IF NOT EXISTS public."Production"
(
    production_id SERIAL,
    symbol character varying COLLATE pg_catalog."default" NOT NULL,
    lsystem_id integer NOT NULL,
    CONSTRAINT "Production_pkey" PRIMARY KEY (production_id),
    CONSTRAINT "Production_symbol_lsystem_id_key" UNIQUE (symbol, lsystem_id),
    CONSTRAINT lsystem_id FOREIGN KEY (lsystem_id)
        REFERENCES public."LSystem" (lsystem_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Production"
    OWNER to postgres;