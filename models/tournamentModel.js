const mongoose = require('mongoose');
const matchModel = require('./matchModel');

const tournamentSchema = mongoose.Schema({
  isStarted: {
    type: Boolean,
    default: false,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    required: [true, 'tournament must have a size'],
    validate: {
      validator: function (val) {
        return [4, 8, 16, 32].includes(val);
      },
      message: 'size should be one of the following: 4,8,16,32',
    },
  },
  players: { type: [{ type: mongoose.Schema.ObjectId, ref: 'Player' }], default: [] },
  matches: { type: [{ type: mongoose.Schema.ObjectId, ref: 'Match' }], default: [] },
  winner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Player',
  },
});

tournamentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'players',
    select: '-__v -playerId'
  });
  next();
});

module.exports = mongoose.model('Tournament', tournamentSchema);
