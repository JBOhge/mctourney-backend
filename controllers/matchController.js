const Player = require('../models/playerModel');
const Tournament = require('../models/tournamentModel');
const Match = require('../models/matchModel');
const AppError = require('../utils/appError');
const ca = require('./../utils/catchAsync');

exports.getMatch = ca(async (req, res, next) => {
  const match = await Match.findById(req.params.id);
  return res.status(200).json({ match });
});

exports.incrementMatchScore = ca(async (req, res, next) => {
  let match = req.match;

  //Check if there is already a winner for this match
  if (match.winner) {
    return next(new AppError('Cannot increment match score if there is already a winner', 400));
  }

  //Check to see if there is a first player and second player
  if (!match.firstPlayer || !match.secondPlayer) {
    return next(new AppError('Cannot change the score of a match that does not have two players', 400));
  }

  //Incrementing score for the correct player
  if (req.body.playerId == match.firstPlayer._id) {
    match.scoreFirstPlayer++;
  } else if (req.body.playerId == match.secondPlayer._id) {
    match.scoreSecondPlayer++;
  } else {
    return next(new AppError('Invalid playerId. Cannot increment match score.', 400));
  }

  //checking for a winner
  let newWinner;
  //if first player is the winner
  if (match.scoreFirstPlayer === match.pointsToWin) {
    newWinner = match.firstPlayer._id;
  }
  //if second player is the winner
  else if (match.scoreSecondPlayer === match.pointsToWin) {
    newWinner = match.secondPlayer._id;
  }

  let nextMatch;
  let tournament;
  //Process winner, put winning player in next match
  if (newWinner) {
    match.winner = newWinner;
    if (!match.nextMatch) {
      //update tournament winner
      tournament = await Tournament.findByIdAndUpdate(match.tournament, { winner: newWinner, isComplete: true }, { new: true });
    } else if (match.nextMatchPosition === 1) {
      nextMatch = await Match.findByIdAndUpdate(match.nextMatch, { firstPlayer: newWinner }, { new: true });
    } else {
      nextMatch = await Match.findByIdAndUpdate(match.nextMatch, { secondPlayer: newWinner }, { new: true });
    }
  }
  //Save updated match
  match = await match.save();

  return res.status(200).json({ match: match, nextMatch: nextMatch, tournament: tournament });
});

exports.decrementMatchScore = ca(async (req, res, next) => {
  let match = req.match;
  if (match.winner) {
    next(new AppError('cannot decrement match score if the winner has already been decided'));
  }

  if (req.body.playerId == match.firstPlayer._id) {
    match.scoreFirstPlayer = Math.max(match.scoreFirstPlayer - 1, 0);
  } else if (req.body.playerId == match.secondPlayer._id) {
    match.scoreSecondPlayer = Math.max(match.scoreSecondPlayer - 1, 0);
  } else {
    return next(new AppError('Invalid playerId. Cannot increment match score.', 400));
  }

  match = await match.save();

  res.status(200).json({ match });
});

exports.canChange = ca(async (req, res, next) => {
  let match = await Match.findById(req.params.id);
  if (!match) {
    return next(new AppError('Invalid match id', 400));
  }
  let tournament = await Tournament.findById(match.tournament);
  if (!tournament.isStarted) {
    return next(new AppError('cannot update matches until tournament is started', 400));
  }
  req.match = match;
  req.tournament = tournament;
  next();
});
