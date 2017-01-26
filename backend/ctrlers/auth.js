'use strict';

/**
 * =============================
 *
 * Ctrler for the route demanding some authentication
 * All methods receive (req:Request,res:Response,next:Middleware)
 *
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods : /
 *		+ isAuth()
 *		+ checkToken()
 *		+ logIn()
 *		+ signUp()

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
    const cookies = req.signedCookies;
    // If not, check if req.headers || req.body contains a token
    // Otherwise, throw ForbiddenError('You shall not pass ! Auth yourself first')
    if(!(cookies.isAuth && cookies.accessToken))
        return next(new ApiError.Unauthorized('You shall not pass ! Log in before to access this page !'));
    Util.validToken(cookies.accessToken).then(function(decodedToken){
        req.user = decodedToken;
        res.locals.isAuth = true;
        next();
    }).catch(function (err) {
        res.locals.isAuth = false;
        console.error(err);
    })

}
isAuth.unless = unless;

const logIn = function(req,res,next){
    const user = req.body;
    // Validate the input from the user
    Util.valideInput(user).then(function(){
        // Sanitize & clear the input
        req.sanitizeBody('email').normalizeEmail();
        // Go fecth the corresponding user in DB
        return DB.Users.findOne({
            attributes : ["id", "email", "name", "salt", "pwd", "isAdmin", "avatar"],
            where: { email : user.email}
        });
    }).then(function(dbUser){
    if (!dbUser)
            return Promise.reject(new ApiError(404, 'The user with '+ user.email +' is not registred'));
        return [dbUser, Util.validPassword(user.pwd, dbUser.dataValues.salt, dbUser.dataValues.pwd)];
    }).then(function(datas) {
        const dbUser = datas[0], isValidPwd = datas[1];
        if(!isValidPwd)
            return Promise.reject(new ApiError(401, 'Unknown user'));

        req.user = dbUser.toJSON();
        req.user.salt = req.user.pwd = undefined; // REmove the salt and pwd before return
        // Generate a token {id,expTime} signed with env['TOKEN_SECRET']
        return Util.generateToken({
                id:req.user.id,
                email:req.user.email,
                name:req.user.name,
                isAdmin : req.user.isAdmin
            },nconf.get('TOKEN_SECRET'));
    }).then(function(token) {// Call the next middleware
        req.user.token = token;
        next();
    }).catch(function (err){
        if(!err instanceof ApiError)
            err = new ApiError(err);
        next(err);
    }).done(function(token) {// Call the next middleware
        console.log('Wesh weshouille')
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
 * Check the token given
 *
 */
const checkApiToken = function(req,res,next){
//    console.log(req.headers);
    if(!_.isEmpty('')) {

    }
    // Check if token && token is mine
    // If ok, next(true)
    // Otherwise, throw ForbiddenError('You shall not pass ! Auth yourself first')
    next();
}






/**
 * Exports
 */

// Methods
module.exports = {
      isLogged : isAuth,

    validToken : checkApiToken,

         logMe : logIn,

    registerMe : signUp
};