const Match = require('./../models/matchModel');
const ca = require('./catchAsync');

exports.generateMatches = (size, players, tournamentId) => {
  switch (size) {
    case 4:
      return fourPlayer(players, tournamentId);
    case 8:
      return eightPlayer(players, tournamentId);
    case 16:
      return sixteenPlayer(players, tournamentId);
    case 32:
      return thirtyTwoPlayer(players, tournamentId);
    default:
      return [];
  }
};

const fourPlayer = async (players, tournamentId) => {
  let matches = [];

  let match3 = await Match.create({
    matchNumber: 3,
    tournament: tournamentId,
  });

  let match2 = await Match.create({
    firstPlayer: players[2],
    secondPlayer: players[3],
    matchNumber: 2,
    nextMatch: match3._id,
    nextMatchPosition: 2,
    tournament: tournamentId,
  });

  let match1 = await Match.create({
    firstPlayer: players[0],
    secondPlayer: players[1],
    matchNumber: 1,
    nextMatch: match3._id,
    nextMatchPosition: 1,
    tournament: tournamentId,
  });

  matches.push(match1._id);
  matches.push(match2._id);
  matches.push(match3._id);
  return matches;
};
const eightPlayer = (players) => {};
const sixteenPlayer = (players) => {};
const thirtyTwoPlayer = (players) => {};
