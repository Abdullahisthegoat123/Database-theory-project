package com.cricmate.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CareerBattingStatsDTO {

    private Integer playerId;
    private String playerName;
    private String matchFormat;

    private Long notOuts;
    private Long totalRuns;
    private Long totalBalls;

    private Double average;
    private Double strikeRate;

    private Long fours;
    private Long sixes;
    private Long hundreds;
    private Long fifties;

    // IMPORTANT: Hibernate needs THIS exact constructor
    public CareerBattingStatsDTO(
            Integer playerId,
            String playerName,
            String matchFormat,
            Long notOuts,
            Long totalRuns,
            Long totalBalls,
            Double average,
            Double strikeRate,
            Long fours,
            Long sixes,
            Long hundreds,
            Long fifties) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.matchFormat = matchFormat;
        this.notOuts = notOuts;
        this.totalRuns = totalRuns;
        this.totalBalls = totalBalls;
        this.average = average;
        this.strikeRate = strikeRate;
        this.fours = fours;
        this.sixes = sixes;
        this.hundreds = hundreds;
        this.fifties = fifties;
    }
}
