const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateEmail } = require('../validators/myValidators');
const {
  setUserInfo, getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(validateEmail),
  }),
}), setUserInfo);

module.exports = router;
