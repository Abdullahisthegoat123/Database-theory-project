package com.cricmate.backend.services;

import com.cricmate.backend.dto.TopWicketTakersDTO;

import com.cricmate.backend.dto.CareerBowlingStatsDTO;
import com.cricmate.backend.dto.TopScorersDTO;
import com.cricmate.backend.repository.BallRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlayerBowlingStatsService {

    private final BallRepository ballRepository;

    public PlayerBowlingStatsService(BallRepository ballRepository) {
        this.ballRepository = ballRepository;
    }

    public List<CareerBowlingStatsDTO> getCareerBowlingStats(int playerId) {
        return ballRepository.getBowlerCareerStats(playerId);
    }
    public List<TopWicketTakersDTO> getTopWicketTakersService(int teamId) {
        return ballRepository.getTopWicketTakersByTeam(teamId);
    } 
}
