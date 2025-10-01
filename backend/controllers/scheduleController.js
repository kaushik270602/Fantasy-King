const Schedule = require('../models/Schedule');
const cacheService = require('../services/cacheService');

// Get all matches
exports.getAllMatches = async (req, res) => {
  try {
    const cacheKey = 'all-matches';
    
    // Check cache first
    let matches = cacheService.get(cacheKey);
    
    if (!matches) {
      matches = await Schedule.find()
        .populate('team1', 'name shortName logo') // Only select the fields you need
        .populate('team2', 'name shortName logo')
        .sort({ date: 1, matchNumber: 1 });
      
      // Cache for 2 minutes (schedule data changes more frequently)
      cacheService.set(cacheKey, matches, 2 * 60 * 1000);
    }
    
    console.log("First Match details: ", matches);
    res.json(matches);
  } catch (error) {
    console.error('Error in getAllMatches:', error);
    res.status(500).json({ message: error.message });
  }
};


// Get upcoming matches (from current date)
exports.getUpcomingMatches = async (req, res) => {
  try {
    const currentDate = new Date();
    const matches = await Schedule.find({ 
      date: { $gte: currentDate } 
    }).sort({ date: 1, matchNumber: 1 }).limit(10);
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get playoff matches
exports.getPlayoffMatches = async (req, res) => {
  try {
    const matches = await Schedule.find({ 
      matchType: { $in: ['Qualifier 1', 'Eliminator', 'Qualifier 2', 'Final'] } 
    }).sort({ date: 1 });
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get match by ID
exports.getMatchById = async (req, res) => {
  try {
    const match = await Schedule.findById(req.params.id)
  .populate('team1', 'name shortName logo')
  .populate('team2', 'name shortName logo');
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
