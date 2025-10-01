const Schedule = require('../models/Schedule');
const Team = require('../models/Team').default;
const cacheService = require('../services/cacheService');

// Get home page data (matches + teams) in a single request
exports.getHomeData = async (req, res) => {
  try {
    console.log('HomeController: getHomeData called');
    const cacheKey = 'home-data';
    
    // Check cache first
    let homeData = cacheService.get(cacheKey);
    
    if (!homeData) {
      console.log('HomeController: Cache miss, fetching from database');
      
      // Fetch both datasets in parallel
      const [matches, teams] = await Promise.all([
        Schedule.find()
          .populate('team1', 'name shortName logo')
          .populate('team2', 'name shortName logo')
          .sort({ date: 1, matchNumber: 1 }),
        Team.find().sort({ name: 1 })
      ]);
      
      console.log('HomeController: Fetched matches:', matches.length);
      console.log('HomeController: Fetched teams:', teams.length);
      
      // Filter upcoming matches on the server side
      const upcomingMatches = matches.filter(match => match.status === 'Upcoming');
      console.log('HomeController: Upcoming matches:', upcomingMatches.length);
      
      homeData = {
        matches: upcomingMatches,
        teams: teams
      };
      
      // Cache for 2 minutes
      cacheService.set(cacheKey, homeData, 2 * 60 * 1000);
    } else {
      console.log('HomeController: Using cached data');
    }
    
    console.log('HomeController: Sending response:', homeData);
    res.json(homeData);
  } catch (error) {
    console.error('Error in getHomeData:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard data for authenticated users
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `dashboard-data-${userId}`;
    
    // Check cache first
    let dashboardData = cacheService.get(cacheKey);
    
    if (!dashboardData) {
      // Fetch dashboard data in parallel
      const [matches, teams, upcomingMatches] = await Promise.all([
        Schedule.find()
          .populate('team1', 'name shortName logo')
          .populate('team2', 'name shortName logo')
          .sort({ date: 1, matchNumber: 1 }),
        Team.find().sort({ name: 1 }),
        Schedule.find({ status: 'Upcoming' })
          .populate('team1', 'name shortName logo')
          .populate('team2', 'name shortName logo')
          .sort({ date: 1 })
          .limit(5)
      ]);
      
      dashboardData = {
        allMatches: matches,
        teams: teams,
        upcomingMatches: upcomingMatches
      };
      
      // Cache for 1 minute (user-specific data)
      cacheService.set(cacheKey, dashboardData, 1 * 60 * 1000);
    }
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    res.status(500).json({ message: error.message });
  }
};
