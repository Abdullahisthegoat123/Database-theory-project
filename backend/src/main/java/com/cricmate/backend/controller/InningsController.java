package com.cricmate.backend.controller;

import com.cricmate.backend.model.Innings;
// import com.cricmate.backend.repository.PlayerRepository;
import com.cricmate.backend.services.InningsService;

// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/innings")
public class InningsController {
    private final InningsService inningsService;

    public InningsController(InningsService inningsService) {
        this.inningsService = inningsService;
    }

    @PostMapping
    public Innings createInnings(@RequestBody Innings innings) {
        return inningsService.saveInnings(innings);
    }

    @GetMapping
    public List<Innings> getAllInnings() {
        return inningsService.getAllInnings();
    }
}


// POST http://localhost:8080/innings
// {
//   "match": { "match_id": 1 },
//   "battingTeam": { "team_id": 1 }, // foreign key
//   "bowlingTeam": { "team_id": 2 },
//   "totalRuns": 0,
//   "wickets": 0
// }
// RESPONSE
// {
//     "innings_id": 1,
//     "match": {
//         "match_id": 1,
//         "teamA": null,
//         "teamB": null,
//         "venue": null,
//         "match_date": null,
//         "innings": null
//     },
//     "battingTeam": {
//         "team_id": 1,
//         "team_name": null
//     },
//     "bowlingTeam": {
//         "team_id": 2,
//         "team_name": null
//     },
//     "totalRuns": 0,
//     "wickets": 0,
//     "overs": 0.0,
//     "balls": null
// }

// GET RESPONSE
// [
//     {
//         "innings_id": 1,
//         "battingTeam": {
//             "team_id": 1,
//             "team_name": "Pakistan"
//         },
//         "bowlingTeam": {
//             "team_id": 2,
//             "team_name": "Karachi Kings"
//         },
//         "totalRuns": 0,
//         "wickets": 0,
//         "overs": 0.0,
//         "balls": []
//     }
// ]