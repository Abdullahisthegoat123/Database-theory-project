package com.cricmate.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TopScorersDTO {
    private int playerId;
    private String playerName;
    private int runs;

    // Explicit constructor required for JPQL new expression
    public TopScorersDTO(int playerId, String playerName, long runs) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.runs = (int) runs; // cast if SUM returns long
    }
}
