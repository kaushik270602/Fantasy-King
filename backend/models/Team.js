import mongoose, { model, Schema } from 'mongoose';

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  homeGround: {
    type: String,
    required: true
  },
  captain: {
    type: String
  },
  group: {
    type: String,
    enum: ['A', 'B'],
    required: true
  },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
});

export default model('Team', TeamSchema, 'team');
