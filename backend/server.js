//ExpressJS router
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/router');
const app = express();

// configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.set('views', path.join(__dirname, '../client/build')); 
app.use(express.static(path.join(__dirname, '../client/build'))); 

// set the port
const port = process.env.PORT || 3001;

// start the server
app.listen(port, () => {
  console.log(`App Server Listening at ${port}`);
});

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/')
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err));


app.set('view engine', 'ejs');

router.get('/', (req, res, next) => {
  res.render('index.html');
});

app.use('/api', router);

// catch 404
app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Page does not exist</h2>');
});
