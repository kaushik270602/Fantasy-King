import mongoose, { model, Schema } from 'mongoose';

const PlayerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  role: {
    type: String,
    enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'],
    required: true
  },
  battingStyle: {
    type: String,
    enum: ['Right-handed', 'Left-handed'],
    required: true
  },
  bowlingStyle: {
    type: String,
    default: ''
  },
  nationality: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  isCaptain: {
    type: Boolean,
    default: false
  },
  isViceCaptain: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: 'default-player.png'
  },
  position: String
});

// Add compound indexes for better query performance
PlayerSchema.index({ team: 1, isCaptain: -1, isViceCaptain: -1, role: 1, name: 1 });
PlayerSchema.index({ team: 1, role: 1 });
PlayerSchema.index({ isCaptain: -1, isViceCaptain: -1 });

export default model('Player', PlayerSchema);
