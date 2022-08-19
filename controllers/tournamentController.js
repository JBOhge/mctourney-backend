const Player = require('../models/playerModel');
const Tournament = require('../models/tournamentModel');
const Match = require('../models/matchModel');
const AppError = require('../utils/appError');
const ca = require('./../utils/catchAsync');
const MatchGenerator = require('../utils/matchGenerator');

exports.getTournaments = ca(async (req, res, next) => {
  const tournaments = await Tournament.find({});
  res.status(200).json({ tournaments });
});

exports.getTournament = ca(async (req, res, next) => {
  const tournament = await Tournament.findOne({ _id: req.params.id });
  if (!tournament) {
    return next(new AppError('A tournament with that id was not found', 404));
  }
  tournament.populate('matches');
  res.status(200).json({ tournament });
});

exports.createTournament = ca(async (req, res, next) => {
  let tournament = await Tournament.create({ size: req.body.size, name: req.body.name });
  res.status(201).json({ tournament });
});

exports.deleteTournament = ca(async (req, res, next) => {
  let tournament = await Tournament.findByIdAndDelete(req.params.id);
  if (!tournament) {
    return next(new AppError('No tournament with that id exists', 404));
  }
  res.status(204).json({ status: 'success' });
});

exports.startTournament = ca(async (req, res, next) => {
  let tournament = await Tournament.findOneAndUpdate({ _id: req.params.id }, { isStarted: true }, { new: true });
  res.status(201).json({ tournament });
});

exports.changeSize = ca(async (req, res, next) => {
  let tournament = req.tournament;
  if (tournament.players.length > req.body.size) {
    return next(new AppError(`There are to many players for a tournament of size ${req.body.size}`, 400));
  }
  tournament.size = req.body.size;
  tournament = await tournament.save({ validateBeforeSave: true });

  res.status(200).json({ tournament });
});

exports.addPlayer = ca(async (req, res, next) => {
  let playerId = await Player.exists({ username: req.body.username });
  if (!playerId) {
    const player = await Player.create({ username: req.body.username, playerId: req.body.playerId });
    playerId = player._id;
  }
  let tournament = await Tournament.findById(req.params.id);
  if (tournament.players.length >= tournament.size) {
    return next(new AppError(`Cannot add any more players, max players: ${tournament.size}`, 400));
  }
  tournament = await Tournament.findOneAndUpdate({ _id: req.params.id }, { $push: { players: playerId } }, { new: true });

  res.status(200).json({ tournament });
});

exports.removePlayer = ca(async (req, res, next) => {
  const tournament = await Tournament.findOneAndUpdate({ _id: req.params.id }, { $pull: { players: req.params.playerId } }, { new: true });
  res.status(200).json({ tournament });
});

exports.canChange = ca(async (req, res, next) => {
  let tournament = await Tournament.findById(req.params.id);
  if (!tournament) {
    return next(new AppError('No tournament with that id exists', 404));
  }
  if (tournament.isStarted) {
    return next(new AppError('cannot change tournament or add/remove players when the tournament is started', 400));
  }
  req.tournament = tournament;
  next();
});

exports.generateTournament = ca(async (req, res, next) => {
  let tournament = req.tournament;
  if (tournament.size > tournament.players.length) {
    return next(new AppError('Not enought playered to generate tournament matches', 400));
  }
  const matches = MatchGenerator.generateMatches(tournament.size, tournament.players, tournament._id);
  tournament.matches = await matches;
  tournament = await tournament.save({ validateBeforeSave: true });
  await tournament.populate({
    path: 'matches',
  });

  res.status(201).json({ tournament });
});
