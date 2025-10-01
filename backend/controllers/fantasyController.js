// controllers/fantasyController.js
const FantasyTeam = require('../models/FantasyTeam');
const Match = require('../models/Schedule');
const Player = require('../models/Player').default;
const PlayerPerformance = require('../models/PlayerPerformance');
const User = require('../models/User');

// Create a fantasy team for a match
exports.createFantasyTeam = async (req, res) => {
  try {
    const  matchId  = req.params.matchId;
    const { players } = req.body;
    const userId = req.user.id;

    // Validate match exists and is upcoming
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    if (match.status !== 'Upcoming') {
      return res.status(400).json({ message: 'Cannot create team for matches that have already started or completed' });
    }

    // Check if user already has a team for this match
    const existingTeam = await FantasyTeam.findOne({ user: userId, match: matchId });
    if (existingTeam) {
      return res.status(400).json({ message: 'You already have a team for this match. Use update instead.' });
    }

    // Validate team composition
    if (players.length !== 11) {
      return res.status(400).json({ message: 'Team must have exactly 11 players' });
    }

    // Extract player IDs and roles
    const playerIds = players.map(p => p.player);
    
    // Validate players exist and belong to the teams playing the match
    const matchPlayers = await Player.find({ 
      _id: { $in: playerIds },
      team: { $in: [match.team1, match.team2] }
    });
    
    if (matchPlayers.length !== playerIds.length) {
      return res.status(400).json({ message: 'Some selected players are invalid or not part of the match' });
    }

    // Validate team constraints
    const playersByRole = matchPlayers.reduce((acc, player) => {
      acc[player.role] = (acc[player.role] || 0) + 1;
      return acc;
    }, {});

    // Example validation: At least 1 wicketkeeper, 3 batsmen, 3 bowlers, 1 all-rounder
    if ((playersByRole['Wicket-Keeper'] || 0) < 1) {
      return res.status(400).json({ message: 'Team must have at least 1 wicket-keeper' });
    }
    if ((playersByRole['Batsman'] || 0) < 3) {
      return res.status(400).json({ message: 'Team must have at least 3 batsmen' });
    }
    if ((playersByRole['Bowler'] || 0) < 3) {
      return res.status(400).json({ message: 'Team must have at least 3 bowlers' });
    }
    if ((playersByRole['All-Rounder'] || 0) < 1) {
      return res.status(400).json({ message: 'Team must have at least 1 all-rounder' });
    }

    // Validate captain and vice-captain
    const captain = players.find(p => p.role === 'Captain');
    const viceCaptain = players.find(p => p.role === 'Vice-Captain');
    
    if (!captain || !viceCaptain) {
      return res.status(400).json({ message: 'Team must have a captain and vice-captain' });
    }
    
    if (captain.player === viceCaptain.player) {
      return res.status(400).json({ message: 'Captain and vice-captain must be different players' });
    }

    // Create new fantasy team
    const fantasyTeam = new FantasyTeam({
      user: userId,
      match: matchId,
      name: `${req.user.username}'s Team`,
      players: players,
      totalPoints: 0
    });
    
    await fantasyTeam.save();
    
    res.status(201).json(fantasyTeam);
  } catch (error) {
    console.error('Error creating fantasy team:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's fantasy team for a match
exports.getFantasyTeam = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;
    
    const team = await FantasyTeam.findOne({ user: userId, match: matchId })
      .populate({
        path: 'players.player',
        model: 'Player'
      })
      .populate('match');
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    res.json(team);
  } catch (error) {
    console.error('Error fetching fantasy team:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update fantasy team
exports.updateFantasyTeam = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { players } = req.body;
    const userId = req.user.id;
    
    // Find team
    const team = await FantasyTeam.findOne({ user: userId, match: matchId });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if match has started
    const match = await Match.findById(matchId);
    if (match.status !== 'Upcoming') {
      return res.status(400).json({ message: 'Cannot update team after match has started' });
    }
    
    // Perform all the same validations as in createFantasyTeam
    // (omitted for brevity but should be included in production code)
    
    // Update team
    team.players = players;
    await team.save();
    
    res.json(team);
  } catch (error) {
    console.error('Error updating fantasy team:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Calculate fantasy points for a match
exports.calculateFantasyPoints = async (req, res) => {
  try {
    const { matchId } = req.params;
    
    // Check if match is completed
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    if (match.status !== 'Completed') {
      return res.status(400).json({ message: 'Cannot calculate points for matches that are not completed' });
    }
    
    // Get all player performances for this match
    const performances = await PlayerPerformance.find({ match: matchId });
    
    // Get all fantasy teams for this match
    const fantasyTeams = await FantasyTeam.find({ match: matchId });
    
    // Calculate points for each fantasy team
    for (const team of fantasyTeams) {
      let totalPoints = 0;
      
      for (const teamPlayer of team.players) {
        const playerPerf = performances.find(p => 
          p.player.toString() === teamPlayer.player.toString()
        );
        
        if (playerPerf) {
          let playerPoints = playerPerf.fantasyPoints;
          
          // Apply multipliers for captain and vice-captain
          if (teamPlayer.role === 'Captain') {
            playerPoints *= 2;
          } else if (teamPlayer.role === 'Vice-Captain') {
            playerPoints *= 1.5;
          }
          
          totalPoints += playerPoints;
        }
      }
      
      // Update fantasy team with total points
      team.totalPoints = totalPoints;
      await team.save();
      
      // Update user's total points
      await User.findByIdAndUpdate(
        team.user,
        { $inc: { points: totalPoints } }
      );
    }
    
    res.json({ message: 'Fantasy points calculated successfully' });
  } catch (error) {
    console.error('Error calculating fantasy points:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get match leaderboard
exports.getMatchLeaderboard = async (req, res) => {
  try {
    const { matchId } = req.params;
    
    const leaderboard = await FantasyTeam.find({ match: matchId })
      .sort({ totalPoints: -1 })
      .populate('user', 'username')
      .select('user name totalPoints');
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching match leaderboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get overall leaderboard
exports.getOverallLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ points: -1 })
      .select('username points')
      .limit(100);
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching overall leaderboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
