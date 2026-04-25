package com.cricmate.backend.services;

import org.springframework.stereotype.Service;

import com.cricmate.backend.dto.BallUpdateDTO;
import com.cricmate.backend.model.Ball;
import com.cricmate.backend.model.Innings;
import com.cricmate.backend.model.Player;
import com.cricmate.backend.repository.BallRepository;
import com.cricmate.backend.repository.InningsRepository;
import com.cricmate.backend.repository.PlayerRepository;

import java.util.List;


@Service
public class BallService {
    private final BallRepository ballRepository;
    private final PlayerRepository playerRepository;
    private final InningsRepository inningsRepository;

    public BallService(BallRepository ballRepository,
            PlayerRepository playerRepository,
            InningsRepository inningsRepository) {
        this.ballRepository = ballRepository;
        this.playerRepository = playerRepository;
        this.inningsRepository = inningsRepository;
    }

    
    
    public Ball saveBall(Ball ball) {
        return ballRepository.save(ball);
    }

    public List<Ball> getAllBalls() {
        return ballRepository.findAll();
    }
    
    public Ball updateBall(int id, BallUpdateDTO dto) {
    Ball existingBall = ballRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ball not found"));

    if (dto.getOverNumber() != null)
        existingBall.setOverNumber(dto.getOverNumber());

    if (dto.getBallNumber() != null)
        existingBall.setBallNumber(dto.getBallNumber());

    if (dto.getRuns() != null)
        existingBall.setRuns(dto.getRuns());

    if (dto.getIsWicket() != null)
        existingBall.setWicket(dto.getIsWicket());

    // player updates
    if (dto.getBatsmanId() != null) {
        Player batsman = playerRepository.findById(dto.getBatsmanId())
                .orElseThrow(() -> new RuntimeException("Batsman not found"));
        existingBall.setBatsman(batsman);
    }

    if (dto.getBowlerId() != null) {
        Player bowler = playerRepository.findById(dto.getBowlerId())
                .orElseThrow(() -> new RuntimeException("Bowler not found"));
        existingBall.setBowler(bowler);
    }

    if (dto.getInningsId() != null) {
        Innings innings = inningsRepository.findById(dto.getInningsId())
                .orElseThrow(() -> new RuntimeException("Innings not found"));
        existingBall.setInnings(innings);
    }

    return ballRepository.save(existingBall);
}


}
