# CricMate - Cricket Match Management System

**Group Member:** Muhammad Mustafa

---

## Introduction

CricMate is a comprehensive full-stack cricket match management application designed to streamline the organization and tracking of cricket matches. It provides a robust platform for managing teams, players, tournaments, and matches, while offering real-time ball-by-ball commentary and detailed statistics. The system caters to both administrators, who need powerful tools for data management, and cricket enthusiasts, who desire live updates and in-depth match analysis. Built with modern web technologies, CricMate ensures a seamless and engaging user experience across all devices.

## Targeted Audience

The primary target audience for CricMate includes:

*   **Cricket Tournament Organizers:** Individuals or organizations responsible for managing cricket leagues and tournaments who need a centralized system for scheduling and scorekeeping.
*   **Cricket Clubs and Academies:** Local clubs and coaching centers looking to maintain digital records of their players' performance and match history.
*   **Cricket Enthusiasts and Fans:** Users who want to follow live match scores, view detailed scorecards, and analyze player statistics.
*   **Amateur Cricket Leagues:** Community leagues requiring a professional-grade solution for managing their season's data without the cost of enterprise software.

## Project Scope

The scope of the CricMate project encompasses the following key areas:

*   **Match Management:** Complete lifecycle management of cricket matches, from scheduling to completion, including toss details, match status (Upcoming, Ongoing, Completed), and result recording.
*   **Real-time Scoring:** A ball-by-ball commentary system that updates match scores instantly, tracking runs, wickets, extras, and over details.
*   **Entity Management:** comprehensive CRUD (Create, Read, Update, Delete) operations for Teams, Players, and Tournaments.
*   **Statistics and Analytics:** Detailed tracking of player performance (batting and bowling styles) and match statistics.
*   **User Roles:** A secure authentication system distinguishing between public users (view-only access) and administrators (full management access).
*   **Responsive Interface:** A mobile-first user interface ensuring accessibility on smartphones, tablets, and desktops.

## Functional and Non-Functional Requirements

### Functional Requirements

1.  **Authentication & Authorization:**
    *   Secure login for administrators using Supabase Auth.
    *   Role-based access control to protect administrative routes (e.g., creating matches, editing scores).
2.  **Match Operations:**
    *   Ability to create new matches with specific teams, venues, and dates.
    *   Functionality to record ball-by-ball data including runs, wickets, and extras.
    *   Automatic calculation of team totals, run rates, and individual player scores.
3.  **Data Management:**
    *   Registration of new teams and players with detailed profiles.
    *   Creation and management of tournaments to group related matches.
4.  **User Interface:**
    *   Live scorecard display with auto-refreshing data.
    *   Search and filter capabilities for finding specific players, teams, or matches.

### Non-Functional Requirements

1.  **Performance:** The application must provide real-time updates with minimal latency, ensuring the commentary reflects the live action instantly.
2.  **Scalability:** The database schema and backend architecture should support a growing number of matches and historical data without performance degradation.
3.  **Security:** All sensitive administrative actions must be protected behind secure authentication layers. API endpoints should validate user permissions.
4.  **Usability:** The UI should be intuitive and responsive, providing a premium user experience with a modern aesthetic (dark mode, consistent color themes).
5.  **Reliability:** The system should handle data consistency accurately, ensuring that match states and scores are always synchronized across the platform.

## Normalized Schema

The database schema is designed to be normalized to ensure data integrity and minimize redundancy.

### Tables and Relationships

1.  **Teams**
    *   `team_id` (Primary Key)
    *   `team_name`

2.  **Players**
    *   `player_id` (Primary Key)
    *   `player_name`
    *   `full_name`
    *   `date_of_birth`
    *   `batting_style`
    *   `bowling_style`
    *   `playing_role`

3.  **Tournaments**
    *   `tournament_id` (Primary Key)
    *   `tournament_name`
    *   `start_date`
    *   `end_date`

4.  **Matches**
    *   `match_id` (Primary Key)
    *   `team_a_id` (Foreign Key -> Teams)
    *   `team_b_id` (Foreign Key -> Teams)
    *   `tournament_id` (Foreign Key -> Tournaments)
    *   `match_date`
    *   `venue`
    *   `match_state` (Enum: UPCOMING, ONGOING, COMPLETED, etc.)
    *   `match_format`
    *   `toss_winner_team_id` (Foreign Key -> Teams)
    *   `match_winner_team_id` (Foreign Key -> Teams)
    *   `toss_decision`

5.  **Innings**
    *   `innings_id` (Primary Key)
    *   `match_id` (Foreign Key -> Matches)
    *   `batting_team_id` (Foreign Key -> Teams)
    *   `bowling_team_id` (Foreign Key -> Teams)

6.  **Balls**
    *   `ball_id` (Primary Key)
    *   `innings_id` (Foreign Key -> Innings)
    *   `batsman_id` (Foreign Key -> Players)
    *   `bowler_id` (Foreign Key -> Players)
    *   `over_number`
    *   `ball_number`
    *   `runs`
    *   `is_wicket` (Boolean)

7.  **Profiles** (Supabase Auth Integration)
    *   `id` (Primary Key, Foreign Key -> auth.users)
    *   `is_admin` (Boolean)

### Normalization Analysis
*   **1NF:** All columns contain atomic values.
*   **2NF:** All non-key attributes are fully functional dependent on the primary key.
*   **3NF:** There are no transitive dependencies (e.g., player details are in the Players table, not repeated in Balls or Matches).

## Conclusion

CricMate successfully delivers a modern, robust solution for cricket match management. By leveraging a powerful tech stack comprising Next.js, Spring Boot, and PostgreSQL, it ensures high performance and scalability. The application meets the needs of diverse users, from casual fans to serious organizers, through its intuitive interface and comprehensive feature set. The normalized database design ensures data integrity, while the secure authentication system protects critical data. CricMate stands as a testament to effective full-stack development, combining a dynamic frontend with a solid backend architecture.

## References

1.  **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
2.  **Spring Boot Documentation:** [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)
3.  **PostgreSQL Documentation:** [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
4.  **Supabase Documentation:** [https://supabase.com/docs](https://supabase.com/docs)
5.  **Tailwind CSS Documentation:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
