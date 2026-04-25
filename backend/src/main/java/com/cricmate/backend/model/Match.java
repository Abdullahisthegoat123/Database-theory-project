package com.cricmate.backend.model;


import java.time.LocalDateTime;
// import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int match_id;


    
    // owning side
    // Key point: The entity that has the @JoinColumn is always the owning side. 
    // Hibernate will use that side to manage the foreign key in the database.

    @ManyToOne // many match objects can reference a single team
    @JoinColumn(name = "team_a_id") // which column in the match table holds foreign key, JPA will handle the match
    private Team teamA; // the java object
    // Database column: team_a_id → stores the actual foreign key integer.(i actualled made them both same)
    // Java field: teamA → object reference to a Team.

    @ManyToOne // Many matches can reference the referenced column
    @JoinColumn(name = "team_b_id")
    private Team teamB;

    @ManyToOne // Many matches can reference the referenced column
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    private String venue;

    // matchDate → Java field name (camelCase, standard in Java).
    // "match_date" → database column name (snake_case, often used in SQL).
    @Column(name = "match_date")
    private LocalDateTime MatchDate;   
    
    // one match many innings
    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL) // innings entity has a field called match that owns the relationship
    @JsonManagedReference
    private List<Innings> innings;
    // This tells JPA: “don’t create a separate join table; use the match_id foreign
    // key in the Innings table.”
    // any operation on Match (save, delete, update) will automatically propagate to
    // all its innings.

    // Match table: Never updates when you add innings
    // Innings table: Stores match_id foreign key pointing to match
    // On fetch: JPA joins the tables automatically

    private String matchState; // public enum MatchState { UPCOMING, ONGOING, COMPLETED, ABANDONED, NO_RESULT }
    private String matchFormat;
    @ManyToOne
    @JoinColumn(name = "toss_winner_team_id")
    private Team tossWinnerTeam;

    private String tossDecision; // yahan value in? public enum TossDecision { BAT, FIELD }

    @ManyToOne
    @JoinColumn(name = "match_winner_team_id")
    private Team matchWinnerTeam;

    // Getters & Setters
    public int getMatch_id() {
        return match_id;
    }

    public void setMatch_id(int match_id) {
        this.match_id = match_id;
    }
    
    public Team getTeamA() {
        return teamA;
    }

    public void setTeamA(Team teamA) {
        this.teamA = teamA;
    }

    public Team getTeamB() {
        return teamB;
    }

    public void setTeamB(Team teamB) {
        this.teamB = teamB;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public LocalDateTime getMatchDate() {
        return MatchDate;
    }

    public void setMatchDate(LocalDateTime match_date) {
        this.MatchDate = match_date;
    }

    public List<Innings> getInnings() {
        return innings;
    }

    public void setInnings(List<Innings> innings) {
        this.innings = innings;
    }

    public Team getTossWinnerTeam(){
        return this.tossWinnerTeam;
    }
    
    public Team getMatchWinnerTeam() {
        return this.matchWinnerTeam;
    }
    public String getTossDecision(){
        return this.tossDecision;
    }
    public String getMatchState(){
        return this.matchState;
    }
    
    public Tournament getTournament() {
        return tournament;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }
    
    public void setTossWinnerTeam(Team tossWinnerTeam) {
        this.tossWinnerTeam = tossWinnerTeam;
    }

    public void setMatchWinnerTeam(Team matchWinnerTeam) {
        this.matchWinnerTeam = matchWinnerTeam;
    }

    public void setTossDecision(String tossDecision) {
        this.tossDecision = tossDecision;
    }

    public void setMatchFormat(String matchFormat) {
        this.matchFormat = matchFormat;
    }
    
    public String getMatchFormat() {
        return this.matchFormat;
    }

    public void setMatchState(String matchState) {
        this.matchState = matchState;
    }

}
