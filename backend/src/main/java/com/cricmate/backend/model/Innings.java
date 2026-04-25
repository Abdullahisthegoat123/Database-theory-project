package com.cricmate.backend.model;

import jakarta.persistence.*;
import java.util.List;
// import com.cricmate.backend.model.Ball;
// import org.aspectj.weaver.ast.Not;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Innings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int innings_id;

    // foriegn key, and this actually owns the relationship ie will update the db
    @ManyToOne
    @JoinColumn(name = "match_id")
    @JsonBackReference
    private Match match;
    // Innings has a @ManyToOne relationship with Match
    // Innings table has a match_id foreign key column
    // You need a valid match_id to create an innings
    // so match owns the relationship?


    // foriegn key, no reverse mapping we did for for this tho
    // Only needed if you want: team.getBattingInnings() or team.getBowlingInnings() in Java.
    // Not needed if you’re fine with querying innings by inningsRepository.findByBattingTeam(team) instead.
    
    @ManyToOne
    @JoinColumn(name = "batting_team_id")
    private Team battingTeam;


    @ManyToOne
    @JoinColumn(name = "bowling_team_id")
    private Team bowlingTeam;
    // are primitive types (int and float), they cannot store null in Java — they
    // always default to 0.
    // this should depend on ball by ball right? ke ball by ball for each innings gets summed up
    // private int totalRuns;
    // private int wickets;
    // private float overs;
    // for nll: private Integer totalRuns;

    // owning side is a field named innings in the balls table
    @OneToMany(mappedBy = "innings", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Ball> balls;
   

    // Getters & Setters
    public int getInnings_id() {
        return innings_id;
    }

    public void setInnings_id(int innings_id) {
        this.innings_id = innings_id;
    }

    public Match getMatch() {
        return match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public Team getBattingTeam() {
        return battingTeam;
    }

    public void setBattingTeam(Team battingTeam) {
        this.battingTeam = battingTeam;
    }

    public Team getBowlingTeam() {
        return bowlingTeam;
    }

    public void setBowlingTeam(Team bowlingTeam) {
        this.bowlingTeam = bowlingTeam;
    }

    // public int getTotalRuns() {
    //     return totalRuns;
    // }

    // public void setTotalRuns(int totalRuns) {
    //     this.totalRuns = totalRuns;
    // }

    // public int getWickets() {
    //     return wickets;
    // }

    // public void setWickets(int wickets) {
    //     this.wickets = wickets;
    // }

    // public float getOvers() {
    //     return overs;
    // }

    // public void setOvers(float overs) {
    //     this.overs = overs;
    // }

    public List<Ball> getBalls() {
        return balls;
    }

    public void setBalls(List<Ball> balls) {
        this.balls = balls;
    }
}

// Innings has a @ManyToOne relationship with Match
// Innings table has a match_id foreign key column
// You need a valid match_id to create an innings


