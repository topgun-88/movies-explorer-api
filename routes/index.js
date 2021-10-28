const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/movies', require('./movie'));

module.exports = router;
