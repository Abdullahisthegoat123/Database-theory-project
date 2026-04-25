package com.cricmate.backend.services;

import org.springframework.stereotype.Service;

import com.cricmate.backend.dto.MatchUpdateDTO;
import com.cricmate.backend.model.Match;
import com.cricmate.backend.model.Team;
import com.cricmate.backend.model.Tournament;
import com.cricmate.backend.repository.MatchRepository;
import com.cricmate.backend.repository.TeamRepository;
import com.cricmate.backend.repository.TournamentRepository;
import java.util.List;

@Service
public class MatchService {
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;

    public MatchService(MatchRepository matchRepository, TeamRepository teamRepository,
            TournamentRepository tournamentRepository) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.tournamentRepository = tournamentRepository;
    }

    public Match saveMatch(Match match) {
        return matchRepository.save(match);
    }

    public Match getMatchById(Integer id) {
        return matchRepository.findById(id).orElseThrow(() -> new RuntimeException("Match Not found"));
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public List<Match> getMatchesByTeamId(int teamId) {
        return matchRepository.findMatchesByTeamId(teamId);
    }

    public List<Match> getMatchesByTournamentId(int tournamentId) {
        return matchRepository.findMatchesByTournamentId(tournamentId);
    }

    public Match updateMatch(int id, MatchUpdateDTO dto) {
        Match existingMatch = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (dto.getMatchState() != null)
            existingMatch.setMatchState(dto.getMatchState());

        if (dto.getMatchFormat() != null)
            existingMatch.setMatchFormat(dto.getMatchFormat());

        if (dto.getVenue() != null)
            existingMatch.setVenue(dto.getVenue());

        if (dto.getMatchDate() != null)
            existingMatch.setMatchDate(dto.getMatchDate());

        if (dto.getTossDecision() != null)
            existingMatch.setTossDecision(dto.getTossDecision());

        if (dto.getTossWinnerTeamId() != null) {
            Team tossWinner = teamRepository.findById(dto.getTossWinnerTeamId())
                    .orElseThrow(() -> new RuntimeException("Toss winner team not found"));
            existingMatch.setTossWinnerTeam(tossWinner);
        }

        if (dto.getMatchWinnerTeamId() != null) {
            Team matchWinner = teamRepository.findById(dto.getMatchWinnerTeamId())
                    .orElseThrow(() -> new RuntimeException("Match winner team not found"));
            existingMatch.setMatchWinnerTeam(matchWinner);
        }

        if (dto.getTournamentId() != null) {
            Tournament tournament = tournamentRepository.findById(dto.getTournamentId())
                    .orElseThrow(() -> new RuntimeException("Tournament not found"));
            existingMatch.setTournament(tournament);
        }

        return matchRepository.save(existingMatch);
    }
}
