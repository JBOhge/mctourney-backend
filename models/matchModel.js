const mongoose = require('mongoose');
const Player = require('./playerModel');

const matchSchema = mongoose.Schema(
  {
    firstPlayer: {
      type: Player.schema,
    },
    secondPlayer: {
      type: Player.schema,
    },
    matchNumber: {
      type: Number,
      required: true,
    },
    scoreFirstPlayer: {
      type: Number,
      default: 0,
    },
    scoreSecondPlayer: {
      type: Number,
      default: 0,
    },
    pointsToWin: {
      type: Number,
      default: 2,
    },
    winner: {
      type: Player.schema,
    },
    nextMatch: {
      type: mongoose.Schema.ObjectId,
      ref: 'Match',
    },
    nextMatchPosition: {
      type: Number,
      min: 1,
      max: 2,
    },
    previousMatchFirstPlayer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Match',
    },
    previousMatchSecondPlayer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Match',
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        let playHolderPlayer = { username: 'TBD', playerId: '' };
        ret.firstPlayer = ret.firstPlayer ? ret.firstPlayer : playHolderPlayer;
        ret.secondPlayer = ret.secondPlayer ? ret.secondPlayer : playHolderPlayer;
        ret.winner = ret.winner ? ret.winner : '';
        ret.nextMatch = ret.nextMatch ? ret.nextMatch : '';
        delete ret.__v;
      },
    },
    autoCreate: false,
  }
);

matchSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: 'firstPlayer',
      select: '-__v -playerId',
    },
    {
      path: 'secondPlayer',
      select: '-__v -playerId',
    },
    {
      path: 'winner',
      select: '-__v -playerId',
    },
  ]);
  next();
});

module.exports = mongoose.model('Match', matchSchema);
