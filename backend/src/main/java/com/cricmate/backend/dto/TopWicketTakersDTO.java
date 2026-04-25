package com.cricmate.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TopWicketTakersDTO {
    private int playerId;
    private String playerName;
    private int wickets;

    // Explicit constructor for JPQL new expression
    public TopWicketTakersDTO(int playerId, String playerName, long wickets) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.wickets = (int) wickets; // cast if using SUM/COUNT in JPQL
    }
}
