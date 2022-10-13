const Tournament = require('./../models/tournamentModel');
const Match = require('./../models/matchModel');
const ca = require('./catchAsync');

exports.generateMatches = (tournament) => {
  let { size, players, matchPointsToWin, finalMatchPointsToWin } = tournament;
  let tournamentId = tournament._id;
  let playerList = [...players];
  playerList = shuffle(playerList);

  switch (size) {
    case 4:
      return fourPlayer(tournament, playerList, matchPointsToWin, finalMatchPointsToWin);
    case 8:
      return eightPlayer(tournament, playerList, matchPointsToWin, finalMatchPointsToWin);
    case 16:
      return sixteenPlayer(tournament, playerList, matchPointsToWin, finalMatchPointsToWin);
    case 32:
      return thirtyTwoPlayer(tournament, playerList, matchPointsToWin, finalMatchPointsToWin);
    default:
      return [];
  }
};

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const fourPlayer = (tournament, players, matchPointsToWin, finalMatchPointsToWin) => {
  let match3 = new Match({
    matchNumber: 3,
    pointsToWin: finalMatchPointsToWin,
  });

  let match2 = new Match({
    firstPlayer: players[2],
    secondPlayer: players[3],
    matchNumber: 2,
    nextMatch: match3._id,
    nextMatchPosition: 2,
    pointsToWin: matchPointsToWin,
  });
  let match1 = new Match({
    firstPlayer: players[0],
    secondPlayer: players[1],
    matchNumber: 1,
    nextMatch: match3._id,
    nextMatchPosition: 1,
    pointsToWin: matchPointsToWin,
  });

  match3.previousMatchFirstPlayer = match1._id;
  match3.previousMatchSecondPlayer = match2._id;

  let matches = [];
  matches.push(match1);
  matches.push(match2);
  matches.push(match3);
  return matches;
};

const eightPlayer = (tournament, players, matchPointsToWin, finalMatchPointsToWin) => {
  let match7 = new Match({
    matchNumber: 7,
    pointsToWin: finalMatchPointsToWin,
  });
  let match6 = new Match({
    matchNumber: 6,
    nextMatch: match7._id,
    nextMatchPosition: 2,
    pointsToWin: matchPointsToWin,
  });
  let match5 = new Match({
    matchNumber: 5,
    nextMatch: match7._id,
    nextMatchPosition: 1,
    pointsToWin: matchPointsToWin,
  });

  match7.previousMatchFirstPlayer = match5._id;
  match7.previousMatchSecondPlayer = match6._id;

  let match4 = new Match({
    matchNumber: 4,
    nextMatch: match6._id,
    nextMatchPosition: 2,
    firstPlayer: players[6],
    secondPlayer: players[7],
    pointsToWin: matchPointsToWin,
  });
  let match3 = new Match({
    matchNumber: 3,
    nextMatch: match6._id,
    nextMatchPosition: 1,
    firstPlayer: players[4],
    secondPlayer: players[5],
    pointsToWin: matchPointsToWin,
  });

  match6.previousMatchFirstPlayer = match3._id;
  match6.previousMatchSecondPlayer = match4._id;

  let match2 = new Match({
    matchNumber: 2,
    nextMatch: match5._id,
    nextMatchPosition: 2,
    firstPlayer: players[2],
    secondPlayer: players[3],
    pointsToWin: matchPointsToWin,
  });
  let match1 = new Match({
    matchNumber: 1,
    nextMatch: match5._id,
    nextMatchPosition: 1,
    firstPlayer: players[0],
    secondPlayer: players[1],
    pointsToWin: matchPointsToWin,
  });

  match5.previousMatchFirstPlayer = match1._id;
  match5.previousMatchSecondPlayer = match2._id;

  let matches = [];
  matches.push(match1);
  matches.push(match2);
  matches.push(match3);
  matches.push(match4);
  matches.push(match5);
  matches.push(match6);
  matches.push(match7);
  return matches;
};
const sixteenPlayer = (tournament, players, matchPointsToWin, finalMatchPointsToWin) => {
  let match15 = new Match({
    matchNumber: 15,
    pointsToWin: finalMatchPointsToWin,
  });
  let match14 = new Match({
    matchNumber: 14,
    nextMatch: match15._id,
    nextMatchPosition: 2,
    pointsToWin: matchPointsToWin,
  });
  let match13 = new Match({
    matchNumber: 13,
    nextMatch: match15._id,
    nextMatchPosition: 1,
    pointsToWin: matchPointsToWin,
  });

  match15.previousMatchFirstPlayer = match13._id;
  match15.previousMatchSecondPlayer = match14._id;

  let match12 = new Match({
    matchNumber: 12,
    nextMatch: match14._id,
    nextMatchPosition: 2,
    pointsToWin: matchPointsToWin,
  });
  let match11 = new Match({
    matchNumber: 11,
    nextMatch: match14._id,
    nextMatchPosition: 1,
    pointsToWin: matchPointsToWin,
  });

  match14.previousMatchFirstPlayer = match11._id;
  match14.previousMatchSecondPlayer = match12._id;

  let match10 = new Match({
    matchNumber: 10,
    nextMatch: match13._id,
    nextMatchPosition: 2,
    pointsToWin: matchPointsToWin,
  });
  let match9 = new Match({
    matchNumber: 9,
    nextMatch: match13._id,
    nextMatchPosition: 1,
    pointsToWin: matchPointsToWin,
  });

  match13.previousMatchFirstPlayer = match9._id;
  match13.previousMatchSecondPlayer = match10._id;

  let match8 = new Match({
    matchNumber: 8,
    nextMatch: match12._id,
    nextMatchPosition: 2,
    firstPlayer: players[14],
    secondPlayer: players[15],
    pointsToWin: matchPointsToWin,
  });
  let match7 = new Match({
    matchNumber: 7,
    nextMatch: match12._id,
    nextMatchPosition: 1,
    firstPlayer: players[12],
    secondPlayer: players[13],
    pointsToWin: matchPointsToWin,
  });

  match12.previousMatchFirstPlayer = match7._id;
  match12.previousMatchSecondPlayer = match8._id;

  let match6 = new Match({
    matchNumber: 6,
    nextMatch: match11._id,
    nextMatchPosition: 2,
    firstPlayer: players[10],
    secondPlayer: players[11],
    pointsToWin: matchPointsToWin,
  });
  let match5 = new Match({
    matchNumber: 5,
    nextMatch: match11._id,
    nextMatchPosition: 1,
    firstPlayer: players[8],
    secondPlayer: players[9],
    pointsToWin: matchPointsToWin,
  });

  match11.previousMatchFirstPlayer = match6._id;
  match11.previousMatchSecondPlayer = match5._id;

  let match4 = new Match({
    matchNumber: 4,
    nextMatch: match10._id,
    nextMatchPosition: 2,
    firstPlayer: players[6],
    secondPlayer: players[7],
    pointsToWin: matchPointsToWin,
  });
  let match3 = new Match({
    matchNumber: 3,
    nextMatch: match10._id,
    nextMatchPosition: 1,
    firstPlayer: players[4],
    secondPlayer: players[5],
    pointsToWin: matchPointsToWin,
  });

  match10.previousMatchFirstPlayer = match3._id;
  match10.previousMatchSecondPlayer = match4._id;

  let match2 = new Match({
    matchNumber: 2,
    nextMatch: match9._id,
    nextMatchPosition: 2,
    firstPlayer: players[2],
    secondPlayer: players[3],
    pointsToWin: matchPointsToWin,
  });
  let match1 = new Match({
    matchNumber: 1,
    nextMatch: match9._id,
    nextMatchPosition: 1,
    firstPlayer: players[0],
    secondPlayer: players[1],
    pointsToWin: matchPointsToWin,
  });

  match9.previousMatchFirstPlayer = match1._id;
  match9.previousMatchSecondPlayer = match2._id;

  let matches = [];
  matches.push(match1);
  matches.push(match2);
  matches.push(match3);
  matches.push(match4);
  matches.push(match5);
  matches.push(match6);
  matches.push(match7);
  matches.push(match8);
  matches.push(match9);
  matches.push(match10);
  matches.push(match11);
  matches.push(match12);
  matches.push(match13);
  matches.push(match14);
  matches.push(match15);
  return matches;
};
const thirtyTwoPlayer = (tournament, players, matchPointsToWin, finalMatchPointsToWin) => {
  let match31 = new Match({
    matchNumber: 31,
    tournament: tournamentId,
  });
};
