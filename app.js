require('dotenv').config();
var express = require('express');
var morgan = require('morgan');
var POKEDEX = require('./pokedex.json');
var app = express();
var cors = require('cors');
var helmet = require('helmet');

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());
app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  if (!authToken || authToken.split(' ')[1] != apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

var validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychic`,
  `Rock`,
  `Steel`,
  `Water`,
];
function handleGetTypes(req, res) {
  res.json(validTypes);
}

app.get('/types', handleGetTypes);

function handleGetPokemon(req, res) {
  var result = POKEDEX.pokemon;
  const { name, type } = req.query;
  if (name) {
    result = result.filter(
      poke => poke.name.toLowerCase() == name.toLowerCase()
    );
  }
  if (type) {
    if (!validTypes.map(t => t.toLowerCase()).includes(type.toLowerCase())) {
      return res.status(401).send('invalid type');
    }
    result = result.filter(poke =>
      poke.type.map(n => n.toLowerCase()).includes(type.toLowerCase())
    );
  }
  res.json(result);
}

app.get('/pokemon', handleGetPokemon);

module.exports = app;
