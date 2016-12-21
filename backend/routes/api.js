'use strict';

const router    = require('express').Router();;
const apiCtrl   = require('../ctrlers/api');


/* Default response to /api on every method {GET,POST, PUT, DELETE} */
router.use('/', function(req, res, next) {
  res.json('Where are you going ? Nothing there :-( .');
});

module.exports = router;
