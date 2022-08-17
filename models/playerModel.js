const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'players require a username'],
  },
  playerId: {
    type: String,
  }
});


module.exports = mongoose.model('Player', playerSchema);
