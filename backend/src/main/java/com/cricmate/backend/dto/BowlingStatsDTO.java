package com.cricmate.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BowlingStatsDTO {
    private int bowlerId;
    private String bowlerName;
    private Long runsConceded; // Long instead of int
    private Long balls; // Long instead of int
    private Long wickets; // Long instead of int
    private long fours;
    private long sixes;
    private Double economyRate;

}
