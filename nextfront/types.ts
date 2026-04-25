export interface Player {
  player_id: number;
  player_name: string;
  full_name: string;
  age: string;
  date_of_birth: string; // e.g., "1994-11-04"
  batting_style: string; // e.g., "Left hand Bat"
  bowling_style: string; // e.g., "Legbreak"
  playing_role: string; // e.g., "Top order Batter"
}


export interface Tournament {
  tournament_id: number;
  tournament_name: string;
}

export interface Ball {
  ball_id: number
  overNumber: number;
  ballNumber: number;
  batsman: Player;
  bowler: Player;
  runs: number;
  wicket: boolean;
}

export interface Team {
  team_id: number;
  team_name: string;
}

export interface Innings {
  innings_id: number;
  battingTeam: Team;
  bowlingTeam: Team;
  balls: Ball[];
}

export interface Match {
  match_id: number;
  matchState?: string;
  matchDate?: string;
  venue?: string;
  tournament?: Tournament;
  tossWinnerTeam?: Team | null;
  tossDecision?: string;
  matchWinnerTeam?: Team | null;
  result?: string;
  matchFormat?: string;
  teamA?: Team;
  teamB?: Team;
  innings?: Innings[];
}

export interface TeamWithPlayers {
  team_id: number;
  team_name: string;
  players: Player[];
};
