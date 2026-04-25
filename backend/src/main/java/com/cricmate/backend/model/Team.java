package com.cricmate.backend.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int team_id;
    private String team_name;

    // Many-to-Many mapped by teams field in Player
    @ManyToMany(mappedBy = "teams")
    @JsonBackReference // prevents infinite recursion
    private Set<Player> players = new HashSet<>(); 
    
    // constructors created for stuff like dto
    public Team() {
    } // required by JPA - why?

    public Team(String team_name){
        this.team_name = team_name;
    }
    // Getters & Setters
    public int getTeam_id() {
        return team_id;
    }

    public void setTeam_id(int team_id) {
        this.team_id = team_id;
    }

    public String getTeam_name() {
        return team_name;
    }

    public void setTeam_name(String team_name) {
        this.team_name = team_name;
    }
    
    public Set<Player> getPlayers() {
        return players;
    }

    public void setPlayers(Set<Player> players) {
        this.players = players;
    }
}
