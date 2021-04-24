'use strict';
const superagent = require('superagent');
const cache = require('./movie-cache.js');

function getMovies(request, response) {
  const key = request.query.city;
  if (cache[key] && (Date.now() - cache[key] [0]) < (1000*60*60*24*10)) {
    console.log('Cache hit movie');
    let prevResp = cache[key][1];
    response.status(200).send(prevResp);
  } else {
    console.log('Cache miss, making movie request');
    const url = `https://api.themoviedb.org/3/search/movie`;
    const query = {
      api_key: process.env.MOVIE_API_KEY,
      query: key,
    };

    superagent
      .get(url)
      .query(query)
      .then(res => {
        const movieArr = res.body.results.map(movie => new MovieItem(movie));
        cache[key] = [Date.now(), movieArr];
        response.status(200).send(movieArr);
      })
      .catch(err => {
        console.err('error', err);
        response.status(500).send('error', err);
      });
  }
}

function MovieItem(movie) {
  this.title = movie.title;
  this.overview = movie.overview;
  this.vote_average = movie.vote_average;
  this.vote_count = movie.vote_count;
  this.poster_path = movie.poster_path;
  this.popularity = movie.popularity;
  this.release_date = movie.release_date;
}

module.exports = getMovies;
