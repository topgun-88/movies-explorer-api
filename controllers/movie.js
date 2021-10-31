const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Forbidden = require('../errors/forbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Произошла ошибка: переданы некорректные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Произошла ошибка: фильм не найден'))
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        movie.remove()
          .then(() => res.send(movie))
          .catch(next);
      } else {
        throw new Forbidden('Произошла ошибка: нет прав для удаления фильма');
      }
      return res;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Произошла ошибка: переданы некорректные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};
