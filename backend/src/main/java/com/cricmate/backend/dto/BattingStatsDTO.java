package com.cricmate.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data // data automatically generates setters and getters
@AllArgsConstructor // a constructor that takes all fields
@NoArgsConstructor
public class BattingStatsDTO {
    private String batsmanName;
    private int runs;
    private int balls;
    private int fours;
    private int sixes;
    private boolean out;
}
