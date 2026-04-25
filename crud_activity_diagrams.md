# CRUD Operations - Activity Diagrams

This document contains activity diagrams for all CRUD operations in the CricMate application, showing the flow of control from user interaction to database persistence.

---

## CREATE Operation - Activity Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Next.js Frontend<br/>/addplayer/page.tsx
    participant Auth as Supabase Auth
    participant API as Spring Boot API<br/>PlayerController
    participant Service as PlayerService
    participant Repo as PlayerRepository<br/>(JPA)
    participant DB as PostgreSQL

    User->>Frontend: Navigate to /addplayer
    Frontend->>Auth: Check session & admin status
    Auth-->>Frontend: Session + is_admin flag
    
    alt Not Admin
        Frontend->>User: Redirect to home with error toast
    else Is Admin
        Frontend->>User: Display form
        User->>Frontend: Fill form & submit
        Frontend->>API: POST /players<br/>{player_name, full_name, ...}
        API->>Service: savePlayer(player)
        Service->>Repo: save(player)
        Repo->>DB: INSERT INTO players
        DB-->>Repo: New player record
        Repo-->>Service: Player entity
        Service-->>API: Player entity
        API-->>Frontend: 200 OK + Player JSON
        Frontend->>User: Success toast + form reset
    end
```

---

## READ Operation - Activity Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Next.js Frontend<br/>/players/page.tsx
    participant API as PlayerController
    participant Service as PlayerService
    participant Repo as PlayerRepository
    participant DB as PostgreSQL

    User->>Frontend: Navigate to /players
    Frontend->>API: GET /players
    API->>Service: getAllPlayers()
    Service->>Repo: findAll()
    Repo->>DB: SELECT * FROM players
    DB-->>Repo: List of player records
    Repo-->>Service: List<Player>
    Service-->>API: List<Player>
    API-->>Frontend: 200 OK + JSON array
    Frontend->>User: Display player cards
```

---

## UPDATE Operation - Activity Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Edit Form
    participant Auth as Supabase Auth
    participant API as PlayerController
    participant Service as PlayerService
    participant Repo as PlayerRepository
    participant DB as PostgreSQL

    User->>Frontend: Navigate to edit page
    Frontend->>Auth: Check admin status
    Auth-->>Frontend: is_admin = true
    Frontend->>API: GET /players/{id}
    API-->>Frontend: Current player data
    Frontend->>User: Display pre-filled form
    User->>Frontend: Modify fields & submit
    Frontend->>API: PATCH /players/{id}<br/>{updated fields}
    API->>Service: updatePlayer(id, updates)
    Service->>Repo: findById(id)
    Repo-->>Service: Existing player
    Service->>Service: Apply updates
    Service->>Repo: save(updatedPlayer)
    Repo->>DB: UPDATE players SET ...
    DB-->>Repo: Updated record
    Repo-->>Service: Player entity
    Service-->>API: Player entity
    API-->>Frontend: 200 OK + Player JSON
    Frontend->>User: Success toast
```

---

## DELETE Operation - Activity Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Player Detail Page
    participant Auth as Supabase Auth
    participant API as PlayerController
    participant Service as PlayerService
    participant Repo as PlayerRepository
    participant DB as PostgreSQL

    User->>Frontend: Click delete button
    Frontend->>Auth: Check admin status
    Auth-->>Frontend: is_admin = true
    Frontend->>User: Show confirmation dialog
    User->>Frontend: Confirm deletion
    Frontend->>API: DELETE /players/{id}
    API->>Service: deletePlayerById(id)
    Service->>Repo: deleteById(id)
    Repo->>DB: DELETE FROM players WHERE player_id = ?
    DB-->>Repo: Deletion confirmed
    Repo-->>Service: void
    Service-->>API: void
    API-->>Frontend: 204 No Content
    Frontend->>User: Success toast + redirect
```

---

## Notes

- **Authentication**: All write operations (CREATE, UPDATE, DELETE) require admin authentication
- **Validation**: Client-side validation occurs before API calls
- **Error Handling**: Each operation includes error handling paths
- **User Feedback**: Toast notifications provide feedback for all operations
- **Database Constraints**: DELETE operation handles foreign key constraint violations

---

**Document Version**: 1.0  
**Last Updated**: December 3, 2025  
**Author**: CricMate Development Team
