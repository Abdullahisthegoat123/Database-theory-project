package com.cricmate.backend.controller;

import com.cricmate.backend.dto.FullPlayerDTO;
import com.cricmate.backend.model.Player;
// import com.cricmate.backend.repository.PlayerRepository;
import com.cricmate.backend.services.PlayerService;

// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // http requests this class handles and json it returns, rest requests and
                // returns json
@RequestMapping("/players") // everything inside this class will be accessed like
                            // localhost8080/players/something
public class PlayerController {
    // requestmapping also maps get requests to get method here, set to set requests
    // method here
    // @Autowired // autoinjects player repo
    // private PlayerRepository playerRepository; // Player repository actually
    // talks to H2, postgres

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping("/{id}")
    public Player getPlayer(@PathVariable int id) {
        return playerService.getPlayerById(id);
    }
    @GetMapping("/full/{id}")
    public FullPlayerDTO getFullPlayer(@PathVariable int id) {
        return playerService.getFullPlayerById(id); // maps entity → DTO with teams
    }

    @GetMapping
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @PostMapping
    public Player addPlayer(@RequestBody Player player) {
        return playerService.savePlayer(player);
    }

    @DeleteMapping("/{id}")
    public void deletePlayer(@PathVariable int id) {
        playerService.deletePlayerById(id);
    }

    
}
