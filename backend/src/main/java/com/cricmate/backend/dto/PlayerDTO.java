package com.cricmate.backend.dto;

import com.cricmate.backend.model.Player;

public class PlayerDTO {
    private int player_id;
    private String player_name;

    public PlayerDTO(Player p) {
        this.player_id = p.getPlayer_id();
        this.player_name = p.getPlayer_name();
    }

    public int getPlayer_id() {
        return player_id;
    }

    public String getPlayer_name() {
        return player_name;
    }
}
