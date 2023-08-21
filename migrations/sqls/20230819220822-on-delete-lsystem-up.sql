/* Replace with your SQL commands */

ALTER TABLE public."Production"
DROP CONSTRAINT lsystem_id,
ADD CONSTRAINT lsystem_id
   FOREIGN KEY (lsystem_id)
   REFERENCES public."LSystem"(lsystem_id)
   ON DELETE CASCADE;

ALTER TABLE public."Ruleset"
DROP CONSTRAINT production_id,
ADD CONSTRAINT production_id
   FOREIGN KEY (production_id)
   REFERENCES public."Production"(production_id)
   ON DELETE CASCADE;

ALTER TABLE public."Rule"
DROP CONSTRAINT ruleset_id,
ADD CONSTRAINT ruleset_id
   FOREIGN KEY (ruleset_id)
   REFERENCES public."Ruleset"(ruleset_id)
   ON DELETE CASCADE;

ALTER TABLE public."Constant"
DROP CONSTRAINT Constant_lsystem_id_fkey,
ADD CONSTRAINT lsystem_id
   FOREIGN KEY (lsystem_id)
   REFERENCES public."LSystem"(lsystem_id)
   ON DELETE CASCADE;

ALTER TABLE public."Import"
DROP CONSTRAINT Import_lsystem_id_fkey,
ADD CONSTRAINT lsystem_id
   FOREIGN KEY (lsystem_id)
   REFERENCES public."LSystem"(lsystem_id)
   ON DELETE CASCADE;