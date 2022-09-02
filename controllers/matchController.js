const Player = require('../models/playerModel');
const Tournament = require('../models/tournamentModel');
const Match = require('../models/matchModel');
const AppError = require('../utils/appError');
const ca = require('./../utils/catchAsync');

exports.getMatch = ca(async (req, res, next) => {
  const match = await Match.findById(req.params.id);
  if (!match) {
    return next(new AppError('Invalid match id', 404));
  }
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
      tournament = await Tournament.findByIdAndUpdate(match.tournament, { winner: newWinner, isComplete: true }, { new: true }).populate('matches');
    } else if (match.nextMatchPosition === 1) {
      nextMatch = await Match.findByIdAndUpdate(match.nextMatch, { firstPlayer: newWinner }, { new: true });
    } else {
      nextMatch = await Match.findByIdAndUpdate(match.nextMatch, { secondPlayer: newWinner }, { new: true });
    }
  }
  //Save updated match
  match = await match.save();
  await match.populate({ path: 'winner', select: '-__v -playerId' });

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
  if (!tournament.owner._id.equals(req.user._id)) {
    return next(new AppError('You are not the owner of this tournament', 401));
  }

  req.match = match;
  req.tournament = tournament;
  next();
});

exports.undoWinner = ca(async (req, res, next) => {
  let match = req.match;
  if (match.winner) {
    return next(new AppError('cannot undo previous match winner if the current match has already been decided', 400));
  }

  if (!match.previousMatchFirstPlayer && !match.previousMatchSecondPlayer) {
    return next(new AppError('cannot undo previous match winner if the current match has no previous match', 400));
  }

  if (!match.firstPlayer && !match.secondPlayer) {
    return next(new AppError('cannot undo previous match winner if the current match has not players', 400));
  }

  let previousMatch;
  //for undoing firstPlayer
  if (match.firstPlayer && req.body.playerId == match.firstPlayer._id) {
    //reset match.firstPlayer
    match.firstPlayer = undefined;
    match.scoreFirstPlayer = 0;
    match.scoreSecondPlayer = 0;

    previousMatch = await Match.findById(match.previousMatchFirstPlayer);
  }
  //for undoing secondPlayer
  else if (match.secondPlayer && req.body.playerId == match.secondPlayer._id) {
    match.secondPlayer = undefined;
    match.scoreFirstPlayer = 0;
    match.scoreSecondPlayer = 0;

    previousMatch = await Match.findById(match.previousMatchSecondPlayer);
  } else {
    return next(new AppError('Invalid playerId. Cannot undo match winner.', 400));
  }

  //go to previous match and reset the winner and decrease the score of the player who was the winner by one
  if (previousMatch.firstPlayer._id.equals(previousMatch.winner._id)) {
    previousMatch.scoreFirstPlayer -= 1;
  } else if (previousMatch.secondPlayer._id.equals(previousMatch.winner._id)) {
    previousMatch.scoreSecondPlayer -= 1;
  }
  previousMatch.winner = undefined;
  match = await match.save();
  previousMatch = await previousMatch.save();

  res.status(200).json({ match, previousMatch });
});
