package com.cricmate.backend.services;

import org.springframework.stereotype.Service;

import com.cricmate.backend.repository.PlayerRepository;
import com.cricmate.backend.dto.FullPlayerDTO;
import com.cricmate.backend.model.Player;
import java.util.List;

@Service
public class PlayerService{
    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository){
        this.playerRepository = playerRepository;
    } 
    public Player getPlayerById(Integer id){
        return playerRepository.findById(id).orElseThrow(() -> new RuntimeException("Player Not found"));
    }
    
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }

    public void deletePlayerById(Integer id) {
        playerRepository.deleteById(id);
    }
    public FullPlayerDTO getFullPlayerById(Integer id) {
        Player player = playerRepository.findById(id)
                          .orElseThrow(() -> new RuntimeException("Player not found"));
        return new FullPlayerDTO(player); // map entity → DTO
    }
}
