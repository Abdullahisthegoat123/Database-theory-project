package com.cricmate.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cricmate.backend.dto.BattingStatsSimple;
import com.cricmate.backend.dto.BowlingStatsDTO;
import com.cricmate.backend.dto.CareerBowlingStatsDTO;
import com.cricmate.backend.dto.TopScorersDTO;
import com.cricmate.backend.dto.TopWicketTakersDTO;

import com.cricmate.backend.dto.CareerBattingStatsDTO;

import com.cricmate.backend.model.Ball;
import java.util.List;

public interface BallRepository extends JpaRepository<Ball, Integer> {

    // custom query written in JPQL (not plain SQL).
    // "SELECT new com.cricmate.backend.dto.BattingStatsDTO(" creates an object of our DTO directly inside the query
    // instead of returning it will fill the BattingStatsDTO object with the data
    // @Query("SELECT new com.cricmate.backend.dto.BattingStatsDTO(" +
    //        "b.batsman.player_name, SUM(b.runs), COUNT(b.ball_id), " +
    //        "SUM(CASE WHEN b.runs = 4 THEN 1 ELSE 0 END), " +
    //        "SUM(CASE WHEN b.runs = 6 THEN 1 ELSE 0 END), " +
    //        "CASE WHEN MAX(b.wicket) = true THEN true ELSE false END)" +
    //        "FROM Ball b WHERE b.innings.innings_id = :inningsId " + // :inningsId is a parameter — you’ll pass it when calling
    //                                                          // the method.
    //        "GROUP BY b.batsman.player_id")                       
    //        // different for different batsmen, or like one row per batsman
    // List<BattingStatsDTO> getBattingStats(@Param("inningsId") int inningsId);
    
    @Query("SELECT new com.cricmate.backend.dto.BattingStatsSimple( " +
            "b.batsman.player_id, " +
            "b.batsman.player_name, " +
            "SUM(b.runs), " + // total runs
            "COUNT(b.ball_id), " + // total balls faced
            "SUM(CASE WHEN b.runs = 4 THEN 1 ELSE 0 END), " + // number of fours
            "SUM(CASE WHEN b.runs = 6 THEN 1 ELSE 0 END), " +
            "(SUM(b.runs)*100.0)/COUNT(b.ball_id)) " + // strike rate
            "FROM Ball b " +
            "WHERE b.innings.innings_id = :inningsId " +
            "GROUP BY b.batsman.player_id, b.batsman.player_name")
    List<BattingStatsSimple> getBatsmanStats(@Param("inningsId") int inningsId);
    // @Query("SELECT DISTINCT b.batsman.player_name" +
    //  " From Ball b " +
    //  "WHERE b.innings.innings_id = :inningsId" 
    // )
    // List<String> getBatsmanNames(@Param("inningsId") int inningsId);

    @Query("SELECT new com.cricmate.backend.dto.BowlingStatsDTO( " +
            "b.bowler.player_id, " +
            "b.bowler.player_name, " +
            "SUM(b.runs), " + // total runs conceded
            "COUNT(b.ball_id), " + // total balls bowled
            "COUNT(CASE WHEN b.isWicket = true THEN 1 END), " + // wickets taken
            "SUM(CASE WHEN b.runs = 4 THEN 1 ELSE 0 END), " + // number of fours conceded
            "SUM(CASE WHEN b.runs = 6 THEN 1 ELSE 0 END), " +
            "(SUM(b.runs)/(COUNT(b.ball_id)/6.0)) " + // economy
            ") " +
            "FROM Ball b " +
            "WHERE b.innings.innings_id = :inningsId " +
            "GROUP BY b.bowler.player_id, b.bowler.player_name")
    List<BowlingStatsDTO> getBowlerStats(@Param("inningsId") int inningsId);
 
    @Query("SELECT new com.cricmate.backend.dto.CareerBowlingStatsDTO( " +
                    "b.bowler.player_id, " +
                    "b.bowler.player_name, " +
                    "b.innings.match.matchFormat, " + // <-- include format
                    "SUM(b.runs), " +
                    "COUNT(b.ball_id), " +
                    "COUNT(CASE WHEN b.isWicket = true THEN 1 END), " +
                    "SUM(CASE WHEN b.runs = 4 THEN 1 ELSE 0 END), " +
                    "SUM(CASE WHEN b.runs = 6 THEN 1 ELSE 0 END), " +
                    "(SUM(b.runs)/(COUNT(b.ball_id)/6.0)) " +
                    ") " +
                    "FROM Ball b " +
                    "WHERE b.bowler.player_id = :playerId " +
                    "GROUP BY b.bowler.player_id, b.bowler.player_name, b.innings.match.matchFormat")
    List<CareerBowlingStatsDTO> getBowlerCareerStats(@Param("playerId") int playerId);
        
    @Query("""
                        SELECT new com.cricmate.backend.dto.CareerBattingStatsDTO(
                            b.batsman.player_id,
                            b.batsman.player_name,
                            b.innings.match.matchFormat,

                            CAST(COUNT(b.innings) - COUNT(CASE WHEN b.isWicket = true THEN 1 END) AS long),

                            CAST(SUM(b.runs) AS long),
                            CAST(COUNT(b.ball_id) AS long),

                            CAST(SUM(b.runs) / NULLIF(COUNT(CASE WHEN b.isWicket = true THEN 1 END), 0) AS double),

                            CAST(((SUM(b.runs) * 1.0) / COUNT(b.ball_id)) * 100.0 AS double),

                            CAST(SUM(CASE WHEN b.runs = 4 THEN 1 ELSE 0 END) AS long),
                            CAST(SUM(CASE WHEN b.runs = 6 THEN 1 ELSE 0 END) AS long),

                            CAST(SUM(CASE WHEN (SELECT SUM(b2.runs) FROM Ball b2 WHERE b2.innings = b.innings) >= 100 THEN 1 ELSE 0 END) AS long),

                            CAST(SUM(CASE WHEN (SELECT SUM(b2.runs) FROM Ball b2 WHERE b2.innings = b.innings) BETWEEN 50 AND 99 THEN 1 ELSE 0 END) AS long)
                        )
                        FROM Ball b
                        WHERE b.batsman.player_id = :playerId
                        GROUP BY b.batsman.player_id, b.batsman.player_name, b.innings.match.matchFormat
                    """)
    List<CareerBattingStatsDTO> getBatterCareerStats(@Param("playerId") int playerId);

    @Query("SELECT new com.cricmate.backend.dto.TopScorersDTO( " +
                    "b.batsman.player_id, " +
                    "b.batsman.player_name, " +
                    "SUM(b.runs) " + // total runs scored
                    ") " +
                    "FROM Ball b " +
                    "WHERE b.innings.innings_id IN (" +
                    "    SELECT i.innings_id " +
                    "    FROM Innings i " +
                    "    WHERE i.battingTeam.team_id = :teamId" +
                    ") " +
                    "GROUP BY b.batsman.player_id, b.batsman.player_name " +
                    "ORDER BY SUM(b.runs)")
    List<TopScorersDTO> getTopRunScorersByTeam(@Param("teamId") int teamId);

    @Query("SELECT new com.cricmate.backend.dto.TopWicketTakersDTO( " +
                    "b.bowler.player_id, " +
                    "b.bowler.player_name, " +
                    "COUNT(CASE WHEN b.isWicket = true THEN 1 END) " + // total runs scored
                    ") " +
                    "FROM Ball b " +
                    "WHERE b.innings.innings_id IN (" +
                    "    SELECT i.innings_id " +
                    "    FROM Innings i " +
                    "    WHERE i.battingTeam.team_id = :teamId" +
                    ") " +
                    "GROUP BY b.bowler.player_id, b.bowler.player_name " +
                    "ORDER BY COUNT(CASE WHEN b.isWicket = true THEN 1 END) DESC")
    List<TopWicketTakersDTO> getTopWicketTakersByTeam(@Param("teamId") int teamId);

}

// package com.cricmate.backend.dto;

// import lombok.Data;
// import lombok.NoArgsConstructor;

// @Data
// @NoArgsConstructor
// public class CareerBattingStatsDTO {

//     private Integer playerId;
//     private String playerName;
//     private String matchFormat;

//     private Long notOuts;
//     private Long totalRuns;
//     private Long totalBalls;

//     private Double average;
//     private Double strikeRate;

//     private Long fours;
//     private Long sixes;
//     private Long hundreds;
//     private Long fifties;

//     // IMPORTANT: Hibernate needs THIS exact constructor
//     public CareerBattingStatsDTO(
//             Integer playerId,
//             String playerName,
//             String matchFormat,
//             Long notOuts,
//             Long totalRuns,
//             Long totalBalls,
//             Double average,
//             Double strikeRate,
//             Long fours,
//             Long sixes,
//             Long hundreds,
//             Long fifties) {
//         this.playerId = playerId;
//         this.playerName = playerName;
//         this.matchFormat = matchFormat;
//         this.notOuts = notOuts;
//         this.totalRuns = totalRuns;
//         this.totalBalls = totalBalls;
//         this.average = average;
//         this.strikeRate = strikeRate;
//         this.fours = fours;
//         this.sixes = sixes;
//         this.hundreds = hundreds;
//         this.fifties = fifties;
//     }
// }


// Caused by:org.hibernate.query.SemanticException:
// Missing constructor for type'CareerBattingStatsDTO' [SELECT new com.cricmate.backend.dto.CareerBattingStatsDTO(b.batsman.player_id,b.batsman.player_name,b.innings.match.matchFormat,

// COUNT(b.innings) -

// COUNT(CASE WHEN b.isWicket = true THEN 1 END),
//     SUM(b.runs),
//     COUNT(b.ball_id),
//     SUM(b.runs) / NULLIF(COUNT(CASE WHEN b.isWicket = true THEN 1 END), 0),
//     (SUM(b.runs) * 1.0 / COUNT(b.ball_id)) * 100.0,
//     SUM(CASE WHEN b.runs = 4 THEN 1 ELSE 0 END),
//     SUM(CASE WHEN b.runs = 6 THEN 1 ELSE 0 END),
//     SUM(CASE WHEN (SELECT SUM(b2.runs) FROM Ball b2 WHERE b2.innings = b.innings) >= 100 THEN 1 ELSE 0 END),     
//     SUM(CASE WHEN (SELECT SUM(b2.runs) FROM Ball b2 WHERE b2.innings = b.innings) BETWEEN 50 AND 99 THEN 1 ELSE 0 END)
// )
// FROM Ball b
// WHERE b.batsman.player_id = :playerId
// GROUP BY b.batsman.player_id, b.batsman.player_name, b.innings.match.matchFormat
// ]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitInstantiation(SemanticQueryBuilder.java:1506) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitInstantiation(SemanticQueryBuilder.java:275) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.grammars.hql.HqlParser$InstantiationContext.accept(HqlParser.java:4029) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitSelectableNode(SemanticQueryBuilder.java:1453) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitSelection(SemanticQueryBuilder.java:1407) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitSelectClause(SemanticQueryBuilder.java:1400) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitQuery(SemanticQueryBuilder.java:1249) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitQuerySpecExpression(SemanticQueryBuilder.java:1035) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitQuerySpecExpression(SemanticQueryBuilder.java:275) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.grammars.hql.HqlParser$QuerySpecExpressionContext.accept(HqlParser.java:2132) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitSimpleQueryGroup(SemanticQueryBuilder.java:1020) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitSimpleQueryGroup(SemanticQueryBuilder.java:275) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.grammars.hql.HqlParser$SimpleQueryGroupContext.accept(HqlParser.java:2003) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitSelectStatement(SemanticQueryBuilder.java:490) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.visitStatement(SemanticQueryBuilder.java:449) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.SemanticQueryBuilder.buildSemanticModel(SemanticQueryBuilder.java:322) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.hql.internal.StandardHqlTranslator.translate(StandardHqlTranslator.java:71) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.internal.QueryInterpretationCacheStandardImpl.createHqlInterpretation(QueryInterpretationCacheStandardImpl.java:145) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.query.internal.QueryInterpretationCacheStandardImpl.resolveHqlInterpretation(QueryInterpretationCacheStandardImpl.java:132) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.internal.AbstractSharedSessionContract.interpretHql(AbstractSharedSessionContract.java:802) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         at org.hibernate.internal.AbstractSharedSessionContract.createQuery(AbstractSharedSessionContract.java:852) ~[hibernate-core-6.5.3.Final.jar:6.5.3.Final]
//         ... 72 common frames omitted


// public class CareerBattingStatsDTO {

//         private int playerId;
//         private String playerName;
//         private String matchFormat;
//         private long notOuts; // wickets - total innings
//         private long totalRuns;
//         private long totalBalls;
//         private double average;
//         private double strikeRate;
//         private long fours;
//         private long sixes;
//         private long hundreds;
//         private long fifties;

// }