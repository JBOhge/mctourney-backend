const mongoose = require('mongoose');
const Match = require('./matchModel');

const tournamentSchema = mongoose.Schema({
  isStarted: {
    type: Boolean,
    default: false,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
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

tournamentSchema.pre('remove', function (next) {
  console.log('remove middleware entered');
  Match.deleteMany({ tournament: this._id }).exec();
  next();
});

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
  ]);
  next();
});

module.exports = mongoose.model('Tournament', tournamentSchema);
