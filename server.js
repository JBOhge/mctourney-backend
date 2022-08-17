const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }).then(() => {
  console.log('db connection successful');
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log('App Started...');
});
