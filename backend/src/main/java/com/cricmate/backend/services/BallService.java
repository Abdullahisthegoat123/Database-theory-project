package com.cricmate.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cricmate.backend.model.Ball;
import com.cricmate.backend.model.Innings;
import com.cricmate.backend.model.Match;
import com.cricmate.backend.repository.BallRepository;
import com.cricmate.backend.repository.InningsRepository;
import com.cricmate.backend.repository.MatchRepository;
import com.cricmate.backend.repository.PlayerRepository;
import com.cricmate.backend.dto.BallUpdateDTO;
import com.cricmate.backend.model.Player;

import java.util.List;

@Service
public class BallService {
    private final BallRepository ballRepository;
    private final PlayerRepository playerRepository;
    private final InningsRepository inningsRepository;
    private final MatchRepository matchRepository;

    public BallService(BallRepository ballRepository,
                       PlayerRepository playerRepository,
                       InningsRepository inningsRepository,
                       MatchRepository matchRepository) {
        this.ballRepository = ballRepository;
        this.playerRepository = playerRepository;
        this.inningsRepository = inningsRepository;
        this.matchRepository = matchRepository;
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

    @Transactional
    public Ball recordBallWithMatchUpdate(int matchId, int inningsId, Ball ball) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        Innings innings = inningsRepository.findById(inningsId)
                .orElseThrow(() -> new RuntimeException("Innings not found"));

        ball.setInnings(innings);

        Ball savedBall = ballRepository.save(ball);

        match.setMatchState("ONGOING");
        matchRepository.save(match);

        return savedBall;
    }
}
