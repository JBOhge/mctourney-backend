const express = require('express');
const tournamentController = require('./../controllers/tournamentController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', tournamentController.getTournaments);
router.get('/:id', tournamentController.getTournament);

router.use(authController.protectRoute);

router.post('/', tournamentController.createTournament);


router.delete('/:id', tournamentController.canChange, tournamentController.deleteTournament);
router.patch('/:id/update', tournamentController.canChange, tournamentController.changeSize);
router.post('/:id/players', tournamentController.canChange, tournamentController.addPlayer);
router.delete('/:id/players/:playerId', tournamentController.canChange, tournamentController.removePlayer);
router.patch('/:id/generate', tournamentController.canChange, tournamentController.generateTournament);
router.patch('/:id/start', tournamentController.canChange, tournamentController.startTournament);

module.exports = router;
