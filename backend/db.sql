\echo 'Delete and recreate true_stat db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE true_stat_db;
CREATE DATABASE true_stat_db;
\connect true_stat_db


\i db-schemas.sql
CREATE INDEX idx_players_summoner_id ON players (summoner_id);
CREATE INDEX idx_summoner_id_match_id ON player_total_matches (summoner_id, match_id);
CREATE INDEX idx_summoner_id_match_id_solo ON player_solo_matches (summoner_id, match_id);
CREATE INDEX idx_summoner_id_match_id_flex ON player_flex_matches (summoner_id, match_id);
CREATE INDEX idx_champs_id ON champs (champ_id);
CREATE INDEX idx_summoner_id_champ_id_total ON player_champs_total (summoner_id, champ_id);
CREATE INDEX idx_summoner_id_champ_id_solo ON player_champs_solo (summoner_id, champ_id);
CREATE INDEX idx_summoner_id_champ_id_flex ON player_champs_flex (summoner_id, champ_id);

