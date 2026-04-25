package com.cricmate.backend.services;
import com.cricmate.backend.repository.InningsRepository;
import com.cricmate.backend.model.Innings;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class InningsService {
    private final InningsRepository inningsRepo;

    public InningsService(InningsRepository inningsRepo) {
        this.inningsRepo = inningsRepo;
    }

    public Innings saveInnings(Innings innings) {
        return inningsRepo.save(innings);
    }

    public List<Innings> getAllInnings() {
        return inningsRepo.findAll();
    }
}