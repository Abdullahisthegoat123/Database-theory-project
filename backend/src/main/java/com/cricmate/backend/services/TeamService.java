package com.cricmate.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cricmate.backend.repository.PlayerRepository;
import com.cricmate.backend.repository.TeamRepository;
import com.cricmate.backend.model.Team;
import com.cricmate.backend.dto.TeamDto;
import com.cricmate.backend.model.Player;

@Service
public class TeamService {
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    public TeamService(TeamRepository teamRepository, PlayerRepository playerRepository){
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
    }
    
    public Team getTeamById(Integer id){
        return teamRepository.findById(id).orElseThrow(()->new RuntimeException("Team not found"));
    }
    public List<Team> getAllTeams(){
        return teamRepository.findAll();
    }
    public Team saveTeam(Team team) {
        return teamRepository.save(team);
    }

    public void deleteTeamById(Integer id) {
        teamRepository.deleteById(id);
    }
    
    //When you create a team, the players field doesn’t update the join table — because it’s mappedBy the player side (it’s read-only in terms of relationship control).
    // So addPlayerToTeam(int playerId, int teamId) exists to manually update that relationship after both are created.
    public void addPlayerToTeam(int PlayerId, int TeamId){
        Player player = playerRepository.findById(PlayerId).orElseThrow(() -> new RuntimeException("Player not found"));
        Team team = teamRepository.findById(TeamId).orElseThrow(() -> new RuntimeException("Team not found"));
        
        
        // doesnt get from join table, it’s an in-memory collection managed by Hibernate.
        player.getTeams().add(team); // gets from join table? yes and updates join table too, cuz player is the owning side
        // marks a new relationship
        team.getPlayers().add(player);
        playerRepository.save(player); // is this update??
        // Because Team is the inverse side (mappedBy="teams") — changes there don’t affect the join table
        
        // so java is always tracking these sets and lists
        // players and teams are loaded into memory by hibernate from db, on startup or on function call?
        // on function request like Player player = playerRepository.findById(PlayerId);

        // both of them are tracked by hibernate too, like what fields were modified
        // so when we do player.getTeams().add(team); in memory it is updated, not into db yet
        // finally when we save via repository the change is made in db

        // Type mismatch: cannot convert from Optional<Player> to PlayerJava(16777233) on 
        // Player player = playerRepository.findById(PlayerId);
        // we're using jpa for crud built-in functions, and there findbyid returns
        // Optional<Team> findById(ID id);
        // may or may not contain a tea, i.e. team not found
        // so deal with
        // .orElseThrow(()=> new RuntimeException("Team not found"))
        // optional forces us to handle missing case by throwing an error, which otherwise would be a null pointer exception
        // you’ll get a NullPointerException, which gives you no clue what went wrong
        // This makes debugging painful and code less reliable.

        // null pointer exception in team.getPlayers().add(player); 
        // cuz when we created a Team object, players set wasnt initialized, constructor only sets the name on creation of team
    
    }
    public TeamDto getTeamFull(Integer teamId){
        Team team = teamRepository.findById(teamId)
                  .orElseThrow(() -> new RuntimeException("Team not found"));
        return new TeamDto(team); // map entity → DTO
    }
}
