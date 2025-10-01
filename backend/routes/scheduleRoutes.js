const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.getAllMatches);
router.get('/upcoming', scheduleController.getUpcomingMatches);
router.get('/playoffs', scheduleController.getPlayoffMatches);
router.get('/:id', scheduleController.getMatchById);



module.exports = router;
