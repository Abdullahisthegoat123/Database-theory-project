package com.cricmate.backend.controller;

import org.springframework.http.ResponseEntity;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// import com.cricmate.backend.repository.TeamRepository;
import com.cricmate.backend.services.TeamService;
import com.cricmate.backend.model.Team;
import com.cricmate.backend.dto.TeamDto;
import java.util.List;

@RestController
@RequestMapping("/teams")
public class TeamController {


    // after initial constructor we can't reassign teams
    // private final TeamRepository teamRepository;

    // @Autowired 
    // private TeamRepository teamRepository;
    private final TeamService teamService;
    public TeamController(TeamService teamService){
        this.teamService = teamService;
    }
    @GetMapping("/{id}")
    public Team getTeam(@PathVariable Integer id){
        return teamService.getTeamById(id);
    }
    @GetMapping("/full/{id}")
    public TeamDto getTeamFull(@PathVariable Integer id){
        return teamService.getTeamFull(id);
    }

    @GetMapping
    public List<Team> getAllTeams(){
        return teamService.getAllTeams();
        // dont return TeamRepository.findAll();  that is the classname, not the instance
    }

    //  cuz both add teams have same name and method, use Separate endpoints
    // ("/create") and ("/create-with-players")

    // SpringBoot automatically maps json, if we want to add players during creation we need a dto
    @PostMapping("/create")
    public Team addTeam(@RequestBody Team team){
        return teamService.saveTeam(team);
        
    }
    // dto will be defined with string name that we already have and playerids that are passed
    // @PostMapping("/create-with-players")
    // public Team addTeam(@RequestBody TeamDto dto) {
    //     String teamName = dto.getName();
    //     Team team = new Team(teamName); // create a team like before
    //     teamService.saveTeam(team);
    //     // list of ints List<Integer>
    //     dto.getPlayerIds().forEach(id -> teamService.addPlayerToTeam(id, team.getTeam_id()));
    //     return team;


    //     // The constructor Team(String) is undefinedJava(134217858)
    //     // on Team team = new Team(teamName); // create a team like before
    //     // cuz team had no constructors, how was it saving then?
    //     // didnt create team object rather generated a insert update only from java object team that was serialized from json we passed
    //     // a plain Team object in memory.
    //     // It didn’t call your constructor — it directly set the private fields team_name, etc. using reflection.
    //     // so now we'll define a constructor


    //     // better way, no need of constructor just save it, it returns an object, use it
    //     // Team savedTeam = teamService.saveTeam(new Team(dto.getName())) // we still need team object to pass here
    //     // cuz we modified the json, its not the same as model so we'll need to do some work
    
    //     // {
    //     //     "name": "RCB",
    //     //     "playerIds": [1, 2, 3, 4]
    //     // }

    //     // {
    //     //     "team_id": 8,
    //     //     "team_name": "RCB"
    //     // }
    //     // for team player names in response too u need to modify and create a dto - TODO: WE DO THAT LATER
    //     // return new TeamResponse(team.getTeam_id(), team.getTeam_name(), playerNames);

    // }


    // for adding players after creating team we can do via request body or via path variables
    @PostMapping("team/{team_id}/player/{player_id}")
    public ResponseEntity<String> addPlayerToTeam(@PathVariable int team_id, @PathVariable int player_id){
        teamService.addPlayerToTeam(player_id, team_id);
        return ResponseEntity.ok("Player added to team successfully");
    }
    
//  @PostMapping("/teams/add-player")
//  public ResponseEntity<String> addPlayerToTeam(@RequestBody Map<String, Integer> ids) {
//     int playerId = ids.get("playerId");
//     int teamId = ids.get("teamId");
//     teamService.addPlayerToTeam(playerId, teamId);
//     return ResponseEntity.ok("Player added to team successfully");
//  }

    // DELETE: delete by ID
    @DeleteMapping("/{id}")
    public void deletePlayer(@PathVariable int id) {
        teamService.deleteTeamById(id);
    }
}
