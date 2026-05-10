# 🏏 CricMate - Cricket Match Management System

A full-stack cricket match management application with real-time ball-by-ball commentary, comprehensive statistics, and admin controls.

![Tech Stack](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-green?logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?logo=supabase)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Authentication & Authorization](#-authentication--authorization)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 Core Features
- **Match Management**: Create and manage cricket matches with detailed information
- **Ball-by-Ball Commentary**: Real-time ball tracking with comprehensive statistics
- **Team Management**: Organize teams and player rosters
- **Tournament System**: Create and manage cricket tournaments
- **Innings Tracking**: Detailed innings-level data and analytics
- **Player Profiles**: Comprehensive player statistics and information

### 🔐 Admin Features
- **Secure Authentication**: Supabase-powered authentication with admin role management
- **Protected Routes**: Page-level and component-level access control
- **Admin Dashboard**: Dedicated admin controls for data management
- **Edit Capabilities**: Modify match data, balls, and statistics

### 🎨 UI/UX
- **Modern Design**: Sleek dark theme with gradient accents (orange-red-purple)
- **Responsive Layout**: Mobile-first design that works on all devices
- **Real-time Updates**: Live commentary and score updates
- **Toast Notifications**: User-friendly feedback for all actions

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Authentication**: Supabase Auth
- **Notifications**: React Hot Toast

### Backend
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 21
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA
- **Build Tool**: Maven
- **Dev Tools**: Spring DevTools, Lombok

### Database & Auth
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## 📁 Project Structure

```
cricmate/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/cricmate/
│   │   │   │   ├── controller/    # REST API controllers
│   │   │   │   ├── model/         # JPA entities
│   │   │   │   ├── repository/    # Data repositories
│   │   │   │   └── service/       # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── nextfront/                  # Next.js frontend
│   ├── src/
│   │   ├── app/                   # App router pages
│   │   │   ├── addmatch/          # Add match page
│   │   │   ├── addplayer/         # Add player page
│   │   │   ├── addteam/           # Add team page
│   │   │   ├── addtournament/     # Add tournament page
│   │   │   ├── addinnings/        # Add innings page
│   │   │   ├── add-ball-by-ball/  # Ball-by-ball entry
│   │   │   ├── admin/             # Admin authentication
│   │   │   ├── matches/           # Match pages
│   │   │   ├── players/           # Player pages
│   │   │   ├── teams/             # Team pages
│   │   │   └── tournaments/       # Tournament pages
│   │   ├── components/            # React components
│   │   │   ├── ui/                # Reusable UI components
│   │   │   ├── Commentary.tsx     # Ball-by-ball commentary
│   │   │   ├── Scorecard.tsx      # Match scorecard
│   │   │   ├── MatchDetails.tsx   # Match information
│   │   │   └── ...
│   │   ├── hooks/                 # Custom React hooks
│   │   │   └── useIsAdmin.ts      # Admin check hook
│   │   ├── lib/                   # Utilities
│   │   │   ├── supabaseClient.ts  # Supabase config
│   │   │   └── utils.ts           # Helper functions
│   │   └── types/                 # TypeScript types
│   ├── public/                    # Static assets
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ and npm
- **Java** 21+
- **Maven** 3.6+
- **PostgreSQL** database (or Supabase account)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MuhammadMustafa18/CricMateDbProject.git
   cd cricmate/backend
   ```

2. **Configure database**
   
   Create a `.env` file in the `backend` directory:
   ```properties
   SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/your-db-name
   SPRING_DATASOURCE_USERNAME=your-username
   SPRING_DATASOURCE_PASSWORD=your-password
   ```

3. **Run the backend**
   ```bash
   mvn spring-boot:run
   ```
   
   The API will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../nextfront
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

### Database Setup

Run the SQL schema to create the necessary tables:
- `teams`
- `players`
- `tournaments`
- `matches`
- `innings`
- `balls`
- `profiles` (for admin management)

## 🔐 Authentication & Authorization

### User Roles

- **Public Users**: Can view matches, teams, players, and statistics
- **Admin Users**: Full access to create, edit, and delete data

### Admin Setup

1. Create a user account via Supabase Auth
2. In the `profiles` table, set `is_admin = true` for admin users
3. Admin users can access:
   - All `/add*` routes (addmatch, addplayer, addteam, etc.)
   - Ball-by-ball entry forms
   - Edit buttons on commentary

### Protected Routes

All admin routes use session-based authentication:
- Session check via Supabase
- Admin role verification from `profiles` table
- Toast notifications for unauthorized access
- Automatic redirects to login or home page

### Component-Level Protection

Use the `useIsAdmin` hook for conditional rendering:

```tsx
import { useIsAdmin } from "@/hooks/useIsAdmin";

export default function MyComponent() {
  const { isAdmin, loading } = useIsAdmin();

  return (
    <div>
      {isAdmin && (
        <button>Admin Only Action</button>
      )}
    </div>
  );
}
```

## 📡 API Documentation

### Base URL
```
http://localhost:8080
```

### Endpoints

#### Teams
- `GET /teams` - Get all teams
- `GET /teams/{id}` - Get team by ID
- `GET /teams/full/{id}` - Get team with players
- `POST /teams/create` - Create new team

#### Players
- `GET /players` - Get all players
- `GET /players/{id}` - Get player by ID
- `POST /players` - Create new player

#### Matches
- `GET /matches` - Get all matches
- `GET /matches/{id}` - Get match by ID
- `GET /matches/full/{id}` - Get match with full details
- `POST /matches` - Create new match

#### Tournaments
- `GET /tournaments` - Get all tournaments
- `GET /tournaments/{id}` - Get tournament by ID
- `GET /tournaments/{id}/matches` - Get tournament matches
- `POST /tournaments` - Create new tournament

#### Innings
- `GET /innings` - Get all innings
- `GET /innings/{id}` - Get innings by ID
- `POST /innings` - Create new innings

#### Balls
- `GET /balls` - Get all balls
- `GET /balls/{id}` - Get ball by ID
- `POST /balls` - Create new ball
- `PATCH /balls/{id}` - Update ball

## 🗄️ Database Schema

### Core Tables

**teams**
- `team_id` (PK)
- `team_name`

**players**
- `player_id` (PK)
- `player_name`
- `full_name`
- `date_of_birth`
- `batting_style`
- `bowling_style`
- `playing_role`

**matches**
- `match_id` (PK)
- `team_a_id` (FK)
- `team_b_id` (FK)
- `tournament_id` (FK)
- `match_date`
- `match_state`
- `match_format`
- `venue`

**innings**
- `innings_id` (PK)
- `match_id` (FK)
- `batting_team_id` (FK)
- `bowling_team_id` (FK)

**balls**
- `ball_id` (PK)
- `innings_id` (FK)
- `over_number`
- `ball_number`
- `batsman_id` (FK)
- `bowler_id` (FK)
- `runs`
- `wicket`

**profiles** (Supabase)
- `id` (PK, FK to auth.users)
- `is_admin`

## 🎨 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 Author

**Abdullah Karim 24K-0932**
**Usman Hassan 24K-0567**
**Zaid 24K-0636**


## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Spring Boot for the robust backend framework
- Supabase for authentication and database services
- Radix UI for accessible component primitives
- Tailwind CSS for the utility-first CSS framework

---

**Built with ❤️ for cricket enthusiasts**




# Functional Dependencies and BCNF Normalization

## Introduction
Normalization is a database design technique used to reduce redundancy, improve data consistency, and eliminate anomalies during insert, update, and delete operations. The CricMate database schema has been normalized up to Boyce-Codd Normal Form (BCNF).

---

# Functional Dependencies

## Players
player_id → player_name, full_name, batting_style, bowling_style, team_id

## Teams
team_id → team_name, coach_name

## Tournaments
tournament_id → tournament_name, start_date, end_date

## Matches
match_id → team_a_id, team_b_id, tournament_id, match_date, venue, match_state, toss_winner_team_id, match_winner_team_id, toss_decision, match_format

## Innings
innings_id → match_id, batting_team_id, bowling_team_id

## Balls
ball_id → innings_id, batsman_id, bowler_id, over_number, ball_number, runs, is_wicket

---

# Normalization Process

## First Normal Form (1NF)

The database was converted into 1NF by ensuring:
- Atomic attributes
- No repeating groups
- Unique rows

---

## Second Normal Form (2NF)

The database was converted into 2NF by removing partial dependencies.

Example:
Match_Player(match_id, player_id, player_name, team_name, runs)

Partial dependency:
player_id → player_name, team_name

Decomposed into:
- Players(player_id, player_name, team_id)
- Match_Player_Stats(match_id, player_id, runs)

---

## Third Normal Form (3NF)

The database was converted into 3NF by removing transitive dependencies.

Example:
Teams(team_id, team_name, coach_id, coach_name)

Dependencies:
team_id → coach_id
coach_id → coach_name

Decomposed into:
- Teams(team_id, team_name, coach_id)
- Coaches(coach_id, coach_name)

---

# Boyce-Codd Normal Form (BCNF)

A relation is in BCNF if every determinant is a candidate key or super key.

The following relations satisfy BCNF:
- Players
- Teams
- Tournaments
- Matches
- Innings
- Balls

---

# Conclusion

The CricMate database schema was successfully normalized up to BCNF, ensuring efficient and reliable database design.
