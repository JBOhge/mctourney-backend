const Player = require('../models/playerModel');
const Tournament = require('../models/tournamentModel');
const AppError = require('../utils/appError');
const ca = require('./../utils/catchAsync');
const MatchGenerator = require('../utils/matchGenerator');

exports.getTournaments = ca(async (req, res, next) => {
  const tournaments = await Tournament.find({ isPublic: { $ne: false } }).select('-matches');
  res.status(200).json({ tournaments });
});

exports.getTournament = ca(async (req, res, next) => {
  const tournament = await Tournament.findOne({ _id: req.params.id });
  if (!tournament) {
    return next(new AppError('A tournament with that id was not found', 404));
  }
  await tournament.populate('matches');
  res.status(200).json({ tournament });
});

exports.myTournaments = ca(async (req, res, next) => {
  const tournaments = await Tournament.find({ owner: req.user._id });

  res.status(200).json({ tournaments });
});

exports.createTournament = ca(async (req, res, next) => {
  let tournament = await Tournament.create({
    size: req.body.size,
    name: req.body.name,
    owner: req.user._id,
    matchPointsToWin: req.body.matchPointsToWin,
    finalMatchPointsToWin: req.body.finalMatchPointsToWin,
    isPublic: req.body.isPublic,
  });
  res.status(201).json({ tournament });
});

exports.deleteTournament = ca(async (req, res, next) => {
  let tournament = await Tournament.findById(req.params.id);
  await tournament.remove();
  if (!tournament) {
    return next(new AppError('No tournament with that id exists', 404));
  }
  res.status(204).json({ status: 'success' });
});

exports.startTournament = ca(async (req, res, next) => {
  let tournament = await Tournament.findOne({ _id: req.params.id });
  if (tournament.matches.length == 0) {
    return next(new AppError('Cannot start a tournament with no matches. Please generate matches before starting.'));
  }
  tournament.isStarted = true;
  tournament = await tournament.save();
  res.status(201).json({ tournament });
});

exports.changeSize = ca(async (req, res, next) => {
  let tournament = req.tournament;
  if (tournament.players.length > req.body.size) {
    return next(new AppError(`There are to many players for a tournament of size ${req.body.size}`, 400));
  }
  tournament.size = req.body.size;

  //remove old matches associated with this tournament
  tournament.matches = [];
  tournament = await tournament.save({ validateBeforeSave: true });

  res.status(200).json({ tournament });
});

exports.addPlayer = ca(async (req, res, next) => {
  let tournament = req.tournament;
  if (tournament.players.length >= tournament.size) {
    return next(new AppError(`Cannot add any more players, max players: ${tournament.size}`, 400));
  }
  const player = new Player({ username: req.body.username, playerId: req.body.playerId });
  tournament = await Tournament.findOneAndUpdate({ _id: req.params.id }, { $push: { players: player } }, { new: true });

  res.status(200).json({ tournament });
});

exports.removePlayer = ca(async (req, res, next) => {
  const tournament = req.tournament;
  tournament.players.pull(req.params.playerId);
  tournament.matches = [];
  await tournament.save();
  res.status(200).json({ tournament });
});

exports.canChange = ca(async (req, res, next) => {
  let tournament = await Tournament.findById(req.params.id);
  if (!tournament) {
    return next(new AppError('No tournament with that id exists', 404));
  }
  if (!tournament.owner._id.equals(req.user._id)) {
    return next(new AppError('You are not the owner of this tournament', 401));
  }
  if (tournament.isStarted) {
    return next(new AppError('Cannot change tournament or add/remove players after a tournament is started', 400));
  }

  req.tournament = tournament;
  next();
});

exports.generateTournament = ca(async (req, res, next) => {
  let tournament = req.tournament;
  if (tournament.size > tournament.players.length) {
    return next(new AppError('Not enought playered to generate tournament matches. Please add more players or change the tournament size.', 400));
  }
  await tournament.populate([
    {
      path: 'players',
      select: '-__v -playerId',
    },
  ]);
  const matches = MatchGenerator.generateMatches(tournament);
  tournament.matches = matches;
  tournament = await tournament.save({ validateBeforeSave: true });

  res.status(201).json({ tournament });
});
