package com.cricmate.backend.controller;

import com.cricmate.backend.dto.MatchUpdateDTO;
import com.cricmate.backend.model.Match;
import com.cricmate.backend.services.MatchService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
@CrossOrigin(origins = "*")
public class MatchController {
    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PostMapping
    public Match createMatch(@RequestBody Match match) {
        return matchService.saveMatch(match);
    }

    @GetMapping
    public List<Match> getAllMatches() {
        return matchService.getAllMatches();
    }

    @GetMapping("/{id}")
    public Match getMatchById(@PathVariable Integer id) {
        return matchService.getMatchById(id);
    }

    @GetMapping("/team/{teamId}")
    public List<Match> getMatchesByTeamId(@PathVariable int teamId) {
        return matchService.getMatchesByTeamId(teamId);
    }

    @GetMapping("/tournament/{tournamentId}")
    public List<Match> getMatchesByTournamentId(@PathVariable int tournamentId) {
        return matchService.getMatchesByTournamentId(tournamentId);
    }

    @PatchMapping("/{id}")
    public Match patchMatch(@PathVariable int id, @RequestBody MatchUpdateDTO matchUpdateDTO) {
        return matchService.updateMatch(id, matchUpdateDTO);
    }
}