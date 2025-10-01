// models/PlayerPerformance.js
const mongoose = require('mongoose');

const PlayerPerformanceSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  runs: { type: Number, default: 0 },
  ballsFaced: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  overs: { type: Number, default: 0 },
  maidens: { type: Number, default: 0 },
  runsConceded: { type: Number, default: 0 },
  catches: { type: Number, default: 0 },
  stumpings: { type: Number, default: 0 },
  runOuts: { type: Number, default: 0 },
  fantasyPoints: { type: Number, default: 0 }
});

module.exports = mongoose.model('PlayerPerformance', PlayerPerformanceSchema);
