// routes/fantasyRoutes.js
const express = require('express');
const router = express.Router();
const fantasyController = require('../controllers/fantasyController');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


router.get('/profile', auth, async (req, res) => {
  res.json({ msg: 'You are authenticated!', user: req.user });
});


// Create a fantasy team for a match
router.post('/:matchId', auth, fantasyController.createFantasyTeam);

// Get user's fantasy team for a match
router.get('/:matchId', auth, fantasyController.getFantasyTeam);

// Update fantasy team
router.put('/:matchId', auth, fantasyController.updateFantasyTeam);

// Calculate fantasy points for a match (admin only)
router.post('/calculate/:matchId', auth, fantasyController.calculateFantasyPoints);

// Get match leaderboard
router.get('/leaderboard/match/:matchId', fantasyController.getMatchLeaderboard);

// Get overall leaderboard
router.get('/leaderboard/overall', fantasyController.getOverallLeaderboard);

module.exports = router;
