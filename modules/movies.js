'use strict';
const superagent = require('superagent');
let cache = require('./cache.js');

function getMovies(city) {
  const key = city,
    url = 'https://api.themoviedb.org/3/search/movie';
  const queryParams = ({
    api_key: process.env.MOVIE_API_KEY,
    query: city,
    // query: 'Seattle',
  });

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = superagent.get(url).query(queryParams)
      .then(response => parseMovies(response.body));
  }

  return cache[key].data;
}

function parseMovies(movieData) {
  try {
    const movieSummaries = movieData.data.map(movie => {
      return new MovieItem(movie);
    });
    return Promise.resolve(movieSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class MovieItem {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.vote_average = movie.vote_average;
    this.vote_count = movie.vote_count;
    this.poster_path = movie.poster_path;
    this.popularity = movie.popularity;
    this.release_date = movie.release_date;
  }
}

module.exports = getMovies;
