package com.cricmate.backend.dto;

import java.util.List;
import java.util.stream.Collectors;
import com.cricmate.backend.model.Team;

public class TeamDto {
    private Number team_id;
    private String team_name;
    private List<PlayerDTO> players;

    public TeamDto(Team team) {
        this.team_id = team.getTeam_id();
        this.team_name = team.getTeam_name();
        this.players = team.getPlayers()
                .stream()
                .map(PlayerDTO::new)
                .collect(Collectors.toList());
    }

    public Number getTeam_id() {
        return team_id;
    }

    public String getTeam_name() {
        return team_name;
    }

    public List<PlayerDTO> getPlayers() {
        return players;
    }
}
