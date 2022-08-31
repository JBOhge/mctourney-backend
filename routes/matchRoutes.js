const express = require('express');
const matchController = require('./../controllers/matchController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/:id', matchController.getMatch);

router.use(authController.protectRoute);

router.put('/:id/increment', matchController.canChange, matchController.incrementMatchScore);
router.put('/:id/decrement', matchController.canChange, matchController.decrementMatchScore);
router.put('/:id/undo', matchController.canChange, matchController.undoWinner);

module.exports = router;
