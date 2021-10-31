const router = require('express').Router();
const auth = require('../middlewares/auth');

router.use('/', require('./sign'));

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movie'));

module.exports = router;
