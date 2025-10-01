const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  matchNumber: {
    type: Number,
    required: true
  },
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  matchType: {
    type: String,
    enum: ['League', 'Qualifier 1', 'Eliminator', 'Qualifier 2', 'Final'],
    default: 'League'
  },
  result: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Live', 'Completed'],
    default: 'Upcoming'
  }
});

// Add indexes for better query performance
ScheduleSchema.index({ date: 1, matchNumber: 1 });
ScheduleSchema.index({ status: 1, date: 1 });
ScheduleSchema.index({ team1: 1, team2: 1 });
ScheduleSchema.index({ matchType: 1, date: 1 });

module.exports = mongoose.model('Schedule', ScheduleSchema);
