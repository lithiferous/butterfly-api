'use strict';

const express = require('express');

const router = express.Router();

router.use('/butterflies', require('./butterflies'));
router.use('/scores', require('./scores'));
router.use('/users', require('./users'));

module.exports = router;
