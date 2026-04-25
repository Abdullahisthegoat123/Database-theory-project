package com.cricmate.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.cricmate.backend.model.Match;

import java.util.List;


public interface MatchRepository extends JpaRepository<Match, Integer> {
    @Query("SELECT m FROM Match m WHERE m.teamA.team_id = :teamId OR m.teamB.team_id = :teamId")
    List<Match> findMatchesByTeamId(@Param("teamId") int teamId);

    @Query("SELECT m FROM Match m WHERE m.tournament.tournament_id = :tournamentId")
    List<Match> findMatchesByTournamentId(@Param("tournamentId") int tournamentId);
}