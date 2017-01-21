'use strict';

/**
 * =============================
 *
 * Ctrler for the reoute demandin some auth
 * All methods receive (req:Request,res:Response,next:Middleware)
 *
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods : /
 *		+ renderHomePage()
 *		+ renderLoginPage()

 *
 * Events : /
 * =============================
 */


/**
 * Load modules dependencies.
 */
// Built-in
const _ = require("lodash/core");
const nconf = require('nconf');
const unless = require('express-unless');


// Custom -Mine
const logger = require('../modules/logger');
const Util = require('../modules/util');
const userDAO = require('../models/users');






/**
 * Check if this API call is auth
 *
 */
const isAuth = function(req,res,next){
    // Check if req.headers || req.body contains a api-key
    // If not, check if req.headers || req.body contains a token
    // Otherwise, throw ForbiddenError('You shall not pass ! Auth yourself first')

}
isAuth.unless = unless;



/**
 * Check the token given
 *
 */
const checkToken = function(req,res,next){
    console.log(req.headers);
    if(!_.isEmpty('')) {

    }
    // Check if token && token is mine
    // If ok, next(true)
    // Otherwise, throw ForbiddenError('You shall not pass ! Log in first')
    next();
}



const logIn = function(req,res,next){
    console.log(req.body);
    // { mail: 'Sincere@april.biz',pwd: 'Welcome',confirmPwd: 'Welcome' }
    
    // Validate the input from the req.body
    // Sanitize & clear the input
    // Go fecth the matching user in the DB
    // Generate a token {id,expTime} signed with env['TOKEN_SECRET']
    // Put the user and this token into res.locals
    // Call the next middleware

     return next();
};



const signUp = function(req,res,next){
    console.log(req.body);
    // Validate the input from the req.body
    // Sanitize & clear the input
    // Go fecth the maching user in the DB
    // Generate a token {id,expTime} signed with env['TOKEN_SECRET']
    // Put the user and this token into res.locals
    // Call the next middleware

    return next();
}





/**
 * Exports
 */

// Methods
module.exports = {
      isLogged : checkToken,

    checkToken : checkToken,

     checkAuth : isAuth,

         logMe : logIn,

    registerMe : signUp

};