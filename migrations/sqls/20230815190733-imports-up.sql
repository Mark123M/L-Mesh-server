/* Replace with your SQL commands */

-- Table: public.Import

-- DROP TABLE IF EXISTS public."Import";

CREATE TABLE IF NOT EXISTS public."Import"
(
    import_id SERIAL,
    symbol character varying COLLATE pg_catalog."default" NOT NULL,
    file character varying COLLATE pg_catalog."default" NOT NULL,
    lsystem_id integer NOT NULL,
    CONSTRAINT "Import_pkey" PRIMARY KEY (import_id),
    CONSTRAINT "Import_symbol_lsystem_id_key" UNIQUE (symbol, lsystem_id),
    CONSTRAINT "Import_lsystem_id_fkey" FOREIGN KEY (lsystem_id)
        REFERENCES public."LSystem" (lsystem_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Import"
    OWNER to postgres;