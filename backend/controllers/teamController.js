const Team = require('../models/Team').default;
const Player = require('../models/Player').default;
const cacheService = require('../services/cacheService');

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const cacheKey = 'all-teams';
    
    // Check cache first
    let teams = cacheService.get(cacheKey);
    
    if (!teams) {
      teams = await Team.find().sort({ name: 1 });
      // Cache for 10 minutes (teams don't change often)
      cacheService.set(cacheKey, teams, 10 * 60 * 1000);
    }
    
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    console.log('Team ID requested:', req.params.id);
    //console.log("teamId in getTeamBYID function", await Team.findById(req.params.id));

    const team = await Team.findById(req.params.id);
    console.log('Team found (before populate):', team);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    const populatedTeam = await team.populate('name');
    console.log('Team after populate:', populatedTeam);
    res.json(populatedTeam);
  } catch (error) {
    console.error('Error in getTeamById:', error);
    res.status(500).json({ message: error.message });
  }
};


// Get team squad
exports.getTeamSquad = async (req, res) => {
  try {
    const teamId = req.params.id;
    const cacheKey = `team-squad-${teamId}`;
    
    // Check cache first
    let players = cacheService.get(cacheKey);
    
    if (!players) {
      // Use database sorting instead of client-side sorting for better performance
      players = await Player.find({ team: teamId })
        .sort({ 
          isCaptain: -1, 
          isViceCaptain: -1, 
          role: 1, 
          name: 1 
        });
      
      // Cache for 5 minutes (squad data changes less frequently)
      cacheService.set(cacheKey, players, 5 * 60 * 1000);
    }
    
    if (!players || players.length === 0) {
      return res.status(404).json({ message: 'No players found for this team' });
    }
    
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
