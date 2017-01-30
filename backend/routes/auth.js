'use strict';

/**
 * =============================
 *
 * Ctrler for the api oAuth for /oauth/*
 * All methods receive (req:Request,res:Response,next:Middleware)
 *
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods : /
 *		+ renderLoginPage()

 *
 * Events : /
 * =============================
 */


/**
 * Load modules dependencies.
 */
// Built-in
const nconf = require('nconf');
const express = require('express');
const cookieParser  = require('cookie-parser')


// Custom -Mine
const Util = require('../modules/util');
const ApiError = require('../modules/api-error');
const authCtrl = require('../ctrlers/auth');
const publicCtrl = require('../ctrlers/public');
const renderCtrl = require('../ctrlers/render');





/**
 * Variables
 *
 */
const router = express.Router();






router.init = function() {};


router.use(authCtrl.retrieveClientInfo);


// Post token.
 // route : POST ..../auth/token
router.post('/token', authCtrl.token);

// Called during the /grant to log the user.
router.route('/grant/user')
    .post([publicCtrl.loginPosted,authCtrl.logMe/*, publicCtrl.afterLoggedForGrant*/])

// Grant acces to this client.
 // route : ..../auth/grant?client_id=***&state=****&redirect_uri=****
router.route('/grant')
    .get(publicCtrl.getClient, authCtrl.isLogged, authCtrl.dialogPage)
    .post(publicCtrl.getClient, authCtrl.isLogged, authCtrl.grant)






// catch 404 and forward to error handler
router.use(authCtrl.errorHandler);




/**
 * Exports
 */

// Methods

module.exports = router;