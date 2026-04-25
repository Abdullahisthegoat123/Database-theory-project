package com.cricmate.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchUpdateDTO {
    private String matchState;
    private String matchFormat;
    private String venue;
    private LocalDateTime matchDate;
    private Integer tossWinnerTeamId;
    private String tossDecision;
    private Integer matchWinnerTeamId;
    private Integer tournamentId;
}
