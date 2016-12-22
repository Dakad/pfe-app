'use strict';

/**
 * =============================
 *
 * Route for /api/*
 *
 * =============================
 *
 * Attributes :
 *
 * Routes --> Ctrler :
 *      - /
 *
 *
 * =============================
 */


/**
 * Load modules dependencies.
 */
 // Built-in
const router    = require('express').Router();;

// Custom - Mine
const apiCtrl   = require('../ctrlers/api');



/* Default response to /api on every method {GET,POST, PUT, DELETE} */
router.use('/', function(req, res, next) {
  res.json('Where are you going ? Nothing there :-( .');
});




/**
 * Exports
 */

// Methods

module.exports = router;
