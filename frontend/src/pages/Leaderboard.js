import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const { matchId } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardType, setLeaderboardType] = useState(matchId ? 'match' : 'overall');
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        let endpoint = '/api/leaderboard/overall';
        
        if (leaderboardType === 'match' && matchId) {
          endpoint = `/api/leaderboard/match/${matchId}`;
        }
        
        const response = await axios.get(endpoint);
        setEntries(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard data');
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [matchId, leaderboardType]);
  
  const handleTypeChange = (type) => {
    setLeaderboardType(type);
  };
  
  if (loading) {
    return <div className="loading">Loading leaderboard...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="leaderboard-container">
      <h1>IPL 2025 Fantasy Leaderboard</h1>
      
      {!matchId && (
        <div className="leaderboard-tabs">
          <button 
            className={`tab-button ${leaderboardType === 'overall' ? 'active' : ''}`}
            onClick={() => handleTypeChange('overall')}
          >
            Overall Leaderboard
          </button>
          <button 
            className={`tab-button ${leaderboardType === 'match' ? 'active' : ''}`}
            onClick={() => handleTypeChange('match')}
            disabled={!matchId}
          >
            Match Leaderboard
          </button>
        </div>
      )}
      
      {entries.length === 0 ? (
        <div className="no-data">No leaderboard data available yet</div>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Points</th>
              {leaderboardType === 'match' && <th>Team Name</th>}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.user || index} className={index < 3 ? `top-${index + 1}` : ''}>
                <td>#{entry.rank || index + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.points}</td>
                {leaderboardType === 'match' && <td>{entry.teamName || '-'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
