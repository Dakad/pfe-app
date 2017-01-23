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
const nconf = require('nconf');
const _ = require("lodash/core");
const unless = require('express-unless');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


// Custom -Mine
const logger = require('../modules/logger');
const Util = require('../modules/util');
const ApiError = require('../modules/api-error');
const DB = require('../models');






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
//    console.log(req.headers);
    if(!_.isEmpty('')) {

    }
    // Check if token && token is mine
    // If ok, next(true)
    // Otherwise, throw ForbiddenError('You shall not pass ! Log in first')
    next();
}



const logIn = function(req,res,next){
    const user = req.body;
    // Validate the input from the user
    Util.valideInput(user).then(function(){
        // Sanitize & clear the input
        req.sanitizeBody('email').normalizeEmail();
        // Go fecth the corresponding user in DB
        return DB.Users
            .find({
                attributes : ["email", "name", "salt", "pwd", "isAdmin", "avatar"],
                where: { email : user.email}
            });
    }).then(function(dbUser){
        if (!dbUser)
            return Promise.reject(new ApiError(404, 'The user with '+ user.email +' is not registred'));

        // Check if the input pwd is the correct
        req.user = dbUser.dataValues;
        return Util.validPassword(user.pwd, dbUser.dataValues.salt, dbUser.dataValues.pwd);
    }).then(function(isValidPwd) {
        // Generate a token {id,expTime} signed with env['TOKEN_SECRET']
        if(isValidPwd)
            return Util.generateToken({
                name:req.user.name,
                email:req.user.email,
                isAdmin : req.user.isAdmin
            },nconf.get('TOKEN_SECRET'));
        return Promise.reject(new ApiError(401, 'Unknown user'));
    }).then(function(token) {// Call the next middleware
        req.user.token = token;
        next();
    }).catch(function (err){
        if(!err instanceof ApiError)
            err = new ApiError(err);
        next(err);
    });
};



const signUp = function(req,res,next){
    let user;

    // Validate the input from the req.body
    Util.valideInput(req.body).then(function(){
        // Sanitize & clear the input
        req.sanitizeBody();
        req.sanitizeBody('email').normalizeEmail();

        return user = req.body;
    }).then(function(nUser){
        // Go Fetch a possible registred user with the same email.
        return DB.Users.findOne({
            attributes : ["email", "pwd"],
            where: {email: nUser.email}
        });
    }).then(function(dbUser) {
        if(dbUser)
            return Promise.reject( new ApiError(400,dbUser.email + ' is already taken. Choose another one'));
        return DB.Users.create(user);
    }).then(function() {
        next();
    }).catch(function(err){
        next(err);
    });
};





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