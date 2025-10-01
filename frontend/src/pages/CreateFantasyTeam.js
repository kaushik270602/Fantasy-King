// src/pages/CreateFantasyTeam.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateFantasyTeam.css';

const CreateFantasyTeam = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [teamStats, setTeamStats] = useState({
    batsmen: 0,
    bowlers: 0,
    allRounders: 0,
    wicketKeepers: 0,
    team1Count: 0,
    team2Count: 0
  });
  const [activeTab, setActiveTab] = useState('players'); // 'players' or 'captains'

  // Fetch match details and available players
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get match details
        const matchRes = await axios.get(`/api/schedule/${matchId}`);
        setMatch(matchRes.data);

        const team1Id = matchRes.data.team1._id;
        const team2Id = matchRes.data.team2._id;

        const [team1PlayersRes, team2PlayersRes] = await Promise.all([
          axios.get(`/api/teams/${team1Id}/squad`),
          axios.get(`/api/teams/${team2Id}/squad`)
        ]);
        setAvailablePlayers([...team1PlayersRes.data, ...team2PlayersRes.data]);

        // Check if user already has a team for this match
        try {
          const teamRes = await axios.get(`/api/fantasy/teams/${matchId}`);
          const existingTeam = teamRes.data;

          // Pre-populate selected players, captain, and vice-captain
          const selected = existingTeam.players.map(p => ({
            ...p.player,
            role: p.role
          }));
          setSelectedPlayers(selected);
          setCaptain(selected.find(p => p.role === 'Captain')?._id || null);
          setViceCaptain(selected.find(p => p.role === 'Vice-Captain')?._id || null);

          // Update team stats
          updateTeamStats(selected, matchRes.data);
        } catch (err) {
          // No existing team, that's fine
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load match data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [matchId]);

  // Update team statistics whenever selected players change
  const updateTeamStats = (players, matchObj = match) => {
    if (!matchObj) return;
    const stats = {
      batsmen: 0,
      bowlers: 0,
      allRounders: 0,
      wicketKeepers: 0,
      team1Count: 0,
      team2Count: 0
    };
    players.forEach(player => {
      // Count by role
      if (player.role === 'Batsman') stats.batsmen++;
      else if (player.role === 'Bowler') stats.bowlers++;
      else if (player.role === 'All-rounder') stats.allRounders++;
      else if (player.role === 'Wicket-keeper') stats.wicketKeepers++;

      // Count by team
      if (player.team.toString() === matchObj.team1._id.toString()) {
        stats.team1Count++;
      } else if (player.team.toString() === matchObj.team2._id.toString()) {
        stats.team2Count++;
      }
    });

    setTeamStats(stats);
  };

  // Handle player selection/deselection
  const togglePlayerSelection = (player) => {
    const isSelected = selectedPlayers.some(p => p._id === player._id);

    if (isSelected) {
      // Remove player
      const updatedPlayers = selectedPlayers.filter(p => p._id !== player._id);
      setSelectedPlayers(updatedPlayers);

      // If this player was captain or vice-captain, reset those
      if (captain === player._id) setCaptain(null);
      if (viceCaptain === player._id) setViceCaptain(null);

      updateTeamStats(updatedPlayers);
    } else {
      // Count players from this player's team
      const teamCount = selectedPlayers.filter(
        p => p.team.toString() === player.team.toString()
      ).length;

      if (teamCount >= 7) {
        setError('You cannot select more than 7 players from the same team');
        setTimeout(() => setError(null), 3000);
        return;
      }

      if (selectedPlayers.length < 11) {
        const updatedPlayers = [...selectedPlayers, player];
        setSelectedPlayers(updatedPlayers);
        updateTeamStats(updatedPlayers);

        // If this is the 11th player, check role requirements
        if (updatedPlayers.length === 11) {
          // Calculate new stats
          const stats = {
            batsmen: 0,
            bowlers: 0,
            allRounders: 0,
            wicketKeepers: 0,
          };
          updatedPlayers.forEach(p => {
            if (p.role === 'Batsman') stats.batsmen++;
            else if (p.role === 'Bowler') stats.bowlers++;
            else if (p.role === 'All-rounder') stats.allRounders++;
            else if (p.role === 'Wicket-keeper') stats.wicketKeepers++;
          });

          // Check each requirement and show error if not met
          if (stats.wicketKeepers < 1) {
            setError('You must select at least 1 wicket-keeper');
            setTimeout(() => setError(null), 3000);
          } else if (stats.batsmen < 3) {
            setError('You must select at least 3 batsmen');
            setTimeout(() => setError(null), 3000);
          } else if (stats.bowlers < 3) {
            setError('You must select at least 3 bowlers');
            setTimeout(() => setError(null), 3000);
          } else if (stats.allRounders < 1) {
            setError('You must select at least 1 all-rounder');
            setTimeout(() => setError(null), 3000);
          } else {
            // All criteria met, prompt for captain/vice-captain
            setError(null);
            setActiveTab('captains');
          }
        }
      } else {
        setError('You can only select 11 players');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Set player as captain
  const setPlayerAsCaptain = (playerId) => {
    if (viceCaptain === playerId) {
      setViceCaptain(null);
    }
    setCaptain(playerId);
  };

  // Set player as vice-captain
  const setPlayerAsViceCaptain = (playerId) => {
    if (captain === playerId) {
      setCaptain(null);
    }
    setViceCaptain(playerId);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Get filtered players based on active filter
  const getFilteredPlayers = () => {
    if (!match) return [];
    if (activeFilter === 'All') {
      return availablePlayers;
    } else if (activeFilter === match.team1.shortName) {
      return availablePlayers.filter(player =>
        player.team.toString() === match.team1._id.toString()
      );
    } else if (activeFilter === match.team2.shortName) {
      return availablePlayers.filter(player =>
        player.team.toString() === match.team2._id.toString()
      );
    } else if (activeFilter === 'BAT') {
      return availablePlayers.filter(player => player.role === 'Batsman');
    } else if (activeFilter === 'BOWL') {
      return availablePlayers.filter(player => player.role === 'Bowler');
    } else if (activeFilter === 'AR') {
      return availablePlayers.filter(player => player.role === 'All-rounder');
    } else if (activeFilter === 'WK') {
      return availablePlayers.filter(player => player.role === 'Wicket-keeper');
    }
    return availablePlayers;
  };

  // Submit fantasy team
  const submitTeam = async () => {
    try {
      // Format players with roles
      const players = selectedPlayers.map(player => ({
        player: player._id,
        role: player._id === captain ? 'Captain' :
          player._id === viceCaptain ? 'Vice-Captain' : 'Player'
      }));

      // Check if user already has a team for this match
      let response;

      const getRespons1 = await axios.get(`/api/fantasy/teams/${matchId}`);
      console.log('testres',getRespons1);

      const getResponse = await axios.get(`/api/fantasy/teams/${matchId}`).catch(() => null);
     
      if (getResponse && getResponse.status === 200) {
      // Team exists, so update it
        response = await axios.put(`/api/fantasy/teams/${matchId}`, { players });
      } else {
      // No team exists, create a new one
        response = await axios.post(`/api/fantasy/teams/${matchId}`, { players });
      }
      // Navigate to team view page
      navigate(`/fantasy/${matchId}`);
    } catch (err) {
      console.log('Save team error:', err);
      setError(err.response?.data?.message || 'Failed to save team. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading match data...</div>;
  }

  if (!match) {
    return <div className="error">Match not found</div>;
  }

  // Determine which players to show in the grid
  const playersToShow = activeTab === 'players'
    ? getFilteredPlayers()
    : selectedPlayers;

  return (
    <div className="create-fantasy-team">
      <h1>Create Your Fantasy Team</h1>

      <div className="match-info-banner">
        <div className="team-logo">
          <img src={`/images/teams/${match.team1.logo}`} alt={match.team1.name} />
          <p>{match.team1.name}</p>
        </div>

        <div className="match-details">
          <p className="match-number">Match #{match.matchNumber}</p>
          <p className="match-venue">{match.venue}</p>
          <p className="match-time">{new Date(match.date).toLocaleDateString()} | {match.time}</p>
        </div>

        <div className="team-logo">
          <img src={`/images/teams/${match.team2.logo}`} alt={match.team2.name} />
          <p>{match.team2.name}</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="team-stats">
        <div className="stat-item">
          <span className="stat-label">Players</span>
          <span className={`stat-value ${selectedPlayers.length === 11 ? 'complete' : ''}`}>
            {selectedPlayers.length}/11
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Batsmen</span>
          <span className={`stat-value ${teamStats.batsmen >= 3 ? 'complete' : ''}`}>
            {teamStats.batsmen}/3+
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Bowlers</span>
          <span className={`stat-value ${teamStats.bowlers >= 3 ? 'complete' : ''}`}>
            {teamStats.bowlers}/3+
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">All-Rounders</span>
          <span className={`stat-value ${teamStats.allRounders >= 1 ? 'complete' : ''}`}>
            {teamStats.allRounders}/1+
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Wicket-Keepers</span>
          <span className={`stat-value ${teamStats.wicketKeepers >= 1 ? 'complete' : ''}`}>
            {teamStats.wicketKeepers}/1+
          </span>
        </div>
      </div>

      <div className="team-selection-tabs">
        <button
          className={`tab-button ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          Select Players
        </button>
        <button
          className={`tab-button ${activeTab === 'captains' ? 'active' : ''}`}
          onClick={() => setActiveTab('captains')}
          disabled={!selectedPlayers.length}
        >
          Select Captain & Vice-Captain
        </button>
      </div>

      {activeTab === 'players' && (
        <div className="player-filters">
          <button
            className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => handleFilterChange('All')}
          >
            All
          </button>
          <button
            className={`filter-btn ${activeFilter === match.team1.shortName ? 'active' : ''}`}
            onClick={() => handleFilterChange(match.team1.shortName)}
          >
            {match.team1.shortName}
          </button>
          <button
            className={`filter-btn ${activeFilter === match.team2.shortName ? 'active' : ''}`}
            onClick={() => handleFilterChange(match.team2.shortName)}
          >
            {match.team2.shortName}
          </button>
          <button
            className={`filter-btn ${activeFilter === 'BAT' ? 'active' : ''}`}
            onClick={() => handleFilterChange('BAT')}
          >
            BAT
          </button>
          <button
            className={`filter-btn ${activeFilter === 'BOWL' ? 'active' : ''}`}
            onClick={() => handleFilterChange('BOWL')}
          >
            BOWL
          </button>
          <button
            className={`filter-btn ${activeFilter === 'AR' ? 'active' : ''}`}
            onClick={() => handleFilterChange('AR')}
          >
            AR
          </button>
          <button
            className={`filter-btn ${activeFilter === 'WK' ? 'active' : ''}`}
            onClick={() => handleFilterChange('WK')}
          >
            WK
          </button>
        </div>
      )}

      <div className="players-grid">
        {playersToShow.map(player => {
          const isSelected = selectedPlayers.some(p => p._id === player._id);
          const isCaptain = captain === player._id;
          const isViceCaptain = viceCaptain === player._id;

          return (
            <div
              key={player._id}
              className={`player-card ${isSelected ? 'selected' : ''} ${isCaptain ? 'captain' : ''} ${isViceCaptain ? 'vice-captain' : ''}`}
              onClick={() => activeTab === 'players' && togglePlayerSelection(player)}
            >
              <div className="player-image">
                <img src={`/images/players/${player.image}`} alt={player.name} />
                {activeTab === 'captains' && isSelected && (
                  <div className="player-actions">
                    <button
                      className={`captain-btn ${isCaptain ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayerAsCaptain(player._id);
                      }}
                    >
                      C
                    </button>
                    <button
                      className={`vice-captain-btn ${isViceCaptain ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayerAsViceCaptain(player._id);
                      }}
                    >
                      VC
                    </button>
                  </div>
                )}
              </div>
              <div className="player-info">
                <h3>{player.name}</h3>
                <p className="player-team">{player.team.shortName}</p>
                <p className="player-role">{player.role}</p>
                <p className="player-price">{player.price / 100000} Cr</p>
              </div>
              {isCaptain && <div className="captain-badge">C</div>}
              {isViceCaptain && <div className="vice-captain-badge">VC</div>}
            </div>
          );
        })}
      </div>

      <div className="submit-section">
        <button
          className="submit-team-btn"
          onClick={submitTeam}
          disabled={selectedPlayers.length !== 11 || !captain || !viceCaptain}
        >
          Save Team
        </button>
      </div>
    </div>
  );
};

export default CreateFantasyTeam;
