package com.cricmate.backend.repository;

import com.cricmate.backend.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TournamentRepository extends JpaRepository<Tournament, Integer> {
    
}
