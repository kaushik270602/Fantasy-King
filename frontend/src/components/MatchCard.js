import React from 'react';
import { Link } from 'react-router-dom';
import './MatchCard.css';

const MatchCard = ({ match }) => {
  // Format date
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'status-upcoming';
      case 'live':
        return 'status-live';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-upcoming';
    }
  };

  return (
    <Link to={`/matches/${match._id}`} className="match-card">
      <div className="match-card-inner">
        <div className="match-header">
          <div className="match-number">
            <i className="fas fa-hashtag"></i>
            <span>Match {match.matchNumber}</span>
          </div>
          <div className={`match-status ${getStatusColor(match.status)}`}>
            <div className="status-dot"></div>
            <span>{match.status}</span>
          </div>
        </div>
        
        <div className="match-teams">
          <div className="team-info team-1">
            <div className="team-logo-container">
              <img src={`/images/widgets/${match.team1?.logo}`} alt={match.team1?.shortName} className="team-logo" />
            </div>
            <div className="team-details">
              <span className="team-name">{match.team1?.shortName}</span>
              <span className="team-full-name">{match.team1?.name}</span>
            </div>
          </div>
          
          <div className="vs-container">
            <div className="vs">VS</div>
            <div className="match-type">{match.matchType}</div>
          </div>
          
          <div className="team-info team-2">
            <div className="team-logo-container">
              <img src={`/images/widgets/${match.team2?.logo}`} alt={match.team2?.shortName} className="team-logo" />
            </div>
            <div className="team-details">
              <span className="team-name">{match.team2?.shortName}</span>
              <span className="team-full-name">{match.team2?.name}</span>
            </div>
          </div>
        </div>
        
        <div className="match-details">
          <div className="match-venue">
            <i className="fas fa-map-marker-alt"></i>
            <span>{match.venue}</span>
          </div> 
          <div className="match-time">
            <div className="date-time">
              <i className="fas fa-calendar"></i>
              <span className="date">{formattedDate}</span>
            </div>
            <div className="time-container">
              <i className="fas fa-clock"></i>
              <span className="time">{match.time}</span>
            </div>
          </div>
        </div>

        <div className="match-actions">
          <div className="action-btn">
            <i className="fas fa-eye"></i>
            <span>View Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
