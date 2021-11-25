const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000, DB = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(DB, {
  useNewUrlParser: true,
}).then(() => console.log('db succes'))
  .catch((err) => console.log('db not succes ', err.message));

app.use(requestLogger);

app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  next(new NotFoundError('Произошла ошибка: запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? '500 На сервере произошла ошибка.'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
