import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('/api/teams');
        console.log('API Response:', response.data);
        setTeams(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, []);
  

  if (loading) {
    return <div className="loading">Loading teams...</div>;
  }

  return (
    <div className="teams-container">
      <h1>IPL 2025 Teams</h1>
      <div className="teams-grid">
        {teams.map(team => (
          <Link to={`/teams/${team._id}`} key={team._id} className="team-card">
            <div className="team-logo">
              <img src={`/images/teams/${team.logo}`} alt={team.name} />
            </div>
            <div className="team-info">
              <h2>{team.name}</h2>
              <p>Home Ground: {team.homeGround}</p>
              <p>Group: {team.group}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Teams;
