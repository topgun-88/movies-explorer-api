const mongoose = require('mongoose');
const { validateUrl } = require('../validators/myValidators');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: validateUrl,
      message: 'Введите URL',
    },
    required: true,
  },
  trailer: {
    type: String,
    validate: {
      validator: validateUrl,
      message: 'Введите URL',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: validateUrl,
      message: 'Введите URL',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
