-- PostgREST needs explicit USAGE/SELECT/INSERT grants on the new schema;
-- exposing it in Project Settings alone doesn't grant role privileges.

GRANT USAGE ON SCHEMA proyecto_dos TO anon, authenticated;

GRANT SELECT ON proyecto_dos.products TO anon, authenticated;
GRANT INSERT ON proyecto_dos.reservations TO anon, authenticated;

-- Make sure future tables in this schema keep working without a repeat grant.
ALTER DEFAULT PRIVILEGES IN SCHEMA proyecto_dos
  GRANT SELECT ON TABLES TO anon, authenticated;
