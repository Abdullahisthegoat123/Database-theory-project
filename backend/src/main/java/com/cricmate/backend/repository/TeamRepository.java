package com.cricmate.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cricmate.backend.model.Team;
public interface TeamRepository extends JpaRepository<Team, Integer> {
    
}
