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
const express = require('express');
const router = express.Router();


// Custom -Mine
const Util = require('../modules/util');
const ApiError = require('../modules/api-error');
const authCtrl = require('../ctrlers/auth');





router.init = function (){


}







/**
 * Exports
 */

// Methods

module.exports = router;