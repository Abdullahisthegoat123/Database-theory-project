package com.cricmate.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CareerBowlingStatsDTO {

    private int playerId;
    private String playerName;
    private String matchFormat;
    private long totalRuns;
    private long totalBalls;
    private long totalWickets;
    private long fours;
    private long sixes;
    private double economy;

    // public CareerBowlingStatsDTO(int playerId, String playerName, String matchFormat,
    //         long totalRuns, long totalBalls,
    //         long totalWickets, long fours,
    //         long sixes, double economy) {
    //     this.playerId = playerId;
    //     this.playerName = playerName;
    //     this.matchFormat = matchFormat;
    //     this.totalRuns = totalRuns;
    //     this.totalBalls = totalBalls;
    //     this.totalWickets = totalWickets;
    //     this.fours = fours;
    //     this.sixes = sixes;
    //     this.economy = economy;
    // }

    // // getters only (career stats don't change)
    // public int getPlayerId() {
    //     return playerId;
    // }

    // public String getPlayerName() {
    //     return playerName;
    // }
    
    // public String getMatchFormat() {
    //     return matchFormat;
    // }

    // public long getTotalRuns() {
    //     return totalRuns;
    // }

    // public long getTotalBalls() {
    //     return totalBalls;
    // }

    // public long getTotalWickets() {
    //     return totalWickets;
    // }

    // public long getFours() {
    //     return fours;
    // }

    // public long getSixes() {
    //     return sixes;
    // }

    // public double getEconomy() {
    //     return economy;
    // }
}
