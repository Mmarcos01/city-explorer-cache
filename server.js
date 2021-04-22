'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const weather = require('./modules/weather.js');
const movies = require('./modules/movies.js');

app.use(cors());
app.get('/weather', weatherHandler);
app.get('/movies', movieHandler);


function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}

function movieHandler(request, response) {
  const { city } = request.query;
  movies(city)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}

app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));


