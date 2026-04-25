package com.cricmate.backend.services;

import com.cricmate.backend.dto.CareerBattingStatsDTO;
import com.cricmate.backend.dto.TopScorersDTO;
import com.cricmate.backend.repository.BallRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlayerBattingStatsService {

    private final BallRepository ballRepository;

    public PlayerBattingStatsService(BallRepository ballRepository) {
        this.ballRepository = ballRepository;
    }

    public List<CareerBattingStatsDTO> getBattingStatsService(int playerId) {
        return ballRepository.getBatterCareerStats(playerId);
    }
    
    public List<TopScorersDTO> getTopScorersService(int teamId) {
        return ballRepository.getTopRunScorersByTeam(teamId);
    } 
}
