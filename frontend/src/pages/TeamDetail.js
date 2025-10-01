import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { SkeletonLoader, PlayerCardSkeleton } from '../components/SkeletonLoader';
import './TeamDetail.css';

const TeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const [teamRes, playersRes] = await Promise.all([
          axios.get(`/api/teams/${id}`),
          axios.get(`/api/teams/${id}/squad`)
        ]);
        
        setTeam(teamRes.data);
        setPlayers(playersRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [id]);

  if (loading) {
    return (
      <div className="team-detail-container">
        <div className="team-header">
          <div className="skeleton-circle large"></div>
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-text short"></div>
        </div>
        <div className="players-section">
          <h2>Team Squad</h2>
          <SkeletonLoader count={8} component={PlayerCardSkeleton} />
        </div>
      </div>
    );
  }

  if (!team) {
    return <div className="error">Team not found</div>;
  }

  return (
    <div className="team-detail-container">
      <div className="team-header">
        <img src={`/images/teams/${team.logo}`} alt={team.name} className="team-logo-large" />
        <div className="team-header-info">
          <h1>{team.name}</h1>
          <p>Home Ground: {team.homeGround}</p>
          <p>Group: {team.group}</p>
        </div>
      </div>

      <div className="team-squad">
        <h2>Squad</h2>
        <div className="players-grid">
          {players.map(player => (
            <div key={player._id} className="player-card">
              <div className="player-image">
                <img src={`/images/players/${player.image}`} alt={player.name} />
              </div>
              <div className="player-info">
                <h3>{player.name}</h3>
                <p>{player.role}</p>
                <p>{player.nationality}</p>
                {player.isCaptain && <span className="captain-badge">Captain</span>}
                {player.isViceCaptain && <span className="vice-captain-badge">Vice Captain</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
