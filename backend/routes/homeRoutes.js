const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const auth = require('../middleware/auth');
const cacheService = require('../services/cacheService');

// Public home data endpoint
router.get('/', homeController.getHomeData);

// Test endpoint to check database connection
router.get('/test', async (req, res) => {
  try {
    const Schedule = require('../models/Schedule');
    const Team = require('../models/Team').default;
    
    const [matchCount, teamCount] = await Promise.all([
      Schedule.countDocuments(),
      Team.countDocuments()
    ]);
    
    res.json({
      message: 'Database connection successful',
      matchCount,
      teamCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Protected dashboard data endpoint
router.get('/dashboard', auth, homeController.getDashboardData);

// Cache management endpoints (for admin use)
router.post('/cache/clear', (req, res) => {
  try {
    cacheService.clear();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cache' });
  }
});

router.get('/cache/stats', (req, res) => {
  try {
    const stats = cacheService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error getting cache stats' });
  }
});

module.exports = router;
