package com.cricmate.backend.controller;

import com.cricmate.backend.model.Tournament;
import com.cricmate.backend.services.TournamentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/tournaments")
@CrossOrigin(origins = "*")
public class TournamentController {

    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @PostMapping
    public ResponseEntity<Tournament> createTournament(@RequestBody Tournament tournament) {
        Tournament savedTournament = tournamentService.saveTournament(tournament);
        return ResponseEntity.ok(savedTournament);
    }

    @GetMapping
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        List<Tournament> tournaments = tournamentService.getAllTournaments();
        return ResponseEntity.ok(tournaments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Integer id) {
        Tournament tournament = tournamentService.getTournamentById(id);
        return ResponseEntity.ok(tournament);
    }
}
