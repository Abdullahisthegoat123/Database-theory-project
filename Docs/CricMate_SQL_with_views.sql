CREATE TABLE "player" (
  "player_id" int,
  "player_name" varchar(20),
  PRIMARY KEY ("player_id")
);

CREATE INDEX "Key" ON  "player" ("player_name");

CREATE TABLE "Team" (
  "team_id" int,
  "team_name" varchar(20),
  "coach" varchar(20),
  PRIMARY KEY ("team_id")
);

CREATE INDEX "Key" ON  "Team" ("team_name", "coach");

CREATE TABLE "tournament" (
  "tournament_id" int,
  "tournament_name" varchar(20),
  "organizer_name" varchar(20),
  "tournament_format" varchar(20),
  PRIMARY KEY ("tournament_id")
);

CREATE INDEX "Key" ON  "tournament" ("tournament_name", "organizer_name", "tournament_format");

CREATE TABLE "Match" (
  "match_id" int,
  "team1_id" int,
  "team2_id" int,
  "toss_winner_id" int,
  "toss_decision" varchar(20),
  "match_winner_id" int,
  "venue" varchar(20),
  "match_date" date,
  "match_state" varchar(20),
  "tournament_id" int,
  PRIMARY KEY ("match_id"),
  CONSTRAINT "FK_Match_match_winner_id"
    FOREIGN KEY ("match_winner_id")
      REFERENCES "Team"("team_id"),
  CONSTRAINT "FK_Match_toss_winner_id"
    FOREIGN KEY ("toss_winner_id")
      REFERENCES "Team"("team_id"),
  CONSTRAINT "FK_Match_team2_id"
    FOREIGN KEY ("team2_id")
      REFERENCES "Team"("team_id"),
  CONSTRAINT "FK_Match_team1_id"
    FOREIGN KEY ("team1_id")
      REFERENCES "Team"("team_id"),
  CONSTRAINT "FK_Match_tournament_id"
    FOREIGN KEY ("tournament_id")
      REFERENCES "tournament"("tournament_id")
);

CREATE INDEX "Key" ON  "Match" ("toss_decision", "venue", "match_date", "match_state");

CREATE TABLE "innings_id" (
  "innings_id" int,
  "match_id" int,
  "innings_number" int,
  "batting_team_id" int,
  "bowling_team_id" int,
  "runs" int,
  "wickets" int,
  "overs" numeric,
  "extras" int,
  PRIMARY KEY ("innings_id"),
  CONSTRAINT "FK_innings_id_bowling_team_id"
    FOREIGN KEY ("bowling_team_id")
      REFERENCES "Team"("team_id"),
  CONSTRAINT "FK_innings_id_batting_team_id"
    FOREIGN KEY ("batting_team_id")
      REFERENCES "Team"("team_id"),
  CONSTRAINT "FK_innings_id_match_id"
    FOREIGN KEY ("match_id")
      REFERENCES "Match"("match_id")
);

CREATE INDEX "Key" ON  "innings_id" ("innings_number", "runs", "wickets", "overs", "extras");

CREATE TABLE "ball_by_ball" (
  "ball_id" int,
  "innings_id" int,
  "over_number" int,
  "ball_number" int,
  "batsman_id" int,
  "bowler_id" int,
  "non_striker_id" int,
  "runs_scored" int,
  "is_wicket" boolean,
  "runs_extras" int,
  "wicket_type" varchar(20),
  PRIMARY KEY ("ball_id"),
  CONSTRAINT "FK_ball_by_ball_non_striker_id"
    FOREIGN KEY ("non_striker_id")
      REFERENCES "player"("player_id"),
  CONSTRAINT "FK_ball_by_ball_batsman_id"
    FOREIGN KEY ("batsman_id")
      REFERENCES "player"("player_id"),
  CONSTRAINT "FK_ball_by_ball_bowler_id"
    FOREIGN KEY ("bowler_id")
      REFERENCES "player"("player_id"),
  CONSTRAINT "FK_ball_by_ball_innings_id"
    FOREIGN KEY ("innings_id")
      REFERENCES "innings_id"("innings_id")
);

CREATE INDEX "Key" ON  "ball_by_ball" ("over_number", "ball_number", "runs_scored", "is_wicket", "runs_extras", "wicket_type");

CREATE TABLE "Team_player" (
  "team_id" int,
  "player_id" int,
  "join_date" date,
  PRIMARY KEY ("team_id", "player_id")
);

CREATE INDEX "Key" ON  "Team_player" ("join_date");


-- =========================================================
-- Views for CricMate
-- =========================================================

CREATE OR REPLACE VIEW match_summary_view AS
SELECT
    m.match_id,
    t1.team_name AS team1_name,
    t2.team_name AS team2_name,
    tw.team_name AS toss_winner,
    mw.team_name AS match_winner,
    tr.tournament_name,
    m.venue,
    m.match_date,
    m.match_state,
    m.toss_decision
FROM "Match" m
JOIN "Team" t1 ON m.team1_id = t1.team_id
JOIN "Team" t2 ON m.team2_id = t2.team_id
LEFT JOIN "Team" tw ON m.toss_winner_id = tw.team_id
LEFT JOIN "Team" mw ON m.match_winner_id = mw.team_id
LEFT JOIN "tournament" tr ON m.tournament_id = tr.tournament_id;

CREATE OR REPLACE VIEW player_statistics_view AS
SELECT
    p.player_id,
    p.player_name,
    COUNT(b.ball_id) AS balls_faced,
    COALESCE(SUM(b.runs_scored), 0) AS total_runs,
    COALESCE(SUM(CASE WHEN b.is_wicket = TRUE THEN 1 ELSE 0 END), 0) AS wickets_lost,
    COALESCE(SUM(b.runs_extras), 0) AS total_extras
FROM "player" p
LEFT JOIN "ball_by_ball" b ON p.player_id = b.batsman_id
GROUP BY p.player_id, p.player_name;

CREATE OR REPLACE VIEW team_performance_view AS
SELECT
    t.team_id,
    t.team_name,
    COUNT(DISTINCT m.match_id) AS matches_played,
    COALESCE(SUM(CASE WHEN m.match_winner_id = t.team_id THEN 1 ELSE 0 END), 0) AS matches_won,
    COALESCE(SUM(CASE WHEN m.match_winner_id IS NOT NULL AND m.match_winner_id <> t.team_id THEN 1 ELSE 0 END), 0) AS matches_lost
FROM "Team" t
LEFT JOIN "Match" m
    ON t.team_id = m.team1_id
    OR t.team_id = m.team2_id
GROUP BY t.team_id, t.team_name;

CREATE OR REPLACE VIEW live_score_view AS
SELECT
    i.innings_id,
    i.match_id,
    bt.team_name AS batting_team,
    bl.team_name AS bowling_team,
    COALESCE(SUM(b.runs_scored), 0) AS total_runs,
    COALESCE(SUM(b.runs_extras), 0) AS extras,
    COALESCE(SUM(CASE WHEN b.is_wicket = TRUE THEN 1 ELSE 0 END), 0) AS wickets,
    COALESCE(MAX(b.over_number), 0) AS current_over,
    COALESCE(MAX(b.ball_number), 0) AS current_ball
FROM "innings_id" i
JOIN "Team" bt ON i.batting_team_id = bt.team_id
JOIN "Team" bl ON i.bowling_team_id = bl.team_id
LEFT JOIN "ball_by_ball" b ON i.innings_id = b.innings_id
GROUP BY i.innings_id, i.match_id, bt.team_name, bl.team_name;

