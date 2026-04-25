package com.cricmate.backend.controller;

import com.cricmate.backend.dto.CareerBowlingStatsDTO;
import com.cricmate.backend.dto.TopWicketTakersDTO;
import com.cricmate.backend.services.PlayerBowlingStatsService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/bowling")
@CrossOrigin
public class PlayerBowlingStatsController {

    private final PlayerBowlingStatsService statsService;

    public PlayerBowlingStatsController(PlayerBowlingStatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/career/{playerId}")
    public List<CareerBowlingStatsDTO> getCareerStats(@PathVariable int playerId) {
        return statsService.getCareerBowlingStats(playerId);
    }
    @GetMapping("/topwickettakers/{teamId}")
    public List<TopWicketTakersDTO> getTopScorers(@PathVariable int teamId) {
        return statsService.getTopWicketTakersService(teamId);
    }
}
