package com.cricmate.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // data automatically generates setters and getters
@AllArgsConstructor // a constructor that takes all fields
@NoArgsConstructor
public class BattingStatsSimple {
    private int batsman_id;
    private String batsman_name;
    private long runs; // make this long because SUM returns Long
    private long balls; // same here — count() returns Long
    private long fours;
    private long sixes;
    private Double strikeRate;

}
