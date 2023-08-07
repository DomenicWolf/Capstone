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

CREATE TABLE player_champs (
  summoner_id TEXT PRIMARY KEY
    REFERENCES players ON DELETE CASCADE,
  champ_id INT NOT NULL,
  champ_name TEXT NOT NULL,
  games_played INT,
  games_won INT,
  games_lost INT
);

