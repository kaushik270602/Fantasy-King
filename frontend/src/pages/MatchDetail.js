import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MatchDetail.css';

const MatchDetail = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleCreateTeam = () => {
    navigate(`/create-team/${id}`); // Navigate to CreateFantasyTeam page
  };

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`/api/schedule/${id}`);
        console.log('Response',response.data);
        setMatch(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching match details:', error);
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading match details...</div>;
  }

  if (!match) {
    return <div className="error">Match not found</div>;
  }

  return (
    <div className="match-detail-container">
      <h1>Match #{match.matchNumber}</h1>
      
      <div className="match-info">
        <div className="match-teams">
          <div className="team team1">
            <img src={`/images/teams/${match.team1?.logo}`} alt={match.team1?.name} />
            <h2>{match.team1?.name}</h2>
          </div>
          
          <div className="vs">VS</div>
          
          <div className="team team2">
            <img src={`/images/teams/${match.team2?.logo}`} alt={match.team2?.name} />
            <h2>{match.team2?.name}</h2>
          </div>
        </div>
        
        <div className="match-details">
          <p><strong>Date:</strong> {new Date(match.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {match.time}</p>
          <p><strong>Venue:</strong> {match.venue}</p>
          <p><strong>Match Type:</strong> {match.matchType}</p>
          <p><strong>Status:</strong> {match.status}</p>
          {match.result && <p><strong>Result:</strong> {match.result}</p>}
        </div>
      </div>
      
      {match.status === 'Upcoming' && (
        <div className="fantasy-team-section">
          <h2>Create Your Fantasy Team</h2>
          <button className="create-team-btn" onClick={handleCreateTeam}>Create Team</button>
        </div>
      )}
    </div>
  );
};

export default MatchDetail;
