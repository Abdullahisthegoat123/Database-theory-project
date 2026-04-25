package com.cricmate.backend.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tournament_id;
    private String tournament_name;

    

    // constructors created for stuff like dto
    public Tournament() {
    } // required by JPA - why?

    public Tournament(String tournament_name) {
        this.tournament_name = tournament_name;
    }

    // Getters & Setters
    public int getTournament_id() {
        return tournament_id;
    }

    public void setTournament_id(int tournament_id) {
        this.tournament_id = tournament_id;
    }

    public String getTournament_name() {
        return tournament_name;
    }

    public void setTournament_name(String tournament_name) {
        this.tournament_name = tournament_name;
    }

    
}
