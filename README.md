Fantasy King - IPL Fantasy Cricket App

A full-stack fantasy cricket application built with React and Node.js, allowing users to create fantasy teams, compete in leagues, and track their performance during IPL matches.

**🏏 Features**

Core Functionality

User Authentication: Secure registration and login system with JWT tokens

Fantasy Team Creation: Build your dream team with 11 players within budget constraints

Real-time Points Calculation: Automatic scoring based on player performance

Match Management: View schedules, match details, and live updates

Leaderboards: Track your performance against other players

Team Management: Browse IPL teams and player statistics

Key Features

Captain & Vice-Captain Selection: Double and 1.5x points for captain and vice-captain

Role-based Player Selection: Choose from Batsmen, Bowlers, All-rounders, and Wicket-keepers

Performance Tracking: Real-time points calculation based on batting, bowling, and fielding

Responsive Design: Mobile-friendly interface for all devices

**🛠️ Tech Stack**

Frontend

React 19 - Modern UI library

React Router DOM - Client-side routing

Axios - HTTP client for API calls

CSS3 - Styling and responsive design

Backend

Node.js - Runtime environment

Express.js - Web framework

MongoDB - NoSQL database

Mongoose - MongoDB object modeling

JWT - Authentication tokens

bcryptjs - Password hashing

**Getting Started**

Prerequisites

Node.js (v14 or higher)

MongoDB (local or cloud instance)

npm or yarn package manager

Installation

Clone the repository

git clone <repository-url>
cd Fantasy King


Install backend dependencies

cd backend
npm install


Install frontend dependencies

cd ../frontend
npm install


Environment Setup
Create a .env file in the backend directory:

PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key


Start the application

Backend Server:

cd backend
npm start


Server will run on http://localhost:5001

Frontend Development Server:

cd frontend
npm start


Application will run on http://localhost:3000

**🎮 How to Play**

Register/Login: Create an account or login to existing account

Browse Matches: View upcoming IPL matches on the schedule page

Create Fantasy Team:

Select 11 players within budget (100 credits)

Choose 1 captain (2x points) and 1 vice-captain (1.5x points)

Ensure team composition: 1-3 Wicket-keepers, 3-5 Batsmen, 1-3 All-rounders, 3-5 Bowlers

Track Performance: Monitor your team's performance and points

Compete: Check leaderboards to see how you rank against other players

📊 Points System

Batting Points

Runs: 1 point per run

Boundaries: +1 point per four, +2 points per six

Milestones: +8 points for 50, +16 points for 100

Duck Penalty: -2 points for getting out on 0

Bowling Points

Wickets: 25 points per wicket

Maiden Overs: 8 points per maiden over

Milestones: +8 points for 4-wicket haul, +16 points for 5-wicket haul

Fielding Points

Catches: 8 points per catch

Stumpings: 12 points per stumping

Run Outs: 6 points per run out

Multiplier

Captain: 2x points

Vice-Captain: 1.5x points

🔧 API Endpoints

Authentication

POST /api/users/register - User registration

POST /api/users/login - User login

GET /api/users/profile - Get user profile

Teams & Players

GET /api/teams - Get all IPL teams

GET /api/teams/:id - Get team details

GET /api/teams/:id/players - Get team players

Fantasy Teams

POST /api/fantasy/teams - Create fantasy team

GET /api/fantasy/teams/:matchId - Get user's team for match

PUT /api/fantasy/teams/:id - Update fantasy team

Schedule & Matches

GET /api/schedule - Get match schedule

GET /api/schedule/:id - Get match details

Leaderboard

GET /api/home/leaderboard - Get global leaderboard

GET /api/home/match-leaderboard/:matchId - Get match leaderboard

**🎨 UI Components**

Responsive Design: Mobile-first approach with CSS Grid and Flexbox

Modern Interface: Clean, intuitive design with IPL-themed styling

Loading States: Skeleton loaders for better user experience

Error Handling: User-friendly error messages and validation

**🔒 Security Features**

JWT Authentication: Secure token-based authentication

Password Hashing: bcryptjs for secure password storage

Input Validation: Server-side validation for all inputs

CORS Configuration: Proper cross-origin resource sharing setup
