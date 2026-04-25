package com.cricmate.backend.services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.cricmate.backend.model.Tournament;
import com.cricmate.backend.repository.TournamentRepository;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;

    public TournamentService(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    public Tournament saveTournament(Tournament tournament) {
        return tournamentRepository.save(tournament);
    }

    public Tournament getTournamentById(Integer id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
    }

    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }
}
