package com.cricmate.backend.controller;

import com.cricmate.backend.dto.CareerBattingStatsDTO;
import com.cricmate.backend.dto.TopScorersDTO;
import com.cricmate.backend.services.PlayerBattingStatsService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/batting")
@CrossOrigin
public class PlayerBattingStatsController {

    private final PlayerBattingStatsService statsService;

    public PlayerBattingStatsController(PlayerBattingStatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/career/{playerId}")
    public List<CareerBattingStatsDTO> getCareerStats(@PathVariable int playerId) {
        return statsService.getBattingStatsService(playerId);
    }
    
    @GetMapping("/topscorers/{teamId}")
    public List<TopScorersDTO> getTopScorers(@PathVariable int teamId) {
        return statsService.getTopScorersService(teamId);
    }

}
