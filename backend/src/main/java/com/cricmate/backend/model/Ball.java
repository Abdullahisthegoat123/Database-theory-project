package com.cricmate.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
public class Ball {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ball_id;

    @ManyToOne
    @JoinColumn(name = "innings_id")
    @JsonBackReference
    private Innings innings;

    @ManyToOne
    @JoinColumn(name = "batsman_id")
    private Player batsman;

    @ManyToOne
    @JoinColumn(name = "bowler_id")
    private Player bowler;

    private int overNumber;
    private int ballNumber;
    private int runs;
    private boolean isWicket;

    // Getters & Setters
    public int getBall_id() {
        return ball_id;
    }

    public void setBall_id(int ball_id) {
        this.ball_id = ball_id;
    }

    public Innings getInnings() {
        return innings;
    }

    public void setInnings(Innings innings) {
        this.innings = innings;
    }

    public Player getBatsman() {
        return batsman;
    }

    public void setBatsman(Player batsman) {
        this.batsman = batsman;
    }

    public Player getBowler() {
        return bowler;
    }

    public void setBowler(Player bowler) {
        this.bowler = bowler;
    }

    public int getOverNumber() {
        return overNumber;
    }

    public void setOverNumber(int overNumber) {
        this.overNumber = overNumber;
    }

    public int getBallNumber() {
        return ballNumber;
    }

    public void setBallNumber(int ballNumber) {
        this.ballNumber = ballNumber;
    }

    public int getRuns() {
        return runs;
    }

    public void setRuns(int runs) {
        this.runs = runs;
    }

    public boolean isWicket() {
        return isWicket;
    }

    public void setWicket(boolean isWicket) {
        this.isWicket = isWicket;
    }
}
