const validator = require('validator');

module.exports.validateEmail = (v) => {
  if (validator.isEmail(v)) {
    return v;
  }
  throw new Error('Произошла ошибка: некорректный email');
};
module.exports.validateUrl = (v) => {
  if (validator.isURL(v)) {
    return v;
  }
  throw new Error('Произошла ошибка: некорректная ссылка');
};
