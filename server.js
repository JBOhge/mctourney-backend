const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }).then(() => {
  console.log('db connection successful');
});

io.on('connection', (socket) => {
  console.log('user connected');
});

const port = process.env.PORT;

http.listen(port, () => {
  console.log('App Started...');
});
