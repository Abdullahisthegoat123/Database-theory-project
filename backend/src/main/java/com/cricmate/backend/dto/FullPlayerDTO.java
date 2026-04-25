package com.cricmate.backend.dto;

import java.util.Set;
import java.util.stream.Collectors;

import com.cricmate.backend.model.Player;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FullPlayerDTO {
    private int player_id;
    private String player_name;
    private Set<TeamDto> teams; // use TeamDto instead of Team entity

    // Custom constructor from Player entity
    // public FullPlayerDTO(Player player) {
    //     this.player_id = player.getPlayer_id();
    //     this.player_name = player.getPlayer_name();
    //     this.teams = player.getTeams().stream()
    //             .map(team -> new TeamDto(
    //                     team.getTeam_id(), // id
    //                     team.getTeam_name(), // name
    //                     team.getPlayers().stream()
    //                             .map(Player::getPlayer_id)
    //                             .collect(Collectors.toList()) // playerIds
    //             ))
    //             .collect(Collectors.toSet());
    // }
    public FullPlayerDTO(Player player) {
        this.player_id = player.getPlayer_id();
        this.player_name = player.getPlayer_name();
        this.teams = player.getTeams().stream()
                .map(team -> new TeamDto(
                        team // infers khudse
                ))
                .collect(Collectors.toSet());
    }
}
