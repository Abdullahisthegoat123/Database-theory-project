package com.cricmate.backend.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int player_id;

    private String player_name;
    private String full_name;
    private String date_of_birth;
    // private String age;
    private String batting_style;
    private String bowling_style;
    private String playing_role;

    @ManyToMany
    @JoinTable(name = "Team_player", joinColumns = @JoinColumn(name = "player_id"), inverseJoinColumns = @JoinColumn(name = "team_id"))
    @JsonBackReference
    private Set<Team> teams = new HashSet<>();

    // You can keep custom getters/setters if needed
    public int getPlayer_id() {
        return player_id;
    }

    public void setPlayer_id(int player_id) {
        this.player_id = player_id;
    }

     // Compute age on the fly
    @Transient
    public String getAge() {
        if (date_of_birth == null || date_of_birth.isEmpty()) return null;

        LocalDate dob = LocalDate.parse(date_of_birth, DateTimeFormatter.ISO_DATE);
        Period period = Period.between(dob, LocalDate.now());
        return period.getYears() + "y " + period.getMonths() + "m " + period.getDays() + "d";
    }
}
