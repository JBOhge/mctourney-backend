const Match = require('./../models/matchModel');
const ca = require('./catchAsync');

exports.generateMatches = (size, players, tournamentId, matchPointsToWin, finalMatchPointsToWin) => {
  let playerList = [...players];
  playerList = shuffle(playerList);

  switch (size) {
    case 4:
      return fourPlayer(playerList, tournamentId, matchPointsToWin, finalMatchPointsToWin);
    case 8:
      return eightPlayer(playerList, tournamentId, matchPointsToWin, finalMatchPointsToWin);
    case 16:
      return sixteenPlayer(playerList, tournamentId, matchPointsToWin, finalMatchPointsToWin);
    case 32:
      return thirtyTwoPlayer(playerList, tournamentId, matchPointsToWin, finalMatchPointsToWin);
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

const fourPlayer = async (players, tournamentId, matchPointsToWin, finalMatchPointsToWin) => {
  let match3 = await Match.create({
    matchNumber: 3,
    tournament: tournamentId,
    pointsToWin: finalMatchPointsToWin,
  });

  let match2 = await Match.create({
    firstPlayer: players[2],
    secondPlayer: players[3],
    matchNumber: 2,
    nextMatch: match3._id,
    nextMatchPosition: 2,
    tournament: tournamentId,
    pointsToWin: matchPointsToWin,
  });

  let match1 = await Match.create({
    firstPlayer: players[0],
    secondPlayer: players[1],
    matchNumber: 1,
    nextMatch: match3._id,
    nextMatchPosition: 1,
    tournament: tournamentId,
    pointsToWin: matchPointsToWin,
  });

  match3.previousMatchFirstPlayer = match1._id;
  match3.previousMatchSecondPlayer = match2._id;
  await match3.save();

  let matches = [];
  matches.push(match1._id);
  matches.push(match2._id);
  matches.push(match3._id);
  return matches;
};
const eightPlayer = async (players, tournamentId, matchPointsToWin, finalMatchPointsToWin) => {
  let match7 = await Match.create({
    matchNumber: 7,
    tournament: tournamentId,
    pointsToWin: finalMatchPointsToWin,
  });
  let match6 = await Match.create({
    matchNumber: 6,
    tournament: tournamentId,
    nextMatch: match7._id,
    nextMatchPosition: 2,
    pointsToWin: matchPointsToWin,
  });
  let match5 = await Match.create({
    matchNumber: 5,
    tournament: tournamentId,
    nextMatch: match7._id,
    nextMatchPosition: 1,
    pointsToWin: matchPointsToWin,
  });

  match7.previousMatchFirstPlayer = match5._id;
  match7.previousMatchSecondPlayer = match6._id;
  await match7.save();

  let match4 = await Match.create({
    matchNumber: 4,
    tournament: tournamentId,
    nextMatch: match6._id,
    nextMatchPosition: 2,
    firstPlayer: players[6],
    secondPlayer: players[7],
    pointsToWin: matchPointsToWin,
  });
  let match3 = await Match.create({
    matchNumber: 3,
    tournament: tournamentId,
    nextMatch: match6._id,
    nextMatchPosition: 1,
    firstPlayer: players[4],
    secondPlayer: players[5],
    pointsToWin: matchPointsToWin,
  });

  match6.previousMatchFirstPlayer = match3._id;
  match6.previousMatchSecondPlayer = match4._id;
  await match6.save();

  let match2 = await Match.create({
    matchNumber: 2,
    tournament: tournamentId,
    nextMatch: match5._id,
    nextMatchPosition: 2,
    firstPlayer: players[2],
    secondPlayer: players[3],
    pointsToWin: matchPointsToWin,
  });
  let match1 = await Match.create({
    matchNumber: 1,
    tournament: tournamentId,
    nextMatch: match5._id,
    nextMatchPosition: 1,
    firstPlayer: players[0],
    secondPlayer: players[1],
    pointsToWin: matchPointsToWin,
  });

  match5.previousMatchFirstPlayer = match1._id;
  match5.previousMatchSecondPlayer = match2._id;
  await match5.save();

  let matches = [];
  matches.push(match1._id);
  matches.push(match2._id);
  matches.push(match3._id);
  matches.push(match4._id);
  matches.push(match5._id);
  matches.push(match6._id);
  matches.push(match7._id);
  return matches;
};
const sixteenPlayer = async (players, tournamentId, matchPointsToWin, finalMatchPointsToWin) => {
  let match15 = await Match.create({
    matchNumber: 15,
    tournament: tournamentId,
    pointsToWin: finalMatchPointsToWin,
  });
  let match14 = await Match.create({
    matchNumber: 14,
    tournament: tournamentId,
    nextMatch: match15._id,
    nextMatchPosition: 2,
    pointsToWin: matchPointsToWin,
  });
  let match13 = await Match.create({
    matchNumber: 13,
    tournament: tournamentId,
    nextMatch: match15._id,
    nextMatchPosition: 1,
    pointsToWin: matchPointsToWin,
  });

  match15.previousMatchFirstPlayer = match13._id;
  match15.previousMatchSecondPlayer = match14._id;
  await match15.save();

  let match12 = await Match.create({
    matchNumber: 12,
    tournament: tournamentId,
    nextMatch: match14._id,
    nextMatchPosition: 2,
    pointsToWin: matchPointsToWin,
  });
  let match11 = await Match.create({
    matchNumber: 11,
    tournament: tournamentId,
    nextMatch: match14._id,
    nextMatchPosition: 1,
    pointsToWin: matchPointsToWin,
  });

  match14.previousMatchFirstPlayer = match11._id;
  match14.previousMatchSecondPlayer = match12._id;
  await match14.save();

  let match10 = await Match.create({
    matchNumber: 10,
    tournament: tournamentId,
    nextMatch: match13._id,
    nextMatchPosition: 2,
    pointsToWin: matchPointsToWin,
  });
  let match9 = await Match.create({
    matchNumber: 9,
    tournament: tournamentId,
    nextMatch: match13._id,
    nextMatchPosition: 1,
    pointsToWin: matchPointsToWin,
  });

  match13.previousMatchFirstPlayer = match9._id;
  match13.previousMatchSecondPlayer = match10._id;
  await match13.save();

  let match8 = await Match.create({
    matchNumber: 8,
    tournament: tournamentId,
    nextMatch: match12._id,
    nextMatchPosition: 2,
    firstPlayer: players[14],
    secondPlayer: players[15],
    pointsToWin: matchPointsToWin,
  });
  let match7 = await Match.create({
    matchNumber: 7,
    tournament: tournamentId,
    nextMatch: match12._id,
    nextMatchPosition: 1,
    firstPlayer: players[12],
    secondPlayer: players[13],
    pointsToWin: matchPointsToWin,
  });

  match12.previousMatchFirstPlayer = match7._id;
  match12.previousMatchSecondPlayer = match8._id;
  await match12.save();

  let match6 = await Match.create({
    matchNumber: 6,
    tournament: tournamentId,
    nextMatch: match11._id,
    nextMatchPosition: 2,
    firstPlayer: players[10],
    secondPlayer: players[11],
    pointsToWin: matchPointsToWin,
  });
  let match5 = await Match.create({
    matchNumber: 5,
    tournament: tournamentId,
    nextMatch: match11._id,
    nextMatchPosition: 1,
    firstPlayer: players[8],
    secondPlayer: players[9],
    pointsToWin: matchPointsToWin,
  });

  match11.previousMatchFirstPlayer = match6._id;
  match11.previousMatchSecondPlayer = match5._id;
  await match11.save();

  let match4 = await Match.create({
    matchNumber: 4,
    tournament: tournamentId,
    nextMatch: match10._id,
    nextMatchPosition: 2,
    firstPlayer: players[6],
    secondPlayer: players[7],
    pointsToWin: matchPointsToWin,
  });
  let match3 = await Match.create({
    matchNumber: 3,
    tournament: tournamentId,
    nextMatch: match10._id,
    nextMatchPosition: 1,
    firstPlayer: players[4],
    secondPlayer: players[5],
    pointsToWin: matchPointsToWin,
  });

  match10.previousMatchFirstPlayer = match3._id;
  match10.previousMatchSecondPlayer = match4._id;
  await match10.save();

  let match2 = await Match.create({
    matchNumber: 2,
    tournament: tournamentId,
    nextMatch: match9._id,
    nextMatchPosition: 2,
    firstPlayer: players[2],
    secondPlayer: players[3],
    pointsToWin: matchPointsToWin,
  });
  let match1 = await Match.create({
    matchNumber: 1,
    tournament: tournamentId,
    nextMatch: match9._id,
    nextMatchPosition: 1,
    firstPlayer: players[0],
    secondPlayer: players[1],
    pointsToWin: matchPointsToWin,
  });

  match9.previousMatchFirstPlayer = match1._id;
  match9.previousMatchSecondPlayer = match2._id;
  await match9.save();

  let matches = [];
  matches.push(match1._id);
  matches.push(match2._id);
  matches.push(match3._id);
  matches.push(match4._id);
  matches.push(match5._id);
  matches.push(match6._id);
  matches.push(match7._id);
  matches.push(match8._id);
  matches.push(match9._id);
  matches.push(match10._id);
  matches.push(match11._id);
  matches.push(match12._id);
  matches.push(match13._id);
  matches.push(match14._id);
  matches.push(match15._id);
  return matches;
};
const thirtyTwoPlayer = async (players, tournamentId, matchPointsToWin, finalMatchPointsToWin) => {
  let match31 = await Match.create({
    matchNumber: 31,
    tournament: tournamentId,
  });
};
