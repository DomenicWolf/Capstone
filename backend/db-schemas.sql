CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE players (
  summoner_id TEXT PRIMARY KEY,
  summoner_name TEXT NOT NULL,
  account_id TEXT NOT NULL,
  puuid TEXT NOT NULL,
  profile_icon INT NOT NULL,
  summoner_level INT NOT NULL,

  flex_tier TEXT ,
  flex_rank TEXT,
  flex_lp INT,
  flex_wins INT,
  flex_losses INT,

  solo_tier TEXT,
  solo_rank TEXT,
  solo_lp INT,
  solo_wins INT,
  solo_losses INT,

  tft_tier TEXT,
  tft_rank TEXT,
  tft_lp INT,
  tft_wins INT,
  tft_losses INT
);
CREATE TABLE champs (
  champ_id INT NOT NULL,
  champ_name TEXT NOT NULL,
  champ_icon TEXT NOT NULL
);

CREATE TABLE player_champs_total (
  summoner_id TEXT NOT NULL
    REFERENCES players ON DELETE CASCADE,
  champ_id INT NOT NULL,
  champ_name TEXT NOT NULL,
  champ_icon TEXT,
  games_played INT,
  games_won INT,
  games_lost INT,
  time_played INT,
  cs_per_minute NUMERIC,
  cs NUMERIC,
  kills INT,
  deaths INT,
  assists INT,
  kda NUMERIC
);

CREATE TABLE player_champs_flex (
  summoner_id TEXT NOT NULL
    REFERENCES players ON DELETE CASCADE,
  champ_id INT NOT NULL,
  champ_name TEXT NOT NULL,
  champ_icon TEXT,
  games_played INT,
  games_won INT,
  games_lost INT,
  time_played INT,
  cs_per_minute NUMERIC,
  cs NUMERIC,
  kills INT,
  deaths INT,
  assists INT,
  kda NUMERIC
);

CREATE TABLE player_champs_solo (
  summoner_id TEXT NOT NULL
    REFERENCES players ON DELETE CASCADE,
  champ_id INT NOT NULL,
  champ_name TEXT NOT NULL,
  champ_icon TEXT,
  games_played INT,
  games_won INT,
  games_lost INT,
  time_played INT,
  cs_per_minute NUMERIC,
  cs NUMERIC,
  kills INT,
  deaths INT,
  assists INT,
  kda NUMERIC
);

CREATE TABLE player_solo_matches (
  match_id TEXT NOT NULL,
  summoner_id TEXT NOT NULL
    REFERENCES players ON DELETE CASCADE,
  match_date TIMESTAMP,
  match_details jsonb
);

CREATE TABLE player_flex_matches (
  match_id TEXT NOT NULL,
  summoner_id TEXT NOT NULL
    REFERENCES players ON DELETE CASCADE,
  match_date TIMESTAMP,
  match_details jsonb
); 


CREATE TABLE player_total_matches (
  match_id TEXT NOT NULL,
  summoner_id TEXT NOT NULL
    REFERENCES players ON DELETE CASCADE,
  match_date TIMESTAMP,
  match_details jsonb
); 

CREATE TABLE player_tft_matches (
  match_id TEXT NOT NULL,
  summoner_id TEXT NOT NULL
    REFERENCES players ON DELETE CASCADE,
  match_date TIMESTAMP,
  match_details jsonb
);

CREATE TABLE items (
  item_id INT NOT NULL,
  item_name TEXT NOT NULL,
  item_icon TEXT NOT NULL,
  item_gold INT NOT NULL,
  item_stats jsonb,
  item_desc TEXT
);

CREATE TABLE sum_spells (
  sum_id TEXT NOT NULL,
  sum_name TEXT NOT NULL,
  sum_icon TEXT NOT NULL,
  sum_desc TEXT NOT NULL
);

CREATE TABLE runes (
  rune_id INT NOT NULL,
  rune_name TEXT NOT NULL,
  rune_icon TEXT NOT NULL,
  rune_icon_number INT
);

CREATE TABLE profile_icons (
  profile_id INT NOT NULL,
  profile_icon TEXT NOT NULL
);

CREATE TABLE rank_icons (
  rank_name TEXT NOT NULL,
  rank_icon TEXT NOT NULL
);



