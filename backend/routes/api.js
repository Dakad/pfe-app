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
const nconf = require('nconf');
const router    = require('express').Router();
const jwt = require('express-jwt');

// Custom - Mine
const apiCtrl   = require('../ctrlers/api');
const authCtrl = require('../ctrlers/auth');

// Use authCtrl.checkAuth as middleware && put before all non-GET methods



router.init = function (){


}



/* Default response to /api on every method {GET,POST, PUT, DELETE} */
router.use('/', function(req, res, next) {
  res.json('Where are you going ? Nothing there :-( .');
});


router.all('/zen',apiCtrl.zen);


//router.all('*', oauthCtrl)




/**
 * Exports
 */

// Methods

module.exports = router;
