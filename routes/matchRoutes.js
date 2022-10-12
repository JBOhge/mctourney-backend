const express = require('express');
const matchController = require('./../controllers/matchController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.get('/:matchId', matchController.getMatch);

router.use(authController.protectRoute);

router.put('/:tournamentId/:matchId/increment', matchController.canChange, matchController.incrementMatchScore);
router.put('/:tournamentId/:matchId/decrement', matchController.canChange, matchController.decrementMatchScore);
router.put('/:tournamentId/:matchId/undo', matchController.canChange, matchController.undoWinner);

module.exports = router;
