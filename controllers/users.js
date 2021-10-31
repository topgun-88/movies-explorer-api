const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Conflict = require('../errors/conflict');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name, email: req.body.email, password: hash,
    })
      .then(({ name, email }) => res.status(200).send({
        name, email,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequest('Произошла ошибка: переданы некорректные данные');
        } else if (err.name === 'MongoServerError') {
          throw new Conflict('Произошла ошибка: email уже занят');
        } else {
          next(err);
        }
      })
      .catch(next))
    .catch(next);
};

module.exports.setUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Произошла ошибка: пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequest('Произошла ошибка: переданы некорректные данные');
      } else if (err.name === 'MongoServerError') {
        throw new Conflict('Произошла ошибка: email уже занят');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Произошла ошибка: пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};
