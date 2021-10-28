const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  setUserInfo, getUserInfo,
} = require('../controllers/users');

const validateEmail = (v) => {
  if (validator.isEmail(v)) {
    return v;
  }
  throw new Error('Произошла ошибка: некорректный email');
};

router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(validateEmail),
  }),
}), setUserInfo);

module.exports = router;
