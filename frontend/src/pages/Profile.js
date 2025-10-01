import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/fantasy/teams');
        setTeams(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user teams:', err);
        setError('Failed to load your teams');
        setLoading(false);
      }
    };
    
    fetchUserTeams();
  }, []);
  
  const handleLogout = () => {
    logout();
    // Redirect happens automatically via AuthContext
  };
  
  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="profile-card">
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <p className="total-points">Total Points: <span>{user.points}</span></p>
        </div>
      </div>
      
      <div className="teams-section">
        <h2>Your Fantasy Teams</h2>
        
        {loading ? (
          <div className="loading">Loading your teams...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : teams.length === 0 ? (
          <div className="no-teams">
            <p>You haven't created any fantasy teams yet.</p>
            <a href="/schedule" className="create-team-link">Create your first team</a>
          </div>
        ) : (
          <div className="teams-grid">
            {teams.map(team => (
              <div key={team._id} className="team-card">
                <h3>{team.name}</h3>
                <p>Match: {team.match.team1.shortName} vs {team.match.team2.shortName}</p>
                <p>Points: {team.totalPoints}</p>
                <a href={`/fantasy/teams/${team.match._id}`} className="view-team-btn">
                  View Team
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
