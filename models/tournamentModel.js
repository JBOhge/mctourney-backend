const mongoose = require('mongoose');
const Match = require('./matchModel');
const Player = require('./playerModel');

const tournamentSchema = mongoose.Schema({
  isStarted: {
    type: Boolean,
    default: false,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'tournament must have an owner'],
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
  players: { type: [Player.schema], default: [] },
  matches: { type: [Match.schema], default: [] },
  matchPointsToWin: {
    type: Number,
    default: 2,
  },
  finalMatchPointsToWin: {
    type: Number,
    default: 2,
  },
  winner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Player',
  },
});

// tournamentSchema.pre(/^find/, function (next) {
//   this.find({ isPublic: { $ne: false } });
//   next();
// });

tournamentSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: 'players',
      select: '-__v -playerId',
    },
    {
      path: 'winner',
      select: '-__v -playerId',
    },
    {
      path: 'owner',
      select: '-email',
    },
  ]);
  next();
});

module.exports = mongoose.model('Tournament', tournamentSchema);
