package com.cricmate.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cricmate.backend.model.Player;

// inteface tells what methods a class must have but doesnt define them, the class that inherits it needs to define
public interface PlayerRepository extends JpaRepository<Player, Integer> {
// we extend jpa to get some built-in crud features, playerRepository will define some additional features
}
