import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MatchCard from '../components/MatchCard';
import { SkeletonLoader, MatchCardSkeleton, TeamCardSkeleton } from '../components/SkeletonLoader';
import './Home.css';

const Home = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching home data from /api/home...');
        // Use the new combined API endpoint for better performance
        const response = await axios.get('/api/home');
        
        console.log('Home API Response:', response.data);
        console.log('Matches:', response.data.matches);
        console.log('Teams:', response.data.teams);
        
        setUpcomingMatches(response.data.matches || []);
        setTeams(response.data.teams || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data from /api/home:', error);
        console.error('Error details:', error.response?.data);
        
        // Fallback to individual API calls if combined endpoint fails
        console.log('Falling back to individual API calls...');
        try {
          const [matchesRes, teamsRes] = await Promise.all([
            axios.get('/api/schedule'),
            axios.get('/api/teams')
          ]);

          const upcoming = matchesRes.data.filter(match => match.status === 'Upcoming');
          console.log('Fallback - Upcoming matches:', upcoming);
          console.log('Fallback - Teams:', teamsRes.data);

          setUpcomingMatches(upcoming);
          setTeams(teamsRes.data);
          setLoading(false);
        } catch (fallbackError) {
          console.error('Fallback API calls also failed:', fallbackError);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="home">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-line">IPL Fantasy</span>
                <span className="title-year">2025</span>
              </h1>
              <p className="hero-subtitle">
                Create your dream team, compete with friends, and win amazing prizes!
              </p>
            </div>
            <div className="hero-visual">
              <div className="cricket-ball">
                <div className="ball-seam"></div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="upcoming-matches">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-calendar-check"></i>
              Upcoming Matches
            </h2>
          </div>
          <SkeletonLoader count={3} component={MatchCardSkeleton} />
        </section>
        
        <section className="teams-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-users"></i>
              Teams
            </h2>
          </div>
          <SkeletonLoader count={6} component={TeamCardSkeleton} />
        </section>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">IPL Fantasy</span>
              <span className="title-year">2025</span>
            </h1>
            <p className="hero-subtitle">
              Create your dream team, compete with friends, and win amazing prizes!
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10</div>
                <div className="stat-label">Teams</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">74</div>
                <div className="stat-label">Matches</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Players</div>
              </div>
            </div>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                <i className="fas fa-rocket"></i>
                <span>Start Playing</span>
              </Link>
              <Link to="/schedule" className="btn btn-outline btn-large">
                <i className="fas fa-calendar-alt"></i>
                <span>View Schedule</span>
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="cricket-ball">
              <div className="ball-seam"></div>
            </div>
            <div className="floating-elements">
              <div className="floating-icon">🏏</div>
              <div className="floating-icon">🏆</div>
              <div className="floating-icon">⚡</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section className="upcoming-matches">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-calendar-check"></i>
            Upcoming Matches
          </h2>
          <p className="section-subtitle">Don't miss the action! Create your fantasy team now.</p>
        </div>
        <div className="matches-grid">
          {upcomingMatches.length > 0 ? (
            upcomingMatches.slice(0, 3).map((match, index) => (
              <div key={match._id} className="match-card-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
                <MatchCard match={match} />
              </div>
            ))
          ) : (
            <div className="no-matches">
              <i className="fas fa-calendar-times"></i>
              <p>No upcoming matches available</p>
            </div>
          )}
        </div>
        <div className="section-footer">
          <Link to="/schedule" className="btn btn-outline">
            <i className="fas fa-arrow-right"></i>
            <span>View All Matches</span>
          </Link>
        </div>
      </section>

      {/* Teams Section */}
      <section className="teams-section">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-users"></i>
            Teams
          </h2>
          <p className="section-subtitle">Choose your favorite team and build the ultimate squad.</p>
        </div>
        <div className="teams-grid">
          {teams.map((team, index) => (
            <Link 
              key={team._id} 
              to={`/teams/${team._id}`} 
              className="team-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="team-logo">
                <img src={`/images/teams/${team.logo}`} alt={team.name} />
              </div>
              <div className="team-info">
                <h3 className="team-short-name">{team.shortName}</h3>
                <p className="team-full-name">{team.name}</p>
              </div>
              <div className="team-overlay">
                <i className="fas fa-arrow-right"></i>
              </div>
            </Link>
          ))}
        </div>
        <div className="section-footer">
          <Link to="/teams" className="btn btn-outline">
            <i className="fas fa-arrow-right"></i>
            <span>View All Teams</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-star"></i>
            Why Choose IPL Fantasy?
          </h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <h3>Win Prizes</h3>
            <p>Compete and win amazing prizes in daily and season-long contests.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Play with Friends</h3>
            <p>Create private leagues and compete with your friends and family.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Real-time Updates</h3>
            <p>Get live scores, player stats, and leaderboard updates in real-time.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;