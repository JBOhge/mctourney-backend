const express = require('express');
const tournamentController = require('./../controllers/tournamentController');

const router = express.Router();

router.get('/', tournamentController.getTournaments);
router.get('/:id', tournamentController.getTournament);

router.post('/', tournamentController.createTournament);
router.delete('/:id', tournamentController.deleteTournament);

router.patch('/:id/update', tournamentController.canChange, tournamentController.changeSize);

router.post('/:id/players', tournamentController.canChange, tournamentController.addPlayer);
router.delete('/:id/players/:playerId', tournamentController.canChange, tournamentController.removePlayer);

router.patch('/:id/generate', tournamentController.canChange, tournamentController.generateTournament);

router.patch('/:id/start', tournamentController.startTournament);

module.exports = router;
