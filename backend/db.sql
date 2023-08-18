\echo 'Delete and recreate stat db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE stat;
CREATE DATABASE stat;
\connect stat

\i db-schemas.sql
\i images.sql