// models/FantasyTeam.js
const mongoose = require('mongoose');

const FantasyTeamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule', // or 'Match' if you have a separate Match model
    required: true
  },
  players: [
    {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
      },
      isCaptain: {
        type: Boolean,
        default: false
      },
      isViceCaptain: {
        type: Boolean,
        default: false
      }
    }
  ],
  points: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FantasyTeam', FantasyTeamSchema);
