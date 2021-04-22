'use strict';
const superagent = require('superagent');
let cache = require('./cache.js');

function getWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const queryParams = ({
    key: process.env.WEATHER_API_KEY,
    lang: 'en',
    lat: latitude,
    lon: longitude,
    days: 5,
  });

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit weather');
  } else {
    console.log('Cache miss, making weather request');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = superagent.get(url).query(queryParams)
      .then(response => parseWeather(response.body));
  }

  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.date = day.datetime;
    this.description = day.weather.description;
  }
}

module.exports = getWeather;
